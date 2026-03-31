import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { Claim, CredibilityLevel, Source, VerificationResult } from "../types";

// Initialize Gemini with API key from environment
const genAI = new GoogleGenerativeAI(process.env.API_KEY || '');

// System prompt for the credibility engine
const SYSTEM_INSTRUCTION = `
You are the Wand Engine, an advanced AI designed to evaluate the credibility of text.
Your goal is to extract factual claims, analyze the source's bias based on its type (e.g., CEO vs. Scientist),
and assign a credibility score (0-100).
- Financial Reports/Press Releases: High potential for positive bias.
- Academic Papers: Lower bias, high methodological weight.
- Marketing/Commercials: High bias, low credibility without external proof.
`;

/**
 * Stage 1: Extraction and Initial Scoring
 */
export const analyzeTextForClaims = async (text: string, source: Source): Promise<Claim[]> => {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: SYSTEM_INSTRUCTION,
  });

  const responseSchema = {
    type: SchemaType.ARRAY,
    items: {
      type: SchemaType.OBJECT,
      properties: {
        claimText: { type: SchemaType.STRING, description: "The atomic factual claim extracted." },
        context: { type: SchemaType.STRING, description: "The immediate context or speaker intent." },
        biasAnalysis: { type: SchemaType.STRING, description: "Why might this be biased?" },
        score: { type: SchemaType.NUMBER, description: "Credibility score 0-100 based on source type and language used." },
      },
      required: ["claimText", "context", "biasAnalysis", "score"]
    }
  };

  const prompt = `
    Analyze the following text from a source of type "${source.type}".
    Source Name: "${source.name}".
    
    Extract key factual claims. For each claim:
    1. Identify if it is a verifiable fact or a subjective opinion.
    2. Analyze bias. (e.g., A CEO saying "We are the best" is low credibility).
    3. Assign a credibility score.
    
    Text:
    """
    ${text}
    """
  `;

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2,
      },
    });

    const response = result.response;
    const rawData = JSON.parse(response.text() || "[]");

    return rawData.map((item: any, index: number) => ({
      id: `${source.id}_claim_${index}_${Date.now()}`,
      text: item.claimText,
      originalText: item.claimText,
      sourceId: source.id,
      credibilityScore: Math.round(item.score),
      credibilityLevel: getLevelFromScore(Math.round(item.score)),
      biasAnalysis: item.biasAnalysis,
      context: item.context,
      status: item.score < 60 ? 'flagged' : 'analyzing',
      isNew: true
    }));

  } catch (error) {
    console.error("Analysis failed", error);
    return [];
  }
};

/**
 * Stage 2: Verification (The "Researcher" Agent)
 * Uses Google Search Grounding to verify low/medium credibility claims.
 */
export const verifyClaimWithSearch = async (claim: Claim): Promise<Claim> => {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-002",
    tools: [{ googleSearchRetrieval: {} }],
  });
  
  const prompt = `
    Fact-check this claim: "${claim.text}".
    Context: ${claim.context}.
    
    Your goal is to determine the TRUTH.
    1. Search for independent evidence.
    2. If the claim is FALSE or MISLEADING, explain why and provide the corrected fact.
    3. If the claim is TRUE, confirm it.
  `;

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const response = result.response;
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    
    let verification: VerificationResult = {
      isVerified: false,
      summary: "No external verification found.",
    };

    if (groundingMetadata?.groundingChuncks && groundingMetadata.groundingChuncks.length > 0) {
      const webSource = groundingMetadata.groundingChuncks.find((c: any) => c.web);
      if (webSource && webSource.web) {
        verification = {
          isVerified: true,
          sourceTitle: webSource.web.title || "Web Source",
          sourceUrl: webSource.web.uri || "",
          summary: response.text() || "Verified via Google Search"
        };
      }
    } else {
      verification.summary = response.text() || "Analysis provided without live search links.";
    }

    // Adjust score based on verification text content analysis
    let newScore = claim.credibilityScore;
    let newStatus = claim.status;

    const lowerSummary = verification.summary.toLowerCase();
    if (lowerSummary.includes("false") || lowerSummary.includes("incorrect") || lowerSummary.includes("misleading") || lowerSummary.includes("contradicts")) {
        newScore = 10;
        newStatus = 'flagged';
    } else if (lowerSummary.includes("true") || lowerSummary.includes("accurate") || lowerSummary.includes("supports")) {
        newScore = Math.min(100, Math.max(80, newScore + 30));
        newStatus = 'verified';
    } else {
        newScore = Math.min(100, newScore + 10);
        newStatus = 'verified';
    }

    return {
      ...claim,
      verification,
      credibilityScore: newScore,
      credibilityLevel: getLevelFromScore(newScore),
      status: newStatus as any
    };

  } catch (error) {
    console.error("Verification failed", error);
    return { ...claim, status: 'flagged' };
  }
};

