
import React, { useState } from 'react';
import { Contract } from '../../types.ts';
import { AI_Summary } from './AI_Summary.tsx';
import { AI_ExtractedData } from './AI_ExtractedData.tsx';
import { DocumentViewer } from './DocumentViewer.tsx';
import { DueDiligenceChecklist } from './DueDiligenceChecklist.tsx';
import { KeyClauses } from './KeyClauses.tsx';
import { BackIcon } from '../ui/Icons.tsx';
import { KeyClause } from '../../services/ai.ts';

interface ContractDetailsProps {
  contract: Contract;
  onBack: () => void;
}

export const ContractDetails: React.FC<ContractDetailsProps> = ({ contract, onBack }) => {
  const [activeClause, setActiveClause] = useState<KeyClause | null>(null);

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
         <button onClick={onBack} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-brand-text bg-brand-accent hover:bg-brand-light hover:text-brand-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-primary focus:ring-brand-highlight transition-colors duration-200">
            <BackIcon className="w-5 h-5 mr-2" />
            Back to Dashboard
        </button>
        <div className="text-xs text-brand-light font-mono bg-brand-secondary/50 px-3 py-1 rounded border border-brand-accent/30">
          Ref ID: {contract.id}
        </div>
       </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: AI Intel & Data */}
            <div className="lg:col-span-7 space-y-6">
                <AI_Summary contract={contract} />
                <AI_ExtractedData contract={contract} />
                <KeyClauses 
                  contract={contract} 
                  onClauseSelect={setActiveClause} 
                  selectedClause={activeClause}
                />
            </div>

            {/* Right Column: Checklist & Document */}
            <div className="lg:col-span-5 space-y-6 flex flex-col min-h-[600px]">
                <DueDiligenceChecklist contract={contract} />
                <DocumentViewer contract={contract} selectedClause={activeClause} />
            </div>
        </div>
    </div>
  );
};
