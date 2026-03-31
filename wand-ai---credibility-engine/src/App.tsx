import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  RefreshCcw, 
  Plus, 
  Activity, 
  LayoutDashboard,
  FileCheck2,
  Sparkles
} from 'lucide-react';

import { analyzeTextForClaims, verifyClaimWithSearch, resolveUpdates, generateRefinedReport } from './services/geminiService';
import { Claim, Source, SourceType, ResearchState } from './types';
import ClaimCard from './components/ClaimCard';

// Initial Demo Data
const INITIAL_SOURCE = `
Source: Q3 Earnings Call - TechCorp CEO (Transcript)
"Ladies and gentlemen, TechCorp has had an unprecedented year. 
We have achieved 300% growth in our AI sector, making us the undisputed market leader in generative AI.
Our cybersecurity protocol, 'IronWall', is unbreachable by any known quantum computing attack.
While the market is volatile, our churn rate is effectively zero."
`;

const INITIAL_UPDATE_SOURCE = `
Source: TechCorp Internal Audit & Independent Benchmark (Confidential)
"The AI sector growth is actually 45% year-over-year. The 300% figure aggregates three years of data misleadingly.
Regarding 'IronWall', recent penetration tests by SecuriLab showed vulnerabilities to standard brute force, let alone quantum attacks.
Churn rate has increased to 5% this quarter due to pricing changes."
`;

