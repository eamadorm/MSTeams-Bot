
import React, { useState, useEffect } from 'react';
import { Contract } from '../../types';
import { Card } from '../ui/Card';
import { extractKeyClauses, KeyClause } from '../../services/ai';

interface KeyClausesProps {
  contract: Contract;
  onClauseSelect: (clause: KeyClause | null) => void;
  selectedClause: KeyClause | null;
}

export const KeyClauses: React.FC<KeyClausesProps> = ({ contract, onClauseSelect, selectedClause }) => {
  const [clauses, setClauses] = useState<KeyClause[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClauses = async () => {
      setLoading(true);
      const data = await extractKeyClauses(contract);
      setClauses(data);
      setLoading(false);
    };
    fetchClauses();
  }, [contract.id]);

  return (
    <Card className="border border-brand-accent/20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-brand-text">Key Provisions</h3>
          <p className="text-xs text-brand-light font-mono">AI-Augmented Extraction</p>
        </div>
        {loading && (
          <div className="flex items-center gap-2 text-brand-highlight text-xs animate-pulse">
            <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing Document...
          </div>
        )}
      </div>

      <div className="space-y-3">
        {clauses.map((clause, idx) => {
          const isSelected = selectedClause?.type === clause.type;
          const riskColors = {
            Low: 'text-green-400 bg-green-400/10 border-green-400/20',
            Medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
            High: 'text-red-400 bg-red-400/10 border-red-400/20'
          };

          return (
            <div
              key={idx}
              onClick={() => onClauseSelect(isSelected ? null : clause)}
              className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 group relative overflow-hidden ${
                isSelected 
                  ? 'bg-brand-highlight/10 border-brand-highlight shadow-[0_0_15px_rgba(56,189,248,0.1)]' 
                  : 'bg-brand-primary/40 border-brand-accent/30 hover:border-brand-accent hover:bg-brand-primary/60'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`text-xs font-bold uppercase tracking-wider ${isSelected ? 'text-brand-highlight' : 'text-brand-light'}`}>
                  {clause.type}
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded border ${riskColors[clause.riskLevel]}`}>
                  {clause.riskLevel} Risk
                </span>
              </div>
              <p className={`text-sm mb-2 ${isSelected ? 'text-brand-text font-medium' : 'text-brand-text/80'}`}>
                {clause.summary}
              </p>
              <div className={`text-[11px] font-mono p-2 rounded bg-black/30 border border-white/5 transition-all overflow-hidden ${
                isSelected ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <span className="text-brand-light/60 block mb-1 italic">// Original Text Snippet</span>
                <span className="text-brand-light">{clause.originalText}</span>
              </div>
              
              {/* Interaction Indicator */}
              <div className="absolute right-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className={`w-4 h-4 ${isSelected ? 'text-brand-highlight' : 'text-brand-light'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
          );
        })}
        
        {!loading && clauses.length === 0 && (
          <div className="text-center py-6 text-brand-light italic text-sm">
            Unable to extract specific provisions for this document type.
          </div>
        )}
      </div>
    </Card>
  );
};
