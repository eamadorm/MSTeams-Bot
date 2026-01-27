
import React from 'react';
import { Risk, Control, ActiveSession, AuditResult, AgentStatus } from '../../types';
import { Plus, Shield, Lock, Eye, CheckCircle2, AlertOctagon, Loader2, Zap, Network, Square } from 'lucide-react';
import { SEVERITY_COLORS, INTEGRATIONS } from '../../constants';
import Terminal from '../Terminal';
import ActivityVisualizer from '../ActivityVisualizer';

interface CommandCenterViewProps {
  risks: Risk[];
  selectedRiskId: string | null;
  setSelectedRiskId: (id: string | null) => void;
  activeSessions: Record<string, ActiveSession>;
  completedAudits: Record<string, AuditResult>;
  onDeployAgent: (risk: Risk, control: Control) => void;
  onStopAgent: (controlId: string) => void;
  onOpenReport: (controlId: string) => void;
  onAddRisk: () => void;
  coverage: number;
  effectiveRate: number;
  agents: any[];
}

// Helper Icon for Top Bar
const TrendingUpIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const CommandCenterView: React.FC<CommandCenterViewProps> = ({
  risks,
  selectedRiskId,
  setSelectedRiskId,
  activeSessions,
  completedAudits,
  onDeployAgent,
  onStopAgent,
  onOpenReport,
  onAddRisk,
  coverage,
  effectiveRate,
  agents
}) => {
  const selectedRisk = risks.find(r => r.id === selectedRiskId);

  return (
    <>
      {/* Top Metrics Bar */}
      <header className="h-16 bg-slate-900/50 backdrop-blur-sm border-b border-slate-800 flex items-center px-6 justify-between shrink-0 z-10">
        <div className="flex space-x-8">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Control Coverage</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-xl font-bold text-white">{coverage}%</span>
              <span className="text-xs text-emerald-400 flex items-center"><TrendingUpIcon className="w-3 h-3 mr-1"/> +12%</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Effectiveness Rate</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-xl font-bold text-white">{effectiveRate}%</span>
              <span className="text-xs text-slate-400">of tested</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Active Agents</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-xl font-bold text-blue-400">{Object.keys(activeSessions).filter(k => activeSessions[k].status === AgentStatus.EXECUTING).length}</span>
              <span className="text-xs text-blue-500/50 animate-pulse">● Live</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden flex">
        
        {/* Left Panel: Risk List */}
        <div className="w-80 bg-slate-900/50 border-r border-slate-800 overflow-y-auto flex flex-col">
           <div className="p-4 flex items-center justify-between border-b border-slate-800">
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Identified Risks</h2>
              <button 
                onClick={onAddRisk}
                className="p-1 rounded bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
           </div>
           <div className="p-4 flex-1">
             <div className="space-y-2">
               {risks.map(risk => (
                 <button
                   key={risk.id}
                   onClick={() => setSelectedRiskId(risk.id)}
                   className={`w-full text-left p-3 rounded-lg border transition-all ${
                     selectedRiskId === risk.id 
                       ? 'bg-blue-600/10 border-blue-500/50 shadow-[0_0_15px_rgba(37,99,235,0.1)]' 
                       : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800 hover:border-slate-600'
                   }`}
                 >
                   <div className="flex items-center justify-between mb-1">
                     <span className={`text-[10px] px-1.5 py-0.5 rounded border ${SEVERITY_COLORS[risk.severity]}`}>
                       {risk.severity}
                     </span>
                     <span className="text-[10px] text-slate-500 font-mono">ID: {risk.id}</span>
                   </div>
                   <h3 className={`text-sm font-medium leading-tight ${selectedRiskId === risk.id ? 'text-white' : 'text-slate-300'}`}>
                     {risk.title}
                   </h3>
                   <div className="mt-2 flex items-center justify-between">
                      <div className="text-xs text-slate-500">{risk.category}</div>
                      {/* Mini Progress Bar for Controls */}
                      <div className="flex space-x-0.5">
                         {risk.controls.map((c, i) => {
                           const isDone = !!completedAudits[c.id];
                           const isEffective = completedAudits[c.id]?.effective;
                           return (
                             <div key={i} className={`w-2 h-2 rounded-full ${
                                !isDone ? 'bg-slate-700' : isEffective ? 'bg-emerald-500' : 'bg-red-500'
                             }`} />
                           )
                         })}
                      </div>
                   </div>
                 </button>
               ))}
             </div>
           </div>
        </div>

        {/* Right Panel: Risk Details & Agent Console */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950/50">
           {selectedRisk ? (
             <div className="max-w-5xl mx-auto space-y-6">
                
                {/* Risk Header */}
                <div className="flex items-start justify-between">
                   <div>
                      <h2 className="text-2xl font-bold text-white mb-2">{selectedRisk.title}</h2>
                      <p className="text-slate-400 max-w-2xl">{selectedRisk.description}</p>
                   </div>
                   <div className="text-right">
                      <div className="text-3xl font-mono font-bold text-slate-200">{selectedRisk.scoring}</div>
                      <div className="text-xs text-slate-500 uppercase tracking-wider">Risk Score</div>
                   </div>
                </div>

                {/* Controls & Agents Grid */}
                <div className="grid gap-6">
                   {selectedRisk.controls.map(control => {
                     const session = activeSessions[control.id];
                     const result = completedAudits[control.id];
                     const isRunning = session && session.status !== AgentStatus.COMPLETED && session.status !== AgentStatus.FAILED && session.status !== AgentStatus.CANCELLED;
                     const controlAgent = agents.find(a => a.id === control.agentCapability);
                     
                     return (
                       <div key={control.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
                          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/30">
                             <div className="flex items-center space-x-3">
                                <div className="p-2 bg-slate-800 rounded-lg border border-slate-700 text-slate-400">
                                   {control.type === 'Preventative' ? <Lock size={16} /> : <Eye size={16} />}
                                </div>
                                <div>
                                   <h3 className="font-semibold text-slate-200">{control.name}</h3>
                                   <div className="flex items-center space-x-2 text-xs text-slate-500">
                                      <span>{control.type} Control</span>
                                      <span>•</span>
                                      <div className="flex items-center space-x-1">
                                         <span className="font-mono text-blue-400">{controlAgent?.name || control.agentCapability}</span>
                                      </div>
                                   </div>
                                   
                                   {/* Integration Pipeline Visualization */}
                                   {controlAgent && (
                                      <div className="mt-2 flex items-center space-x-2">
                                         <span className="text-[10px] text-slate-600 font-semibold uppercase tracking-wider">Data Pipeline:</span>
                                         <div className="flex items-center space-x-2 bg-slate-950/50 px-2 py-1.5 rounded border border-slate-800/50">
                                            {controlAgent.requiredIntegrations?.map((intId: string) => {
                                               const integration = INTEGRATIONS.find(i => i.id === intId);
                                               if (!integration) return null;
                                               
                                               const statusColor = 
                                                  integration.status === 'connected' ? 'bg-emerald-400' : 
                                                  integration.status === 'error' ? 'bg-red-500' : 'bg-yellow-500';

                                               return (
                                                  <div key={intId} className="group relative cursor-help">
                                                     <div className="relative">
                                                        <integration.icon className={`w-3.5 h-3.5 ${integration.color} ${integration.status !== 'connected' ? 'opacity-50 grayscale' : 'opacity-90'} group-hover:opacity-100 group-hover:grayscale-0 transition-all`} />
                                                        <div className={`absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full border border-slate-900 ${statusColor}`}></div>
                                                     </div>
                                                     
                                                     {/* Detailed Tooltip */}
                                                     <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1.5 bg-slate-900 border border-slate-700 text-[10px] text-slate-200 rounded shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                                                        <div className="flex items-center space-x-2">
                                                            <div className={`w-1.5 h-1.5 rounded-full ${statusColor}`}></div>
                                                            <span className="font-semibold">{integration.name}</span>
                                                            <span className={`text-[9px] uppercase tracking-wider ${integration.status === 'error' ? 'text-red-400' : 'text-slate-500'}`}>{integration.status}</span>
                                                        </div>
                                                     </div>
                                                  </div>
                                               );
                                            })}
                                         </div>
                                      </div>
                                   )}
                                </div>
                             </div>
                             
                             {/* Action Area */}
                             <div className="flex items-center space-x-3">
                                {result ? (
                                   <div className="flex items-center space-x-4">
                                      <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border ${result.effective ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                                         {result.effective ? <CheckCircle2 size={14} /> : <AlertOctagon size={14} />}
                                         <span className="text-sm font-medium">{result.effective ? 'Effective' : 'Deficiency'}</span>
                                      </div>
                                      <button 
                                         onClick={() => onOpenReport(control.id)}
                                         className="text-sm text-blue-400 hover:text-blue-300 underline"
                                      >
                                         View Report
                                      </button>
                                   </div>
                                ) : (
                                   <div className="flex items-center space-x-2">
                                      {isRunning ? (
                                        <button 
                                          onClick={() => onStopAgent(control.id)}
                                          className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-bold transition-all bg-red-900/50 hover:bg-red-900 text-red-300 border border-red-800"
                                        >
                                           <Square size={14} fill="currentColor" /> <span>Stop Agent</span>
                                        </button>
                                      ) : null}

                                      <button 
                                        onClick={() => onDeployAgent(selectedRisk, control)}
                                        disabled={isRunning}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                                           isRunning 
                                           ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                                           : 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]'
                                        }`}
                                      >
                                        {isRunning ? (
                                           <><Loader2 className="animate-spin" size={16} /> <span>Running...</span></>
                                        ) : (
                                           <><Zap size={16} /> <span>Deploy Agent</span></>
                                        )}
                                      </button>
                                   </div>
                                )}
                             </div>
                          </div>

                          {/* Live Console Area */}
                          {(session || result) && (
                             <div className="grid grid-cols-1 lg:grid-cols-2 h-96 border-t border-slate-800">
                                {/* Left: Visualization */}
                                <div className="p-4 border-r border-slate-800 bg-slate-900/50 flex flex-col">
                                   <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center">
                                      <Network size={12} className="mr-2" /> Live Infrastructure Map
                                   </div>
                                   <div className="flex-1 relative rounded-lg border border-slate-800 bg-slate-950 overflow-hidden">
                                      <ActivityVisualizer 
                                         status={session?.status || AgentStatus.IDLE} 
                                         logsCount={session?.logs.length || 0}
                                         capability={control.agentCapability}
                                      />
                                      <div className="absolute bottom-0 left-0 right-0 p-3 bg-slate-900/90 border-t border-slate-800">
                                         <div className="flex justify-between text-xs font-mono text-slate-400">
                                            <span>Framework: {control.frameworkMappings[0]}</span>
                                            <span>Nodes: 6 Active</span>
                                         </div>
                                      </div>
                                   </div>
                                </div>

                                {/* Right: Terminal */}
                                <div className="flex flex-col h-full">
                                   <Terminal 
                                      logs={session?.logs || []} 
                                      status={session?.status || AgentStatus.IDLE}
                                      controlName={control.name}
                                   />
                                </div>
                             </div>
                          )}
                       </div>
                     );
                   })}
                </div>

             </div>
           ) : (
             <div className="flex flex-col items-center justify-center h-full text-slate-600">
                <Shield size={64} className="mb-4 opacity-20" />
                <p>Select a Risk to begin Autonomous Assurance</p>
             </div>
           )}
        </div>
      </div>
    </>
  );
};

export default CommandCenterView;
