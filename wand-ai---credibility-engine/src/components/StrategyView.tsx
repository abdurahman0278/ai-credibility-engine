import React from 'react';
import { Network, Cpu, DollarSign, Layers, ShieldCheck, Zap } from 'lucide-react';

const StrategyView: React.FC = () => {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12 text-slate-300">
      
      {/* Header */}
      <div className="border-b border-slate-700 pb-6">
        <h2 className="text-3xl font-bold text-white mb-2">System Strategy & Architecture</h2>
        <p className="text-slate-400">High-level overview of scaling, monetization, and optimization for the Wand Engine.</p>
      </div>

      {/* Architecture */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <Layers className="w-8 h-8 text-brand-500" />
          <h3 className="text-2xl font-semibold text-white">Solution Architecture</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h4 className="text-lg font-medium text-brand-400 mb-2">Ingestion & Orchestration</h4>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li><strong>Queue System (Kafka/SQS):</strong> Decouples ingestion from processing to handle high throughput of documents (e.g., Pitchbook dumps).</li>
              <li><strong>Document Parser:</strong> Optical Character Recognition (OCR) and layout analysis for PDFs/Slides using Gemini 2.5 Flash Multimodal capabilities.</li>
              <li><strong>Agent Orchestrator:</strong> LangChain or custom State Machine to manage the "Analyst → Skeptic → Researcher" agent flow.</li>
            </ul>
          </div>
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
             <h4 className="text-lg font-medium text-brand-400 mb-2">Knowledge Graph & Storage</h4>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li><strong>Vector Database (Pinecone/Weaviate):</strong> Stores claims as embeddings. Critical for the "Incremental Update" requirement to perform O(1) similarity searches instead of O(N) re-reads.</li>
              <li><strong>Graph DB (Neo4j):</strong> Maps relationships between Sources (Entities) and Claims to track reputation over time.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Scaling & Optimization */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <Cpu className="w-8 h-8 text-emerald-500" />
          <h3 className="text-2xl font-semibold text-white">Scaling & Optimization</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
           <div className="bg-slate-900 p-5 rounded border border-slate-800">
              <h4 className="font-semibold text-white mb-2">Incremental Updates</h4>
              <p className="text-sm text-slate-400">
                Instead of reprocessing the whole corpus, we extract new claims and use <strong>Vector Similarity</strong> to find only related existing claims. This ensures computational overhead is proportional to the <em>update size</em>, not the <em>total dataset size</em>.
              </p>
           </div>
           <div className="bg-slate-900 p-5 rounded border border-slate-800">
              <h4 className="font-semibold text-white mb-2">Tiered Model Usage</h4>
              <p className="text-sm text-slate-400">
                Use <strong>Gemini 2.5 Flash</strong> for initial extraction/scoring (low cost/latency). Escalate only low-confidence or high-impact claims to <strong>Gemini 3 Pro</strong> for deep reasoning, optimizing cost-per-claim.
              </p>
           </div>
           <div className="bg-slate-900 p-5 rounded border border-slate-800">
              <h4 className="font-semibold text-white mb-2">Caching Layer</h4>
              <p className="text-sm text-slate-400">
                Cache verification results for common public claims (e.g., "Earth is round") in Redis to prevent redundant Google Search API calls.
              </p>
           </div>
        </div>
      </section>

      {/* Monetization */}
      <section className="space-y-6">
         <div className="flex items-center gap-3 mb-4">
          <DollarSign className="w-8 h-8 text-amber-500" />
          <h3 className="text-2xl font-semibold text-white">Monetization & GTM</h3>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <table className="w-full text-left text-sm">
            <thead className="text-slate-400 border-b border-slate-600">
              <tr>
                <th className="pb-3">Tier</th>
                <th className="pb-3">Features</th>
                <th className="pb-3">Target</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              <tr>
                <td className="py-3 font-medium text-white">API Pay-per-Verify</td>
                <td className="py-3">Usage-based pricing per claim analyzed. Great for integration into existing LLM pipelines.</td>
                <td className="py-3">Developers / AI Startups</td>
              </tr>
               <tr>
                <td className="py-3 font-medium text-white">Enterprise Platform</td>
                <td className="py-3">Private deployment (VPC), custom bias rules, unlimited Pitchbook/Bloomberg integrations.</td>
                <td className="py-3">Hedge Funds / Legal / Pharma</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default StrategyView;
