
import React, { useState } from 'react';
import { X, Bot, BrainCircuit, Cpu, Zap, PenTool, Sliders, FileText } from 'lucide-react';
import { AgentCapability, CapabilityDefinition } from '../types';

interface AddAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (agent: any) => void;
  availableCapabilities: CapabilityDefinition[];
}

const AddAgentModal: React.FC<AddAgentModalProps> = ({ isOpen, onClose, onAdd, availableCapabilities }) => {
  const [activeTab, setActiveTab] = useState<'basics' | 'config'>('basics');
  
  // Basics
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [baseModel, setBaseModel] = useState('Gemini 1.5 Pro');
  const [primaryCapability, setPrimaryCapability] = useState<string>(availableCapabilities[0]?.id || 'GENERIC_AUDIT');

  // Config
  const [temperature, setTemperature] = useState(0.2);
  const [maxTokens, setMaxTokens] = useState(8192);
  const [systemInstruction, setSystemInstruction] = useState('You are an autonomous Risk Assurance Agent. Your mission is to systematically verify controls.');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct new agent object
    const newAgent = {
      id: `AGENT_${Date.now()}`,
      name,
      description,
      icon: Bot, 
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      model: baseModel,
      capabilities: [primaryCapability],
      requiredIntegrations: [], // Simplification for MVP
      useCases: ['Custom defined use case'],
      config: {
        temperature,
        maxTokens,
        systemInstruction
      }
    };

    onAdd(newAgent);
    
    // Reset form
    setName('');
    setDescription('');
    setBaseModel('Gemini 1.5 Pro');
    setTemperature(0.2);
    setMaxTokens(8192);
    setSystemInstruction('You are an autonomous Risk Assurance Agent. Your mission is to systematically verify controls.');
    setActiveTab('basics');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-800/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20 text-purple-400">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white">Provision New Agent</h2>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex border-b border-slate-800 bg-slate-950/50">
            <button 
              onClick={() => setActiveTab('basics')}
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors flex items-center justify-center space-x-2 ${activeTab === 'basics' ? 'border-purple-500 text-purple-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
            >
              <Bot className="w-4 h-4" />
              <span>Identity & Role</span>
            </button>
            <button 
              onClick={() => setActiveTab('config')}
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors flex items-center justify-center space-x-2 ${activeTab === 'config' ? 'border-purple-500 text-purple-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
            >
              <Sliders className="w-4 h-4" />
              <span>Model Configuration</span>
            </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          {activeTab === 'basics' ? (
             <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Agent Name</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-purple-500 transition-colors placeholder:text-slate-600"
                  placeholder="e.g. Compliance Sentinel V2"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Persona Description</label>
                <textarea 
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-purple-500 transition-colors placeholder:text-slate-600"
                  placeholder="Define the role and tone of the agent..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Base Model</label>
                  <select 
                    value={baseModel}
                    onChange={(e) => setBaseModel(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-purple-500 transition-colors"
                  >
                    <option value="Gemini 1.5 Pro">Gemini 1.5 Pro</option>
                    <option value="Gemini 1.5 Flash">Gemini 1.5 Flash</option>
                    <option value="Gemini Ultra 1.0">Gemini Ultra 1.0</option>
                  </select>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Core Capability</label>
                  </div>
                  
                  <select 
                    value={primaryCapability}
                    onChange={(e) => setPrimaryCapability(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-purple-500 transition-colors"
                  >
                    {availableCapabilities.map(cap => (
                      <option key={cap.id} value={cap.id}>{cap.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ) : (
             <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                   <div>
                      <div className="flex justify-between mb-2">
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Temperature</label>
                        <span className="text-xs font-mono text-purple-400">{temperature}</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" max="1" step="0.1"
                        value={temperature}
                        onChange={(e) => setTemperature(parseFloat(e.target.value))}
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
                      />
                      <p className="text-[10px] text-slate-500 mt-2">Lower values are more deterministic and focused. Higher values are more creative.</p>
                   </div>
                   <div>
                      <div className="flex justify-between mb-2">
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Max Output Tokens</label>
                        <span className="text-xs font-mono text-purple-400">{maxTokens}</span>
                      </div>
                      <input 
                        type="number" 
                        min="1024" max="32768" step="1024"
                        value={maxTokens}
                        onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                      />
                      <p className="text-[10px] text-slate-500 mt-2">Maximum length of the agent's response stream per turn.</p>
                   </div>
                </div>

                <div>
                   <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center">
                     <FileText className="w-3 h-3 mr-1" /> System Instruction (Fine-tuning)
                   </label>
                   <textarea 
                      value={systemInstruction}
                      onChange={(e) => setSystemInstruction(e.target.value)}
                      rows={6}
                      className="w-full bg-[#1e1e1e] border border-slate-800 rounded-lg px-4 py-3 text-slate-300 font-mono text-xs focus:outline-none focus:border-purple-500 transition-colors leading-relaxed"
                      placeholder="Enter system prompt instructions..."
                   />
                   <p className="text-[10px] text-slate-500 mt-2">
                     These instructions define the agent's core behavior, constraints, and output format. They are injected into the context window at the start of every session.
                   </p>
                </div>
             </div>
          )}
          
          <div className="p-6 pt-0 flex justify-end space-x-3 border-t border-slate-800 mt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors mt-4"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 rounded-lg text-sm bg-purple-600 hover:bg-purple-500 text-white font-medium shadow-lg shadow-purple-900/20 mt-4"
            >
              Deploy Agent
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAgentModal;