function App() {
  const [view, setView] = useState<'dashboard' | 'report'>('dashboard');
  const [inputText, setInputText] = useState(INITIAL_SOURCE);
  const [reportText, setReportText] = useState<string | null>(null);
  const [researchState, setResearchState] = useState<ResearchState>({
    sources: [],
    claims: [],
    isProcessing: false,
    processingStage: 'Idle'
  });

  // Action: Start Initial Research
  const handleAnalyze = async () => {
    if (!inputText.trim()) return;

    setResearchState(prev => ({ ...prev, isProcessing: true, processingStage: 'Extracting Claims & Bias...' }));

    const newSource: Source = {
      id: `src_${Date.now()}`,
      name: "User Input / Document",
      type: SourceType.USER_INPUT,
      content: inputText,
      timestamp: Date.now()
    };

    const extractedClaims = await analyzeTextForClaims(inputText, newSource);

    setResearchState(prev => ({
      sources: [...prev.sources, newSource],
      claims: extractedClaims, 
      isProcessing: false,
      processingStage: 'Complete'
    }));
  };

  // Action: Add Update (Incremental)
  const handleUpdate = async () => {
     setResearchState(prev => ({ ...prev, isProcessing: true, processingStage: 'Processing Incremental Update...' }));
     setInputText(INITIAL_UPDATE_SOURCE); // Auto-fill for demo purposes

     const newSource: Source = {
        id: `src_update_${Date.now()}`,
        name: "Supplemental Source (Audit)",
        type: SourceType.SUPPLEMENTAL_UPDATE,
        content: INITIAL_UPDATE_SOURCE,
        timestamp: Date.now()
     };

     // 1. Extract new claims
     const newClaims = await analyzeTextForClaims(INITIAL_UPDATE_SOURCE, newSource);
     
     // 2. Resolve conflicts with existing claims (The O(1) optimization logic)
     setResearchState(prev => ({ ...prev, processingStage: 'Resolving Conflicts...' }));
     const mergedClaims = await resolveUpdates(researchState.claims, newClaims);

     setResearchState(prev => ({
         sources: [...prev.sources, newSource],
         claims: mergedClaims,
         isProcessing: false,
         processingStage: 'Update Merged'
     }));
  };

  // Action: Verify a specific claim
  const handleVerify = async (claimToVerify: Claim) => {
    // Optimistic UI update
    setResearchState(prev => ({
        ...prev,
        claims: prev.claims.map(c => c.id === claimToVerify.id ? { ...c, status: 'analyzing' } : c)
    }));

    const verifiedClaim = await verifyClaimWithSearch(claimToVerify);

    setResearchState(prev => ({
        ...prev,
        claims: prev.claims.map(c => c.id === claimToVerify.id ? verifiedClaim : c)
    }));
  };

  // Action: Generate Final Refined Report
  const handleGenerateReport = async () => {
      setView('report');
      if (reportText) return; // Don't regenerate if exists
      
      setResearchState(prev => ({ ...prev, isProcessing: true, processingStage: 'Synthesizing Final Report...' }));
      const report = await generateRefinedReport(researchState.claims);
      setReportText(report);
      setResearchState(prev => ({ ...prev, isProcessing: false, processingStage: 'Complete' }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center shadow-lg shadow-brand-500/20">
              <ShieldCheck className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">WAND<span className="text-brand-500">AI</span></span>
          </div>
          <div className="flex gap-4">
             <button 
                onClick={() => setView('dashboard')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${view === 'dashboard' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
             >
                <LayoutDashboard className="w-4 h-4" /> Dashboard
             </button>
             <button 
                onClick={() => setView('report')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${view === 'report' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
             >
                <FileCheck2 className="w-4 h-4" /> Refined Report
             </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        
        {view === 'report' && (
            <div className="flex-1 overflow-y-auto p-8 max-w-5xl mx-auto w-full">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 shadow-2xl">
                    <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                                <Sparkles className="text-brand-400 w-8 h-8" />
                                Refined Intelligence Report
                            </h1>
                            <p className="text-slate-400 mt-2">
                                Auto-synthesized document where false claims are removed and facts are enhanced by Deep Search.
                            </p>
                        </div>
                        <button 
                            onClick={() => { setReportText(null); handleGenerateReport(); }}
                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded text-sm font-medium transition-colors"
                        >
                            <RefreshCcw className="w-4 h-4 inline mr-2" /> Regenerate
                        </button>
                    </div>

                    {researchState.isProcessing && !reportText ? (
                        <div className="flex flex-col items-center justify-center py-20 space-y-4">
                            <Activity className="w-12 h-12 text-brand-500 animate-spin" />
                            <p className="text-brand-200 animate-pulse">Synthesizing verified facts into final report...</p>
                        </div>
                    ) : (
                        <div className="prose prose-invert prose-lg max-w-none">
                            {reportText ? (
                                <div className="whitespace-pre-line leading-relaxed text-slate-300">
                                    {reportText}
                                </div>
                            ) : (
                                <div className="text-center py-20">
                                    <p className="text-slate-500">No report generated yet. Click "Regenerate" to start.</p>
                                    <button 
                                        onClick={handleGenerateReport} 
                                        className="mt-4 px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-bold shadow-lg shadow-brand-900/40"
                                    >
                                        Generate Report
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        )}

        {view === 'dashboard' && (
          <div className="flex-1 flex max-w-7xl mx-auto w-full">
            
            {/* Left Column: Ingestion */}
            <aside className="w-[400px] border-r border-slate-800 bg-slate-900/30 flex flex-col">
              <div className="p-6 border-b border-slate-800">
                 <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Source Material
                 </h2>
                 <textarea 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="w-full h-64 bg-slate-900 border border-slate-700 rounded-lg p-4 text-sm font-mono text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none mb-4"
                    placeholder="Paste report text, transcript, or abstract here..."
                 />
                 
                 <div className="flex gap-2">
                    <button 
                        onClick={handleAnalyze}
                        disabled={researchState.isProcessing}
                        className="flex-1 bg-brand-600 hover:bg-brand-500 text-white py-2 rounded-md font-medium transition-all shadow-lg shadow-brand-900/20 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {researchState.isProcessing ? <Activity className="w-4 h-4 animate-spin"/> : <RefreshCcw className="w-4 h-4" />}
                        Run Analysis
                    </button>
                 </div>
              </div>

              {/* Source List / Update Panel */}
              <div className="flex-1 p-6 overflow-y-auto">
                 <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
                    <Activity className="w-4 h-4" /> Active Sources
                 </h2>
                 <div className="space-y-3">
                    {researchState.sources.map(src => (
                        <div key={src.id} className="p-3 bg-slate-800 rounded border border-slate-700 text-xs text-slate-300 flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${src.type === SourceType.SUPPLEMENTAL_UPDATE ? 'bg-amber-500' : 'bg-brand-500'}`} />
                            <div className="flex-1">
                                <div className="font-bold truncate">{src.name}</div>
                                <div className="text-slate-500 text-[10px] uppercase">{src.type}</div>
                            </div>
                        </div>
                    ))}
                    
                    {researchState.sources.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-slate-800">
                            <p className="text-xs text-slate-400 mb-3">
                                Provide an additional source file/text to update existing research.
                            </p>
                            <button 
                                onClick={handleUpdate}
                                disabled={researchState.isProcessing}
                                className="w-full border border-dashed border-slate-600 text-slate-400 hover:text-brand-400 hover:border-brand-500 py-3 rounded-lg flex items-center justify-center gap-2 text-sm transition-all"
                            >
                                <Plus className="w-4 h-4" />
                                Ingest Supplemental Update
                            </button>
                        </div>
                    )}
                 </div>
              </div>
            </aside>

            {/* Right Column: Research Feed */}
            <section className="flex-1 bg-slate-950 p-8 overflow-y-auto">
              <div className="flex justify-between items-end mb-8">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Credibility Assessment</h1>
                    <p className="text-slate-400">Real-time evaluation of factual claims, bias, and context.</p>
                  </div>
                  {researchState.isProcessing && (
                      <div className="flex items-center gap-3 bg-brand-900/20 border border-brand-500/30 px-4 py-2 rounded-full">
                          <div className="w-2 h-2 bg-brand-400 rounded-full animate-pulse-fast"></div>
                          <span className="text-brand-300 text-sm font-medium">{researchState.processingStage}</span>
                      </div>
                  )}
              </div>

              {/* Claims Grid */}
              <div className="grid grid-cols-1 gap-6 pb-20">
                 {researchState.claims.length === 0 && !researchState.isProcessing && (
                     <div className="text-center py-20 opacity-50">
                         <ShieldCheck className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                         <p className="text-xl text-slate-500">Ready to analyze. Paste text to begin.</p>
                     </div>
                 )}

                 {researchState.claims.map((claim) => (
                     <ClaimCard key={claim.id} claim={claim} onVerify={handleVerify} />
                 ))}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
