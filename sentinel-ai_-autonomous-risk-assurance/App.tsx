import React, { useState, useEffect, useRef } from 'react';
import RiskDashboard from './components/RiskDashboard';
import WelcomeModal from './components/WelcomeModal';
import { generateInitialRisks, streamAuditSimulation } from './services/geminiService';
import { Risk, Control, ActiveSession, AuditResult, AgentStatus, SimulationStep } from './types';

export default function App() {
  const [risks, setRisks] = useState<Risk[]>([]);
  const [activeSessions, setActiveSessions] = useState<Record<string, ActiveSession>>({});
  const [completedAudits, setCompletedAudits] = useState<Record<string, AuditResult>>({});
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);
  
  // Ref to track which sessions have been requested to stop
  const stopSignalRef = useRef<Set<string>>(new Set());

  // Initialize Data
  useEffect(() => {
    const init = async () => {
      // In a real app, user selects domain. Hardcoding "Fintech" for demo.
      const initialRisks = await generateInitialRisks("Financial Technology Infrastructure");
      setRisks(initialRisks);
      setLoading(false);
    };
    init();
  }, []);

  const handleAddRisk = (newRisk: Risk) => {
    setRisks(prev => [...prev, newRisk]);
  };

  const handleStopAgent = (sessionId: string) => {
    stopSignalRef.current.add(sessionId);
    setActiveSessions(prev => ({
      ...prev,
      [sessionId]: { ...prev[sessionId], status: AgentStatus.CANCELLED }
    }));
  };

  const handleDeployAgent = async (risk: Risk, control: Control) => {
    // 1. Initialize Session
    const sessionId = control.id;
    
    // Clear any previous stop signal for this session
    if (stopSignalRef.current.has(sessionId)) {
        stopSignalRef.current.delete(sessionId);
    }

    setActiveSessions(prev => ({
      ...prev,
      [sessionId]: {
        riskId: risk.id,
        controlId: control.id,
        status: AgentStatus.PLANNING,
        logs: [],
        startTime: Date.now()
      }
    }));

    // 2. Start Streaming
    try {
      // Pass the agentCapability to the stream simulation
      const stream = streamAuditSimulation(risk, control.name, control.agentCapability);
      
      for await (const chunk of stream) {
        // Check for stop signal
        if (stopSignalRef.current.has(sessionId)) {
            break; // Stop processing stream
        }

        const lines = chunk.split('\n');
        
        for (const line of lines) {
           const trimmed = line.trim();
           if (!trimmed) continue;

           try {
             // Attempt to parse line as JSON
             if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
               const data = JSON.parse(trimmed);
               
               if (data.type === 'log') {
                 addLog(sessionId, {
                   timestamp: new Date().toLocaleTimeString(),
                   action: data.action,
                   detail: data.detail,
                   status: data.status
                 });
               } else if (data.type === 'result') {
                 completeAudit(sessionId, data.data);
               }
             } else {
               // If not JSON, treat as raw log (fallback)
               if (trimmed.length > 5 && !trimmed.includes('```')) {
                  addLog(sessionId, {
                    timestamp: new Date().toLocaleTimeString(),
                    action: "Processing",
                    detail: trimmed,
                    status: 'info'
                  });
               }
             }
           } catch (e) {
             // Ignore partial chunks
           }
        }
      }
    } catch (error) {
      console.error("Agent failed", error);
      addLog(sessionId, {
        timestamp: new Date().toLocaleTimeString(),
        action: "SYSTEM_ERROR",
        detail: "Agent connection terminated unexpectedly.",
        status: 'error'
      });
      setActiveSessions(prev => ({
        ...prev,
        [sessionId]: { ...prev[sessionId], status: AgentStatus.FAILED }
      }));
    }
  };

  const addLog = (sessionId: string, log: SimulationStep) => {
    setActiveSessions(prev => {
      const session = prev[sessionId];
      if (!session) return prev;
      
      // Do not add logs if cancelled
      if (stopSignalRef.current.has(sessionId)) return prev;

      return {
        ...prev,
        [sessionId]: {
          ...session,
          status: AgentStatus.EXECUTING,
          logs: [...session.logs, log]
        }
      };
    });
  };

  const completeAudit = (sessionId: string, result: AuditResult) => {
    setActiveSessions(prev => {
      const session = prev[sessionId];
      if (!session) return prev;

      // Capture logs for audit trail
      const finalLogs = session.logs;
      const durationMs = session.startTime ? Date.now() - session.startTime : 0;
      
      const enrichedResult = {
          ...result,
          durationMs,
          executionLogs: finalLogs // Persist logs
      };

      setCompletedAudits(prevAudits => ({
        ...prevAudits,
        [sessionId]: enrichedResult
      }));

      return {
        ...prev,
        [sessionId]: {
          ...session,
          status: AgentStatus.COMPLETED
        }
      }
    });
  };

  const handleReset = () => {
    setActiveSessions({});
    setCompletedAudits({});
    stopSignalRef.current.clear();
    setShowWelcome(true);
  };

  if (loading) {
    return (
      <div className="h-screen w-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 space-y-4">
        <div className="relative">
           <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
           <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-8 h-8 bg-blue-500/20 rounded-full animate-pulse"></div>
           </div>
        </div>
        <div className="font-mono text-sm tracking-widest uppercase animate-pulse">Initializing Sentinel AI...</div>
      </div>
    );
  }

  return (
    <>
      {showWelcome && <WelcomeModal onStart={() => setShowWelcome(false)} />}
      <RiskDashboard 
        risks={risks}
        activeSessions={activeSessions}
        onDeployAgent={handleDeployAgent}
        onStopAgent={handleStopAgent}
        completedAudits={completedAudits}
        onReset={handleReset}
        onAddRisk={handleAddRisk}
      />
    </>
  );
}
