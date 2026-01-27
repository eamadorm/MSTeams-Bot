import React, { useEffect, useRef } from 'react';
import { SimulationStep, AgentStatus } from '../types';
import { Terminal as TerminalIcon, ShieldCheck, AlertTriangle, CheckCircle, Activity } from 'lucide-react';

interface TerminalProps {
  logs: SimulationStep[];
  status: AgentStatus;
  controlName: string;
}

const Terminal: React.FC<TerminalProps> = ({ logs, status, controlName }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of the container only
  useEffect(() => {
    if (scrollContainerRef.current) {
      const { scrollHeight, clientHeight } = scrollContainerRef.current;
      // Using scrollTo with behavior smooth for independent container scrolling
      scrollContainerRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: 'smooth'
      });
    }
  }, [logs]);

  return (
    <div className="flex flex-col h-full bg-slate-900 font-mono text-sm relative">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700 shrink-0 z-20">
        <div className="flex items-center space-x-2">
          <TerminalIcon className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-300 font-medium">AGENT_SESSION_ID: {btoa(controlName).substring(0, 8)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`flex h-2 w-2 rounded-full ${status === AgentStatus.EXECUTING ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}></span>
          <span className="text-xs text-slate-400 uppercase">{status}</span>
        </div>
      </div>

      {/* Terminal Content Area */}
      <div className="flex-1 relative overflow-hidden">
        
        {/* Static Background Effects */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 bg-[length:100%_4px,3px_100%] opacity-20"></div>

        {/* Scrollable Logs Container */}
        <div 
          ref={scrollContainerRef}
          className="absolute inset-0 overflow-y-auto p-4 scrollbar-hide space-y-3 z-10"
        >
          {logs.length === 0 && (
            <div className="text-slate-500 italic">Waiting for agent deployment...</div>
          )}
          
          {logs.map((log, index) => (
            <div key={index} className="flex space-x-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="shrink-0 mt-0.5">
                {log.status === 'success' && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                {log.status === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                {log.status === 'error' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                {log.status === 'info' && <Activity className="w-4 h-4 text-blue-500" />}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-500">[{log.timestamp}]</span>
                  <span className={`font-semibold ${
                     log.status === 'error' ? 'text-red-400' : 'text-emerald-400 terminal-text'
                  }`}>
                    {log.action}
                  </span>
                </div>
                <p className="text-slate-400 text-xs mt-1 pl-1 border-l-2 border-slate-700 leading-relaxed">{log.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Terminal;