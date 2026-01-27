
import React from 'react';
import { SequenceStep } from '../types';
import { Server, Smartphone, Globe, Database, ShieldCheck, ArrowDown } from 'lucide-react';

interface SequenceDiagramProps {
  steps: SequenceStep[];
}

const SequenceDiagram: React.FC<SequenceDiagramProps> = ({ steps }) => {
  // Define systems (columns)
  const systems = [
    { id: 'user', label: 'User / App', icon: Smartphone },
    { id: 'gateway', label: 'API Gateway', icon: Globe },
    { id: 'auth', label: 'CIAM / Auth', icon: ShieldCheck },
    { id: 'backend', label: 'Core / DB', icon: Server },
  ];

  const getSystemX = (systemId: string) => {
    const idx = systems.findIndex(s => s.id === systemId);
    // Dynamic spacing based on count to fit better, but fixed for predictability
    return 80 + (idx * 200); 
  };

  const getSystemFromLabel = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes('user') || l.includes('app') || l.includes('mobile')) return 'user';
    if (l.includes('gateway') || l.includes('api')) return 'gateway';
    if (l.includes('auth') || l.includes('ciam') || l.includes('token')) return 'auth';
    return 'backend';
  };

  return (
    <div className="w-full h-full overflow-auto bg-slate-900/50 rounded-lg border border-slate-800 p-6 relative">
      <div className="min-w-[750px] min-h-[550px] relative mx-auto">
        
        {/* Render Columns/Lifelines */}
        {systems.map(sys => {
          const x = getSystemX(sys.id);
          return (
            <div key={sys.id} className="absolute top-0 bottom-0 flex flex-col items-center" style={{ left: x - 40, width: 80 }}>
               {/* Header Icon */}
               <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 flex flex-col items-center z-10 mb-4 shadow-xl ring-1 ring-slate-700/50">
                 <sys.icon className="w-6 h-6 text-sky-400 mb-1.5" />
                 <span className="text-[10px] font-bold text-slate-300 uppercase whitespace-nowrap tracking-wide">{sys.label}</span>
               </div>
               {/* Vertical Lifeline */}
               <div className="flex-1 w-0.5 bg-gradient-to-b from-slate-700 via-slate-800 to-transparent border-l border-dashed border-slate-600/50"></div>
            </div>
          )
        })}

        {/* Render Steps */}
        <div className="absolute top-28 left-0 right-0">
          {steps.map((step, index) => {
             const fromSys = getSystemFromLabel(step.from);
             const toSys = getSystemFromLabel(step.to);
             const x1 = getSystemX(fromSys);
             const x2 = getSystemX(toSys);
             const y = index * 70; // Increased spacing for clarity
             const isRight = x2 > x1;
             
             // Define styles based on status
             let statusColor = 'text-blue-400 border-blue-500/30 bg-blue-500/10';
             let lineColor = 'bg-blue-500';
             let arrowColor = 'border-blue-500';

             if (step.status === 'success') {
                statusColor = 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
                lineColor = 'bg-emerald-500';
                arrowColor = 'border-emerald-500';
             } else if (step.status === 'error') {
                statusColor = 'text-red-400 border-red-500/30 bg-red-500/10';
                lineColor = 'bg-red-500';
                arrowColor = 'border-red-500';
             } else if (step.status === 'warning') {
                statusColor = 'text-amber-400 border-amber-500/30 bg-amber-500/10';
                lineColor = 'bg-amber-500';
                arrowColor = 'border-amber-500';
             }

             return (
               <div key={step.id} className="absolute w-full animate-in fade-in slide-in-from-top-2 duration-500" style={{ top: y, height: 40, animationDelay: `${index * 100}ms` }}>
                  <div className="relative h-full">
                     {/* Horizontal Line */}
                     <div 
                        className={`absolute top-1/2 h-0.5 ${lineColor} opacity-40`} 
                        style={{ 
                          left: Math.min(x1, x2), 
                          width: Math.abs(x2 - x1),
                        }} 
                     />
                     
                     {/* Arrow Head */}
                     <div 
                        className={`absolute top-1/2 -mt-1.5 w-3 h-3 border-t-2 border-r-2 ${arrowColor}`}
                        style={{ 
                          left: isRight ? x2 - 8 : x2 - 4, 
                          transform: isRight ? 'rotate(45deg)' : 'rotate(225deg)'
                        }}
                     />

                     {/* Label Bubble */}
                     <div 
                       className={`absolute top-1/2 -mt-8 transform -translate-x-1/2 text-xs font-mono px-3 py-1 rounded-full border ${statusColor} shadow-lg z-20 backdrop-blur-sm`}
                       style={{ left: (x1 + x2) / 2 }}
                     >
                       <div className="flex items-center space-x-2 whitespace-nowrap">
                         <span className="font-semibold tracking-tight">{step.label}</span>
                         {step.status === 'error' && <span className="text-[9px] font-bold bg-red-500/20 px-1.5 rounded text-red-300">FAIL</span>}
                         {step.status === 'warning' && <span className="text-[9px] font-bold bg-amber-500/20 px-1.5 rounded text-amber-300">WARN</span>}
                       </div>
                     </div>
                  </div>
               </div>
             );
          })}
        </div>

      </div>
    </div>
  );
};

export default SequenceDiagram;
