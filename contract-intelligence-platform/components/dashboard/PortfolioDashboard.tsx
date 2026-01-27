
import React, { useState } from 'react';
import { Contract, IndustryTrack } from '../../types.ts';
import { useCalculatedMetrics } from '../../hooks/useCalculatedMetrics.ts';
import { IndustrySelector } from './IndustrySelector.tsx';
import { ContractTypeSelector } from './ContractTypeSelector.tsx';
import { KPIWidget } from './KPIWidget.tsx';
import { RiskByTypeChart } from './RiskByTypeChart.tsx';
import { RiskDistributionChart } from './RiskDistributionChart.tsx';
import { GoverningLawChart } from './GoverningLawChart.tsx';
import { NLQ_Search } from './NLQ_Search.tsx';
import { ContractLibrary } from './ContractLibrary.tsx';
import { CalendarIcon, DocumentIcon, RiskIcon, ValueIcon } from '../ui/Icons.tsx';
import { SmartFilterResponse, PortfolioInsight } from '../../services/ai.ts';
import { Card } from '../ui/Card.tsx';
import { ContractPreviewDrawer } from './ContractPreviewDrawer.tsx';

interface PortfolioDashboardProps {
  contracts: Contract[];
  onSelectContract: (id: string) => void;
  industry: IndustryTrack;
  setIndustry: (industry: IndustryTrack) => void;
  contractType: string;
  setContractType: (type: string) => void;
  availableTypes: string[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onAskAI: (query: string) => void;
  isAiLoading: boolean;
  aiResponse: SmartFilterResponse | null;
  onClearAi: () => void;
  globalInsights: PortfolioInsight[];
  onAddTag: (id: string, tag: string) => void;
  onRemoveTag: (id: string, tag: string) => void;
}

const InsightIcon = ({ category }: { category: PortfolioInsight['category'] }) => {
  switch (category) {
    case 'risk':
      return (
        <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
    case 'milestone':
      return (
        <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'compliance':
      return (
        <svg className="w-5 h-5 text-brand-highlight" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
    default:
      return (
        <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
  }
};

export const PortfolioDashboard: React.FC<PortfolioDashboardProps> = ({
  contracts,
  onSelectContract,
  industry,
  setIndustry,
  contractType,
  setContractType,
  availableTypes,
  searchQuery,
  setSearchQuery,
  onAskAI,
  isAiLoading,
  aiResponse,
  onClearAi,
  globalInsights,
  onAddTag,
  onRemoveTag
}) => {
  const [previewId, setPreviewId] = useState<string | null>(null);

  const {
    totalContracts,
    avgRiskScore,
    expiringSoon,
    riskByTypeData,
    riskDistributionData,
    governingLawData,
  } = useCalculatedMetrics(contracts);

  const previewContract = contracts.find(c => c.id === previewId);

  return (
    <div className="space-y-6 relative overflow-hidden pb-12">
      {/* AI Portfolio Insights Section */}
      {globalInsights.length > 0 && !aiResponse && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
             <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-highlight opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-highlight"></span>
                </span>
                <h4 className="text-[10px] font-black text-brand-highlight uppercase tracking-[0.2em]">Strategic Intelligence Center</h4>
             </div>
             <div className="text-[9px] font-mono text-brand-light/60 px-2 py-0.5 rounded-full border border-brand-light/20 bg-brand-secondary/40 backdrop-blur-md">GEMINI 3 PRO PREVIEW</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {globalInsights.map((insight, idx) => (
              <div 
                key={idx} 
                className="group relative bg-brand-secondary/30 backdrop-blur-xl border border-brand-highlight/10 hover:border-brand-highlight/30 p-4 rounded-xl shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-highlight/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none"></div>
                
                <div className="flex items-start gap-3 relative z-10">
                  <div className="flex-shrink-0 p-2 bg-brand-primary/50 rounded-lg border border-brand-accent/20 group-hover:border-brand-highlight/30 transition-colors">
                    <InsightIcon category={insight.category} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="text-sm font-bold text-brand-text group-hover:text-brand-highlight transition-colors leading-tight">
                        {insight.title}
                      </h5>
                      {insight.priority === 'High' && (
                        <span className="text-[8px] bg-red-500/20 text-red-400 px-1 rounded border border-red-500/30 font-bold uppercase">Critical</span>
                      )}
                    </div>
                    <p className="text-xs text-brand-light leading-relaxed font-medium">
                      {insight.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Filter Result Message */}
      {aiResponse && (
        <Card className="border-2 border-brand-highlight/40 bg-brand-secondary/80 animate-slide-up relative overflow-hidden">
           <div className="absolute top-0 right-0 p-1 opacity-10">
              <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
           </div>
           <div className="flex justify-between items-start mb-3">
              <h4 className="font-bold text-brand-highlight flex items-center gap-2 text-xs uppercase tracking-widest">
                <span className="flex h-2 w-2 rounded-full bg-brand-highlight animate-pulse shadow-[0_0_8px_rgba(56,189,248,0.6)]"></span>
                AI Agent Report
              </h4>
              <button onClick={onClearAi} className="text-brand-light hover:text-brand-highlight text-[10px] font-bold uppercase tracking-tighter border border-brand-accent/30 rounded px-2 py-1 transition-all">Reset Filter</button>
           </div>
           <p className="text-brand-text mb-4 text-base font-medium leading-snug">
             {aiResponse.answer}
           </p>
           <div className="text-[10px] text-brand-light bg-brand-primary/40 p-3 rounded-lg border border-brand-accent/20 shadow-inner">
              <span className="font-bold text-brand-highlight/60 mr-1 uppercase">Reasoning:</span> {aiResponse.filterReasoning}
           </div>
        </Card>
      )}

      {/* Header Controls */}
      <div className="flex flex-col gap-4">
        <div className="w-full">
            <NLQ_Search query={searchQuery} setQuery={setSearchQuery} onAskAI={onAskAI} isAiLoading={isAiLoading} />
        </div>
        <div className="flex flex-col md:flex-row gap-4">
            <IndustrySelector selectedIndustry={industry} onChange={setIndustry} />
            <ContractTypeSelector selectedType={contractType} onChange={setContractType} availableTypes={availableTypes} />
        </div>
      </div>

      {/* KPI Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPIWidget title="Filtered Contracts" value={totalContracts} icon={<DocumentIcon className="h-8 w-8 text-brand-highlight" />} />
        <KPIWidget title="Avg Group Risk" value={avgRiskScore} icon={<RiskIcon className="h-8 w-8 text-brand-highlight" />} />
        <KPIWidget title="Expiring (90 Days)" value={expiringSoon} icon={<CalendarIcon className="h-8 w-8 text-brand-highlight" />} />
        <KPIWidget title="Total Exposure" value="$1.2B" icon={<ValueIcon className="h-8 w-8 text-brand-highlight" />} note="(Estimated)" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RiskByTypeChart data={riskByTypeData} />
        <RiskDistributionChart data={riskDistributionData} />
        <GoverningLawChart data={governingLawData} />
      </div>

      {/* Contract Library Table */}
      <div>
        <ContractLibrary 
          contracts={contracts} 
          onSelectContract={setPreviewId} 
          onAddTag={onAddTag}
          onRemoveTag={onRemoveTag}
        />
      </div>

      {/* Preview Side Drawer */}
      <ContractPreviewDrawer 
        contract={previewContract} 
        onClose={() => setPreviewId(null)} 
        onViewDetails={(id) => {
            setPreviewId(null);
            onSelectContract(id);
        }}
      />
    </div>
  );
};
