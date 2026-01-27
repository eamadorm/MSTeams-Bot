
import React from 'react';
import { Link as LinkIcon, RefreshCw, Settings, Lock, Search, Cloud, FileText, Database, UserCheck, MessageSquare, Server } from 'lucide-react';
import { INTEGRATIONS } from '../../constants';

const IntegrationsView: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto p-8 bg-slate-950">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">System Integrations</h2>
          <p className="text-slate-400">Manage connections to enterprise data sources, security platforms, and control planes.</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors">
          <LinkIcon className="w-4 h-4" />
          <span>New Connection</span>
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {INTEGRATIONS.map((integration) => (
          <div key={integration.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all group relative overflow-hidden">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-lg bg-slate-950 border border-slate-800 ${integration.color}`}>
                <integration.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center space-x-1.5 px-2 py-1 rounded-full text-[10px] font-medium border ${
                integration.status === 'connected' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                integration.status === 'error' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
              }`}>
                 <div className={`w-1.5 h-1.5 rounded-full ${
                   integration.status === 'connected' ? 'bg-emerald-400' :
                   integration.status === 'error' ? 'bg-red-400' : 'bg-yellow-400'
                 }`}></div>
                 <span className="capitalize">{integration.status}</span>
              </div>
            </div>

            <h3 className="font-bold text-slate-200 mb-1">{integration.name}</h3>
            <p className="text-xs text-slate-500 mb-6">{integration.category}</p>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
               <div className="flex items-center text-xs text-slate-500">
                 <RefreshCw className="w-3 h-3 mr-1.5" />
                 <span>{integration.lastSync}</span>
               </div>
               <button className="text-slate-400 hover:text-white transition-colors">
                 <Settings className="w-4 h-4" />
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IntegrationsView;