/**
 * Stage 3: Incremental Update (The "Conflict Resolution" Agent)
 * Merges new claims with old ones to find conflicts or reinforcement.
 */
export const resolveUpdates = async (existingClaims: Claim[], newClaims: Claim[]): Promise<Claim[]> => {
    if (existingClaims.length === 0) return newClaims;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });
    
    const prompt = `
      I have a list of EXISTING claims and a list of NEW claims from a recent update.
      Determine if any NEW claim contradicts or strongly reinforces an EXISTING claim.
      
      EXISTING: ${JSON.stringify(existingClaims.map(c => ({id: c.id, text: c.text})))}
      NEW: ${JSON.stringify(newClaims.map(c => ({id: c.id, text: c.text})))}
      
      Return a JSON array of objects: { "existingId": string, "interaction": "contradicts" | "reinforces" | "neutral", "reason": string }
    `;

    try {
        const result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
          },
        });

        const response = result.response;

        interface Interaction {
            existingId: string;
            interaction: string;
            reason: string;
        }

        const interactions = JSON.parse(response.text() || "[]") as Interaction[];
        
        const interactionMap = new Map<string, Interaction>(interactions.map((i) => [i.existingId, i]));

        const updatedExisting = existingClaims.map(claim => {
            const interact = interactionMap.get(claim.id);
            if (interact) {
                if (interact.interaction === 'contradicts') {
                    return {
                        ...claim,
                        credibilityScore: Math.max(0, claim.credibilityScore - 30),
                        credibilityLevel: CredibilityLevel.LOW,
                        biasAnalysis: `[UPDATE WARNING] Contradicted by newer source: ${interact.reason}`,
                        status: 'flagged' as const
                    };
                }
                if (interact.interaction === 'reinforces') {
                     return {
                        ...claim,
                        credibilityScore: Math.min(100, claim.credibilityScore + 10),
                        biasAnalysis: claim.biasAnalysis + ` [UPDATE] Reinforced by newer source.`,
                    };
                }
            }
            return claim;
        });

        return [...newClaims, ...updatedExisting];

    } catch (e) {
        console.error("Conflict resolution failed", e);
        return [...newClaims, ...existingClaims];
    }
}

/**
 * Stage 4: Refined Report Generation
 * Synthesizes a final output where false claims are removed and facts are enhanced.
 */
export const generateRefinedReport = async (claims: Claim[]): Promise<string> => {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const relevantClaims = claims.map(c => ({
        text: c.text,
        score: c.credibilityScore,
        verification: c.verification?.summary || "Not verified",
        isFlagged: c.status === 'flagged'
    }));

    const prompt = `
        You are an expert Research Editor. 
        Your task is to generate a "Refined Intelligence Report" based on the following extracted claims and their verification status.
        
        Rules for the Report:
        1. **Truth Filter**: Eliminate any claims that are marked as 'flagged' OR have a low credibility score (<50) AND were not corrected by verification.
        2. **Enhancement**: If a claim was verified and the verification offers a correction or more detail, use the VERIFIED TRUTH, not the original claim.
        3. **Synthesis**: Do not just list facts. Weave them into a professional, cohesive narrative.
        4. **Structure**: Use Markdown. Include an Executive Summary, Key Findings, and a Risk/Bias Note.
        
        Input Data:
        ${JSON.stringify(relevantClaims)}
    `;

    try {
        const result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        });
        
        const response = result.response;
        return response.text() || "Failed to generate report.";
    } catch (error) {
        console.error("Report generation failed", error);
        return "An error occurred while generating the refined report.";
    }
};

// Helper
const getLevelFromScore = (score: number): CredibilityLevel => {
  if (score >= 80) return CredibilityLevel.HIGH;
  if (score >= 50) return CredibilityLevel.MEDIUM;
  return CredibilityLevel.LOW;
};
