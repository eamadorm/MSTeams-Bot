
import React from 'react';
import { Plus, Cpu, Clock, Link as LinkIcon, Layers, Code2, Network, GitMerge, UserCheck, Database, Hash, BarChart3, Activity, Scan, FileText, CheckCircle2, PenTool, Zap, Settings2 } from 'lucide-react';
import { INTEGRATIONS } from '../../constants';

interface AgentPortfolioViewProps {
  agents: any[];
  onAddAgent: () => void;
  onSelectAgent: (agentId: string) => void;
}

// Helper to map capabilities to icons (duplicate from main file, good to keep close to usage)
const getCapabilityIcon = (cap: string) => {
  const c = cap.toLowerCase();
  if (c.includes('graph')) return <Network className="w-3.5 h-3.5 mr-2 opacity-70" />;
  if (c.includes('sod')) return <GitMerge className="w-3.5 h-3.5 mr-2 opacity-70" />;
  if (c.includes('entitlement')) return <UserCheck className="w-3.5 h-3.5 mr-2 opacity-70" />;
  if (c.includes('log')) return <Database className="w-3.5 h-3.5 mr-2 opacity-70" />;
  if (c.includes('hash')) return <Hash className="w-3.5 h-3.5 mr-2 opacity-70" />;
  if (c.includes('time')) return <Clock className="w-3.5 h-3.5 mr-2 opacity-70" />;
  if (c.includes('benford')) return <BarChart3 className="w-3.5 h-3.5 mr-2 opacity-70" />;
  if (c.includes('z-score')) return <Activity className="w-3.5 h-3.5 mr-2 opacity-70" />;
  if (c.includes('pattern')) return <Scan className="w-3.5 h-3.5 mr-2 opacity-70" />;
  if (c.includes('nlp')) return <FileText className="w-3.5 h-3.5 mr-2 opacity-70" />;
  if (c.includes('process')) return <CheckCircle2 className="w-3.5 h-3.5 mr-2 opacity-70" />;
  if (c.includes('design')) return <PenTool className="w-3.5 h-3.5 mr-2 opacity-70" />;
  return <Zap className="w-3.5 h-3.5 mr-2 opacity-70" />;
};

const AgentPortfolioView: React.FC<AgentPortfolioViewProps> = ({ agents, onAddAgent, onSelectAgent }) => {
  return (
    <div className="flex-1 overflow-y-auto p-8 bg-slate-950">
      <header className="mb-8 flex items-center justify-between">
         <div>
           <h2 className="text-2xl font-bold text-white mb-2">Agent Portfolio</h2>
           <p className="text-slate-400">Available autonomous agents deployed for risk verification and assurance tasks.</p>
         </div>
         <button 
            onClick={onAddAgent}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-900/20"
         >
            <Plus className="w-4 h-4" />
            <span>Create New Agent</span>
         </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6 pb-12">
         {agents.map((agent) => (
            <div key={agent.id} className={`group relative bg-slate-900 border ${agent.border} rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1`}>
               {/* Header */}
               <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${agent.bg} ${agent.color}`}>
                     <agent.icon className="w-8 h-8" />
                  </div>
                  <div className="flex items-center space-x-2">
                     <span className="px-2 py-1 rounded text-[10px] font-mono bg-slate-800 text-slate-400 border border-slate-700">v2.4.0</span>
                     <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  </div>
               </div>
               
               <h3 className="text-xl font-bold text-white mb-2">{agent.name}</h3>
               <p className="text-slate-400 text-sm leading-relaxed mb-6 h-16 line-clamp-3">{agent.description}</p>
               
               {/* Tech Specs */}
               <div className="flex items-center space-x-4 mb-6 text-xs text-slate-500 font-mono">
                  <div className="flex items-center"><Cpu className="w-3 h-3 mr-1" /> {agent.model}</div>
                  {/* Config Display */}
                  {agent.config && (
                     <>
                        <div className="flex items-center" title="Temperature">
                           <Settings2 className="w-3 h-3 mr-1" /> 
                           Temp: {agent.config.temperature}
                        </div>
                        <div className="flex items-center" title="Max Tokens">
                           <FileText className="w-3 h-3 mr-1" /> 
                           Max: {agent.config.maxTokens}
                        </div>
                     </>
                  )}
               </div>

               {/* Connected Systems (Integrations) */}
               <div className="mb-6">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center">
                    <LinkIcon className="w-3 h-3 mr-2" />
                    Connected Systems
                  </div>
                  <div className="flex flex-wrap gap-2">
                     {agent.requiredIntegrations?.map((intId: string) => {
                       const integration = INTEGRATIONS.find(i => i.id === intId);
                       if (!integration) return null;
                       
                       // Status dot color
                       const statusColor = integration.status === 'connected' ? 'bg-emerald-500' : 
                                           integration.status === 'error' ? 'bg-red-500' : 'bg-yellow-500';

                       return (
                        <div key={intId} className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300">
                           <integration.icon className={`w-3.5 h-3.5 ${integration.color}`} />
                           <span>{integration.name}</span>
                           <div className={`w-1.5 h-1.5 rounded-full ml-1 ${statusColor}`} title={`Status: ${integration.status}`} />
                        </div>
                       )
                     })}
                     {(!agent.requiredIntegrations || agent.requiredIntegrations.length === 0) && (
                        <span className="text-xs text-slate-600 italic">No integrations configured</span>
                     )}
                  </div>
               </div>

               {/* Capabilities Tags */}
               <div className="mb-6">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center">
                    <Layers className="w-3 h-3 mr-2" />
                    Core Capabilities
                  </div>
                  <div className="flex flex-wrap gap-2">
                     {agent.capabilities.map((cap: string) => (
                        <span key={cap} className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center transition-all hover:bg-opacity-20 ${agent.bg} ${agent.border} ${agent.color}`}>
                           {getCapabilityIcon(cap)}
                           {cap}
                        </span>
                     ))}
                  </div>
               </div>

               {/* Action */}
               <div className="mt-8 pt-6 border-t border-slate-800/50 flex justify-end">
                  <button 
                    onClick={() => onSelectAgent(agent.id)}
                    className={`text-sm font-medium ${agent.color} flex items-center hover:underline`}
                  >
                     View Agent Logic & Blueprint <Code2 className="w-4 h-4 ml-2" />
                  </button>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
};

export default AgentPortfolioView;
