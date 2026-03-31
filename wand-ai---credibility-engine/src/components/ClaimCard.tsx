import React from 'react';
import { Claim, CredibilityLevel } from '../types';
import { AlertTriangle, CheckCircle, Search, ShieldAlert, ArrowUpRight } from 'lucide-react';

interface Props {
  claim: Claim;
  onVerify: (claim: Claim) => void;
}

const ClaimCard: React.FC<Props> = ({ claim, onVerify }) => {
  const isHigh = claim.credibilityLevel === CredibilityLevel.HIGH;
  const isMedium = claim.credibilityLevel === CredibilityLevel.MEDIUM;
  const isLow = claim.credibilityLevel === CredibilityLevel.LOW;

  const scoreColor = isHigh ? 'text-emerald-400' : isMedium ? 'text-amber-400' : 'text-rose-400';
  const borderColor = isHigh ? 'border-emerald-900/50' : isMedium ? 'border-amber-900/50' : 'border-rose-900/50';
  const bgGradient = isHigh ? 'from-emerald-900/10' : isMedium ? 'from-amber-900/10' : 'from-rose-900/10';

  return (
    <div className={`relative group p-5 rounded-xl border ${borderColor} bg-gradient-to-br ${bgGradient} to-slate-800/50 transition-all hover:border-opacity-100 border-opacity-60`}>
      
      {/* New Indicator */}
      {claim.isNew && (
        <div className="absolute -top-2 -right-2 bg-brand-600 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-pulse shadow-lg shadow-brand-900/50">
          NEW UPDATE
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
            {isHigh && <CheckCircle className="w-5 h-5 text-emerald-500" />}
            {isMedium && <AlertTriangle className="w-5 h-5 text-amber-500" />}
            {isLow && <ShieldAlert className="w-5 h-5 text-rose-500" />}
            <span className={`font-mono text-2xl font-bold ${scoreColor}`}>{claim.credibilityScore}</span>
        </div>
        <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
           {claim.status}
        </div>
      </div>

      {/* Content */}
      <p className="text-slate-200 text-lg leading-relaxed mb-4 font-medium">
        "{claim.text}"
      </p>

      {/* Analysis Section */}
      <div className="bg-slate-900/50 rounded p-3 mb-4 text-sm border border-slate-700/50">
        <p className="text-slate-400 mb-1"><span className="text-slate-500 font-semibold uppercase text-xs">Analysis:</span> {claim.biasAnalysis}</p>
        <p className="text-slate-400"><span className="text-slate-500 font-semibold uppercase text-xs">Context:</span> {claim.context}</p>
      </div>

      {/* Verification Result */}
      {claim.verification?.isVerified && (
        <div className="bg-emerald-900/20 border border-emerald-800/50 rounded p-3 mb-4 text-sm">
             <div className="flex items-center gap-2 mb-1 text-emerald-400">
                <Search className="w-3 h-3" />
                <span className="font-semibold text-xs uppercase">Verified by External Source</span>
             </div>
             <p className="text-emerald-100/80 italic mb-2">"{claim.verification.summary}"</p>
             {claim.verification.sourceUrl && (
                 <a href={claim.verification.sourceUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-brand-400 hover:text-brand-300 text-xs mt-1">
                    {claim.verification.sourceTitle || "Source Link"} <ArrowUpRight className="w-3 h-3" />
                 </a>
             )}
        </div>
      )}

      {/* Actions */}
      {claim.status !== 'verified' && claim.status !== 'analyzing' && (
        <button 
            onClick={() => onVerify(claim)}
            className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium rounded transition-colors flex items-center justify-center gap-2"
        >
            <Search className="w-4 h-4" />
            Launch Deep Verification
        </button>
      )}
       
       {claim.status === 'analyzing' && (
           <div className="w-full py-2 text-center text-xs text-brand-400 animate-pulse">
               Connecting to Knowledge Graph...
           </div>
       )}

    </div>
  );
};

export default ClaimCard;