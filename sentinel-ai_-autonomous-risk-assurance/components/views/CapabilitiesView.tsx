
import React, { useState } from 'react';
import { CapabilityDefinition } from '../../types';
import { Plus, Shield, FileSearch, Zap, Code, Network, Database, Lock, Activity, Cpu, Globe, Trash2 } from 'lucide-react';

interface CapabilitiesViewProps {
  capabilities: CapabilityDefinition[];
  onAddCapability: (cap: CapabilityDefinition) => void;
  onDeleteCapability?: (id: string) => void;
}

const ICONS = {
  Shield, FileSearch, Zap, Code, Network, Database, Lock, Activity, Cpu, Globe
};

const CapabilitiesView: React.FC<CapabilitiesViewProps> = ({ capabilities, onAddCapability, onDeleteCapability }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newIcon, setNewIcon] = useState<keyof typeof ICONS>('Cpu');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newDesc) return;

    const id = newName.toUpperCase().replace(/[^A-Z0-9]/g, '_');
    onAddCapability({
      id,
      name: newName,
      description: newDesc,
      iconName: newIcon
    });
    
    // Reset
    setNewName('');
    setNewDesc('');
    setNewIcon('Cpu');
    setIsCreating(false);
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-slate-950">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Core Capabilities Engine</h2>
          <p className="text-slate-400">Define the fundamental skill sets available to your autonomous agent fleet.</p>
        </div>
        <button 
           onClick={() => setIsCreating(true)}
           className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-900/20"
        >
          <Plus className="w-4 h-4" />
          <span>New Capability</span>
        </button>
      </header>

      {/* Creation Drawer / Card */}
      {isCreating && (
        <div className="mb-8 animate-in slide-in-from-top-4 fade-in duration-300">
           <div className="bg-slate-900 border border-blue-500/30 rounded-xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                 <Cpu className="w-5 h-5 mr-2 text-blue-400" /> Define New Capability
              </h3>
              
              <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-4">
                    <div>
                       <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Capability Name</label>
                       <input 
                         autoFocus
                         type="text" 
                         value={newName}
                         onChange={(e) => setNewName(e.target.value)}
                         placeholder="e.g. Network Penetration"
                         className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                       />
                    </div>
                    <div>
                       <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Technical Description</label>
                       <textarea 
                         value={newDesc}
                         onChange={(e) => setNewDesc(e.target.value)}
                         placeholder="Describe the specialized logic this capability provides..."
                         rows={3}
                         className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                       />
                    </div>
                 </div>

                 <div className="space-y-4">
                    <div>
                       <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Iconography</label>
                       <div className="grid grid-cols-5 gap-2 bg-slate-950 p-4 rounded-lg border border-slate-800">
                          {Object.keys(ICONS).map((iconKey) => {
                             const Icon = ICONS[iconKey as keyof typeof ICONS];
                             return (
                                <button
                                   key={iconKey}
                                   type="button"
                                   onClick={() => setNewIcon(iconKey as keyof typeof ICONS)}
                                   className={`p-2 rounded flex items-center justify-center transition-all ${newIcon === iconKey ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'}`}
                                >
                                   <Icon className="w-5 h-5" />
                                </button>
                             )
                          })}
                       </div>
                    </div>
                    
                    <div className="flex items-end justify-end h-full pb-1 space-x-3">
                       <button 
                         type="button" 
                         onClick={() => setIsCreating(false)}
                         className="px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white transition-colors"
                       >
                         Cancel
                       </button>
                       <button 
                         type="submit" 
                         className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-900/20 transition-transform hover:scale-105"
                       >
                         Create Definition
                       </button>
                    </div>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {capabilities.map((cap) => {
          const Icon = ICONS[cap.iconName] || ICONS.Cpu;
          return (
            <div key={cap.id} className="group bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-xl p-6 transition-all duration-300 hover:shadow-2xl relative overflow-hidden">
               <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 group-hover:border-slate-600 transition-colors">
                     <Icon className="w-6 h-6 text-slate-400 group-hover:text-blue-400 transition-colors" />
                  </div>
                  <div className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-500">
                     {cap.id}
                  </div>
               </div>
               
               <h3 className="text-lg font-bold text-slate-200 mb-2 group-hover:text-white transition-colors">{cap.name}</h3>
               <p className="text-sm text-slate-500 leading-relaxed mb-4 min-h-[40px]">{cap.description}</p>
               
               <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                  <span className="text-xs font-medium text-slate-600 uppercase tracking-wide">v1.0 Standard</span>
                  {onDeleteCapability && (
                    <button onClick={() => onDeleteCapability(cap.id)} className="text-slate-600 hover:text-red-400 transition-colors">
                       <Trash2 className="w-4 h-4" />
                    </button>
                  )}
               </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CapabilitiesView;
