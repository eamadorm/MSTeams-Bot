
import React, { useState } from 'react';
import { X, GitBranch, Code, Globe, FileCode, Shield } from 'lucide-react';
import { CIAMApplication } from '../types';

interface AddAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (app: CIAMApplication) => void;
}

const AddAppModal: React.FC<AddAppModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [language, setLanguage] = useState('');
  const [repo, setRepo] = useState('');
  const [framework, setFramework] = useState('NIST 800-63B');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      id: `app-${Date.now()}`,
      name,
      language,
      repo,
      framework,
      status: 'Untested',
      lastScan: 'Just now'
    });
    onClose();
    setName('');
    setLanguage('');
    setRepo('');
    setFramework('NIST 800-63B');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-800/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-sky-500/10 rounded-lg border border-sky-500/20 text-sky-400">
              <GitBranch className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white">Onboard Application</h2>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Application Name</label>
            <div className="relative">
               <Globe className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
               <input 
                 type="text" 
                 required
                 value={name}
                 onChange={(e) => setName(e.target.value)}
                 className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500 transition-colors placeholder:text-slate-600"
                 placeholder="e.g. Corporate Treasury Portal"
               />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Tech Stack / Language</label>
            <div className="relative">
               <FileCode className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
               <input 
                 type="text" 
                 required
                 value={language}
                 onChange={(e) => setLanguage(e.target.value)}
                 className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500 transition-colors placeholder:text-slate-600"
                 placeholder="e.g. Java Spring Boot / Angular"
               />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Repository URL</label>
             <div className="relative">
               <Code className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
               <input 
                 type="text" 
                 required
                 value={repo}
                 onChange={(e) => setRepo(e.target.value)}
                 className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500 transition-colors placeholder:text-slate-600"
                 placeholder="e.g. github.com/fintech/treasury-core"
               />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Compliance Framework</label>
             <div className="relative">
               <Shield className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
               <select 
                 value={framework}
                 onChange={(e) => setFramework(e.target.value)}
                 className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500 transition-colors appearance-none"
               >
                 <option value="NIST 800-63B">NIST 800-63B (Identity Assurance)</option>
                 <option value="PCI-DSS 4.0">PCI-DSS 4.0 (Payments)</option>
                 <option value="SOC 2 Type II">SOC 2 Type II (Service Org)</option>
                 <option value="GDPR">GDPR (Privacy)</option>
               </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 rounded-lg text-sm bg-sky-600 hover:bg-sky-500 text-white font-medium shadow-lg shadow-sky-900/20"
            >
              Onboard App
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAppModal;
