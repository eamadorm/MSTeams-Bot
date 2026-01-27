
import React, { useState, useMemo, useEffect } from 'react';
import { Contract, IndustryTrack } from './types.ts';
import { mockContracts } from './data/mockData.ts';
import { PortfolioDashboard } from './components/dashboard/PortfolioDashboard.tsx';
import { ContractDetails } from './components/details/ContractDetails.tsx';
import { Header } from './components/ui/Header.tsx';
import { queryContracts, SmartFilterResponse, getContractInsights, PortfolioInsight } from './services/ai.ts';

const App: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>(mockContracts);
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);
  const [industry, setIndustry] = useState<IndustryTrack>('All');
  const [contractType, setContractType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // AI States
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<SmartFilterResponse | null>(null);
  const [globalInsights, setGlobalInsights] = useState<PortfolioInsight[]>([]);

  // Derived list of all contract types for the filter dropdown
  const availableTypes = useMemo(() => {
    const types = Array.from(new Set(contracts.map(c => c.contractType)));
    return types.sort();
  }, [contracts]);

  // Local filter logic (fallback)
  const localFilteredContracts = useMemo(() => {
    return contracts
      .filter(contract => {
        return industry === 'All' || contract.industryTrack === industry;
      })
      .filter(contract => {
        return contractType === 'All' || contract.contractType === contractType;
      })
      .filter(contract => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
          contract.contractTitle.toLowerCase().includes(query) ||
          contract.parties.some(p => p.toLowerCase().includes(query)) ||
          contract.executiveSummary.toLowerCase().includes(query) ||
          contract.governingLaw.toLowerCase().includes(query) ||
          contract.contractType.toLowerCase().includes(query) ||
          contract.tags.some(tag => tag.toLowerCase().includes(query))
        );
      });
  }, [contracts, industry, contractType, searchQuery]);

  // Final filtered set based on local logic OR AI response
  const finalContracts = useMemo(() => {
    if (aiResponse && aiResponse.filteredIds.length > 0) {
      // If AI returned specific IDs, use those (but respect the current filters)
      return contracts.filter(c => 
        aiResponse.filteredIds.includes(c.id) && 
        (industry === 'All' || c.industryTrack === industry) &&
        (contractType === 'All' || c.contractType === contractType)
      );
    }
    return localFilteredContracts;
  }, [contracts, localFilteredContracts, aiResponse, industry, contractType]);

  const selectedContract = useMemo(() => {
    return contracts.find(c => c.id === selectedContractId) || null;
  }, [contracts, selectedContractId]);

  const handleSelectContract = (id: string) => {
    setSelectedContractId(id);
  };

  const handleBackToDashboard = () => {
    setSelectedContractId(null);
  };

  const handleAddTag = (contractId: string, tag: string) => {
    setContracts(prev => prev.map(c => {
        if (c.id === contractId && !c.tags.includes(tag)) {
            return { ...c, tags: [...c.tags, tag] };
        }
        return c;
    }));
  };

  const handleRemoveTag = (contractId: string, tag: string) => {
    setContracts(prev => prev.map(c => {
        if (c.id === contractId) {
            return { ...c, tags: c.tags.filter(t => t !== tag) };
        }
        return c;
    }));
  };

  const handleAskAI = async (query: string) => {
    if (!query.trim()) return;
    setAiLoading(true);
    try {
      const result = await queryContracts(query, contracts);
      setAiResponse(result);
    } catch (error) {
      console.error("AI Query failed", error);
    } finally {
      setAiLoading(false);
    }
  };

  const clearAiResults = () => {
    setAiResponse(null);
    setSearchQuery('');
  };

  // Load initial insights
  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const insights = await getContractInsights(contracts);
        setGlobalInsights(insights);
      } catch (e) {
        setGlobalInsights([]);
      }
    };
    fetchInsights();
  }, [contracts]);

  return (
    <div className="min-h-screen bg-brand-primary selection:bg-brand-highlight/30">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {selectedContract ? (
          <ContractDetails contract={selectedContract} onBack={handleBackToDashboard} />
        ) : (
          <PortfolioDashboard
            contracts={finalContracts}
            onSelectContract={handleSelectContract}
            industry={industry}
            setIndustry={(i) => { setIndustry(i); setAiResponse(null); }}
            contractType={contractType}
            setContractType={(t) => { setContractType(t); setAiResponse(null); }}
            availableTypes={availableTypes}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onAskAI={handleAskAI}
            isAiLoading={aiLoading}
            aiResponse={aiResponse}
            onClearAi={clearAiResults}
            globalInsights={globalInsights}
            onAddTag={handleAddTag}
            onRemoveTag={handleRemoveTag}
          />
        )}
      </main>
    </div>
  );
};

export default App;
