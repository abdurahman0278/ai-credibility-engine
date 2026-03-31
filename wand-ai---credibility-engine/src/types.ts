export enum CredibilityLevel {
  HIGH = 'HIGH',       // Validated by independent sources, neutral tone
  MEDIUM = 'MEDIUM',   // Plausible but requires context or has slight bias
  LOW = 'LOW',         // Heavy bias, sales language, or contradicted by facts
  UNKNOWN = 'UNKNOWN'
}

export enum SourceType {
  FINANCIAL_REPORT = 'Financial Report',
  PRESS_RELEASE = 'Press Release',
  NEWS_ARTICLE = 'News Article',
  ACADEMIC_PAPER = 'Academic Paper',
  USER_INPUT = 'User Input',
  SUPPLEMENTAL_UPDATE = 'Supplemental Update'
}

export interface VerificationResult {
  isVerified: boolean;
  sourceUrl?: string;
  sourceTitle?: string;
  summary: string;
}

export interface Claim {
  id: string;
  text: string;
  originalText: string;
  sourceId: string;
  credibilityScore: number; // 0-100
  credibilityLevel: CredibilityLevel;
  biasAnalysis: string;
  context: string;
  verification?: VerificationResult;
  isNew?: boolean; // For highlighting updates
  status: 'pending' | 'analyzing' | 'verified' | 'flagged';
}

export interface Source {
  id: string;
  name: string;
  type: SourceType;
  content: string;
  timestamp: number;
}

export interface ResearchState {
  sources: Source[];
  claims: Claim[];
  isProcessing: boolean;
  processingStage: string;
}