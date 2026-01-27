
import React from 'react';
import { Contract } from '../../types.ts';
import { DocumentViewer } from '../details/DocumentViewer.tsx';

interface ContractPreviewDrawerProps {
  contract?: Contract;
  onClose: () => void;
  onViewDetails: (id: string) => void;
}

export const ContractPreviewDrawer: React.FC<ContractPreviewDrawerProps> = ({ 
  contract, 
  onClose, 
  onViewDetails 
}) => {
  if (!contract) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity animate-fade-in"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-brand-secondary z-50 shadow-2xl flex flex-col transform transition-transform duration-300 ease-out animate-slide-up sm:animate-none sm:translate-x-0" style={{ animation: 'slideInRight 0.3s ease-out forwards' }}>
        <style>
          {`
            @keyframes slideInRight {
              from { transform: translateX(100%); }
              to { transform: translateX(0); }
            }
          `}
        </style>

        {/* Header */}
        <div className="p-4 border-b border-brand-accent/30 flex justify-between items-center bg-brand-primary">
          <div>
            <h2 className="text-lg font-bold text-brand-highlight truncate">{contract.contractTitle}</h2>
            <p className="text-xs text-brand-light">{contract.parties.join(' vs ')}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-brand-accent/20 rounded-full transition-colors"
          >
            <svg className="w-6 h-6 text-brand-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-brand-primary/50 p-3 rounded-lg border border-brand-accent/20">
                <span className="block text-[10px] uppercase tracking-wider text-brand-light font-bold">Risk Level</span>
                <span className={`text-sm font-bold ${contract.riskScore > 6 ? 'text-red-400' : contract.riskScore > 3 ? 'text-yellow-400' : 'text-green-400'}`}>
                    Score: {contract.riskScore}/10
                </span>
             </div>
             <div className="bg-brand-primary/50 p-3 rounded-lg border border-brand-accent/20">
                <span className="block text-[10px] uppercase tracking-wider text-brand-light font-bold">Expiration</span>
                <span className="text-sm font-bold text-brand-text">{contract.expirationDate}</span>
             </div>
          </div>

          <section>
            <h3 className="text-xs font-bold text-brand-highlight uppercase tracking-widest mb-2">Executive Summary</h3>
            <p className="text-sm text-brand-text leading-relaxed bg-brand-accent/10 p-3 rounded-md border-l-2 border-brand-highlight">
              {contract.executiveSummary}
            </p>
          </section>

          <section className="flex-grow min-h-[400px]">
            <h3 className="text-xs font-bold text-brand-highlight uppercase tracking-widest mb-2">Document Preview</h3>
            <DocumentViewer contract={contract} />
          </section>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-brand-accent/30 bg-brand-primary flex gap-3">
          <button 
            onClick={() => onViewDetails(contract.id)}
            className="flex-grow bg-brand-highlight text-brand-primary font-bold py-3 rounded-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View Full Intelligence
          </button>
          <button 
             onClick={onClose}
             className="px-6 py-3 border border-brand-accent text-brand-light rounded-lg hover:bg-brand-accent/10 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
};
