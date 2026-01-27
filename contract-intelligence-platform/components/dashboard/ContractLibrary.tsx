
import React, { useState } from 'react';
import { Contract } from '../../types';
import { Card } from '../ui/Card';

interface ContractLibraryProps {
  contracts: Contract[];
  onSelectContract: (id: string) => void;
  onAddTag: (id: string, tag: string) => void;
  onRemoveTag: (id: string, tag: string) => void;
}

const RiskScoreBadge: React.FC<{ score: number }> = ({ score }) => {
    let colorClasses = 'bg-gray-500';
    if (score <= 3) colorClasses = 'bg-green-600/20 text-green-400 border border-green-600/50';
    else if (score <= 6) colorClasses = 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/50';
    else colorClasses = 'bg-red-600/20 text-red-400 border border-red-600/50';

    return (
        <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-bold rounded-full ${colorClasses}`}>
            {score}
        </span>
    );
};

const isExpiringSoon = (dateStr: string): boolean => {
  const today = new Date();
  const expirationDate = new Date(dateStr);
  const ninetyDaysFromNow = new Date();
  ninetyDaysFromNow.setDate(today.getDate() + 90);
  
  return expirationDate > today && expirationDate <= ninetyDaysFromNow;
};

const TagInput: React.FC<{ onAdd: (tag: string) => void }> = ({ onAdd }) => {
    const [value, setValue] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (value.trim()) {
            onAdd(value.trim());
            setValue('');
            setIsEditing(false);
        }
    };

    if (!isEditing) {
        return (
            <button 
                onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
                className="text-[10px] bg-brand-accent/30 text-brand-light px-1.5 rounded border border-dashed border-brand-accent hover:border-brand-highlight hover:text-brand-highlight transition-all"
            >
                + Tag
            </button>
        );
    }

    return (
        <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()} className="flex">
            <input 
                autoFocus
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onBlur={() => setIsEditing(false)}
                className="text-[10px] bg-brand-primary border border-brand-highlight rounded px-1 w-20 outline-none"
                placeholder="New tag..."
            />
        </form>
    );
};

export const ContractLibrary: React.FC<ContractLibraryProps> = ({ contracts, onSelectContract, onAddTag, onRemoveTag }) => {
  return (
    <Card className="border border-brand-accent/20">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-brand-text">Portfolio Inventory</h3>
        <span className="text-xs text-brand-light uppercase tracking-widest">{contracts.length} Items</span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-brand-accent/30">
          <thead>
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-[10px] font-bold text-brand-light uppercase tracking-widest">Contract Title</th>
              <th scope="col" className="px-6 py-4 text-left text-[10px] font-bold text-brand-light uppercase tracking-widest">Counterparty</th>
              <th scope="col" className="px-6 py-4 text-left text-[10px] font-bold text-brand-light uppercase tracking-widest">AI Summary</th>
              <th scope="col" className="px-6 py-4 text-left text-[10px] font-bold text-brand-light uppercase tracking-widest">Risk Index</th>
              <th scope="col" className="px-6 py-4 text-left text-[10px] font-bold text-brand-light uppercase tracking-widest">Expires</th>
              <th scope="col" className="px-6 py-4 text-left text-[10px] font-bold text-brand-light uppercase tracking-widest">Tags</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-accent/10">
            {contracts.map(contract => {
              const expiring = isExpiringSoon(contract.expirationDate);
              return (
                <tr key={contract.id} onClick={() => onSelectContract(contract.id)} className="hover:bg-brand-highlight/5 group cursor-pointer transition-all duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-brand-text group-hover:text-brand-highlight truncate max-w-[200px]" title={contract.contractTitle}>
                        {contract.contractTitle}
                    </div>
                    <div className="text-[10px] text-brand-light">{contract.contractType} • {contract.industryTrack}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-brand-light">{contract.parties[1] || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative group/summary max-w-[200px]">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-3 h-3 text-brand-highlight/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <p className="text-[11px] text-brand-light/90 truncate italic">
                          {contract.executiveSummary}
                        </p>
                      </div>
                      {/* Tooltip on hover */}
                      <div className="absolute z-20 invisible group-hover/summary:visible bg-brand-secondary/95 backdrop-blur-md border border-brand-highlight/30 p-3 rounded-lg shadow-2xl text-[11px] text-brand-text w-64 -left-2 top-full mt-2 pointer-events-none ring-1 ring-white/10 leading-relaxed transition-opacity duration-200 opacity-0 group-hover/summary:opacity-100">
                        <div className="text-brand-highlight font-bold mb-1 uppercase text-[9px] tracking-wider">AI Executive Abstract</div>
                        {contract.executiveSummary}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap"><RiskScoreBadge score={contract.riskScore} /></td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-mono ${expiring ? 'text-amber-400 font-bold' : 'text-brand-light'}`}>
                        {contract.expirationDate}
                      </span>
                      {expiring && (
                        <span className="bg-amber-400/10 text-amber-400 text-[10px] px-1.5 py-0.5 rounded border border-amber-400/30 uppercase font-bold animate-pulse">
                          Urgent
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1 items-center max-w-[250px]">
                      {contract.tags?.map(tag => (
                        <span key={tag} className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-brand-accent/20 text-brand-highlight text-[10px] border border-brand-accent/30 group/tag hover:bg-brand-highlight/10">
                            {tag}
                            <button 
                                onClick={(e) => { e.stopPropagation(); onRemoveTag(contract.id, tag); }}
                                className="opacity-0 group-tag-hover:opacity-100 transition-opacity hover:text-red-400"
                            >
                                <svg className="w-2 h-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </span>
                      ))}
                      <TagInput onAdd={(tag) => onAddTag(contract.id, tag)} />
                    </div>
                  </td>
                </tr>
              );
            })}
             {contracts.length === 0 && (
                <tr>
                    <td colSpan={6} className="text-center py-16 text-brand-light">
                      <div className="flex flex-col items-center">
                        <svg className="w-12 h-12 mb-3 text-brand-accent opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p>No matches found for your intelligence query.</p>
                      </div>
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
