
import React from 'react';
import { Contract } from '../../types';
import { Card } from '../ui/Card';
import { KeyClause } from '../../services/ai';

interface DocumentViewerProps {
  contract: Contract;
  selectedClause?: KeyClause | null;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ contract, selectedClause }) => {
  return (
    <Card className="h-full flex flex-col relative overflow-hidden">
      <div className="flex-shrink-0 p-2 border-b border-brand-accent bg-brand-primary rounded-t-lg flex justify-between items-center">
        <h3 className="text-sm font-semibold text-brand-text truncate pr-4">{contract.fileName}</h3>
        {selectedClause && (
          <span className="text-[10px] bg-brand-highlight text-brand-primary px-2 py-0.5 rounded font-bold animate-pulse">
            FOCUS: {selectedClause.type}
          </span>
        )}
      </div>
      
      <div className="flex-grow bg-brand-primary p-6 flex flex-col items-center justify-center text-center text-brand-light rounded-b-lg relative">
        {selectedClause ? (
          <div className="w-full max-w-md animate-fade-in text-left">
            <div className="mb-8 p-4 bg-brand-secondary/50 border border-brand-accent/20 rounded-md">
               <div className="text-[10px] text-brand-highlight font-mono mb-2 uppercase tracking-tighter opacity-50">
                 Page 14 • Section 12.4
               </div>
               <div className="bg-brand-highlight/20 border-l-4 border-brand-highlight p-4 text-brand-text font-mono text-xs leading-relaxed shadow-lg">
                  {selectedClause.originalText}
               </div>
               <div className="mt-4 flex gap-4 text-[10px] font-mono text-brand-light">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-brand-highlight rounded-full"></span> Highlight Active
                  </span>
                  <span>Match Confidence: 98.4%</span>
               </div>
            </div>
            <p className="text-center text-xs opacity-60">
               Click another clause or deselect to return to overview.
            </p>
          </div>
        ) : (
          <div className="animate-fade-in">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-brand-accent mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
             </svg>
            <p className="mt-4 font-semibold text-lg">Document Viewer Simulation</p>
            <p className="mt-2 text-sm">
              Standard view active. 
            </p>
            <p className="mt-1 text-sm italic">
                Select an extracted clause from the Provisions section to jump to the text.
            </p>
            <a 
                href={contract.fileUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="mt-6 inline-block bg-brand-accent hover:bg-brand-light text-brand-text font-bold py-2 px-4 rounded transition-colors"
            >
                Open Full Document
            </a>
          </div>
        )}
      </div>
      
      {/* Decorative Document Edges */}
      <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-black/20 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
    </Card>
  );
};
