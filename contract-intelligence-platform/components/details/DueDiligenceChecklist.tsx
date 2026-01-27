
import React, { useState, useEffect } from 'react';
import { Contract } from '../../types.ts';
import { Card } from '../ui/Card.tsx';

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

interface DueDiligenceChecklistProps {
  contract: Contract;
}

export const DueDiligenceChecklist: React.FC<DueDiligenceChecklistProps> = ({ contract }) => {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [newItemText, setNewItemText] = useState('');

  // Initial suggested items based on contract type
  useEffect(() => {
    const getInitialItems = (): ChecklistItem[] => {
      const baseItems = [
        { id: '1', text: 'Verify all signatures are present and valid', completed: false },
        { id: '2', text: 'Check for inconsistent date definitions', completed: false },
      ];

      const typeSpecific: Record<string, string[]> = {
        'MSA': ['Review IP ownership clauses', 'Confirm liability cap alignment', 'Check non-solicitation scope'],
        'NDA': ['Verify survival period length', 'Check definition of confidential info', 'Ensure exclusion clauses are standard'],
        'BAA': ['Verify 48h breach notification', 'Confirm subcontractor compliance terms', 'Check audit rights'],
        'ISDA': ['Review LIBOR fallback language', 'Verify netting provisions', 'Check default triggers'],
        'Supply Agreement': ['Confirm lead time requirements', 'Review quality SLA thresholds', 'Verify force majeure scope'],
      };

      const suggested = typeSpecific[contract.contractType] || ['Review termination triggers', 'Confirm governing law jurisdiction'];
      
      return [
        ...baseItems,
        ...suggested.map((text, idx) => ({ id: `s-${idx}`, text, completed: false }))
      ];
    };

    setItems(getInitialItems());
  }, [contract.id, contract.contractType]);

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    
    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      text: newItemText,
      completed: false,
    };
    
    setItems(prev => [...prev, newItem]);
    setNewItemText('');
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const completedCount = items.filter(i => i.completed).length;
  const progressPercent = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  return (
    <Card className="flex flex-col h-full border border-brand-accent/20">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-brand-text">Due Diligence Checklist</h3>
          <p className="text-xs text-brand-light">Track critical review items for this agreement</p>
        </div>
        <div className="text-right">
          <span className="text-sm font-bold text-brand-highlight">{progressPercent}%</span>
          <div className="w-24 h-1.5 bg-brand-primary rounded-full mt-1 overflow-hidden">
            <div 
              className="h-full bg-brand-highlight transition-all duration-500" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex-grow space-y-2 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {items.map(item => (
          <div 
            key={item.id} 
            className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 group ${
              item.completed 
                ? 'bg-brand-primary/30 border-brand-accent/10 opacity-60' 
                : 'bg-brand-accent/10 border-brand-accent/20 hover:border-brand-highlight/30'
            }`}
          >
            <button 
              onClick={() => toggleItem(item.id)}
              className={`flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                item.completed 
                  ? 'bg-brand-highlight border-brand-highlight text-brand-primary' 
                  : 'border-brand-light group-hover:border-brand-highlight'
              }`}
            >
              {item.completed && (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
            <span className={`text-sm flex-grow transition-all ${item.completed ? 'line-through text-brand-light' : 'text-brand-text'}`}>
              {item.text}
            </span>
            <button 
              onClick={() => deleteItem(item.id)}
              className="text-brand-light hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Remove item"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed border-brand-accent/20 rounded-lg">
            <p className="text-sm text-brand-light">No checklist items. Add one below!</p>
          </div>
        )}
      </div>

      <form onSubmit={addItem} className="mt-auto pt-4 border-t border-brand-accent/20">
        <div className="flex gap-2">
          <input
            type="text"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            placeholder="Add new review item..."
            className="flex-grow bg-brand-primary border border-brand-accent/30 rounded-md px-3 py-2 text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-highlight"
          />
          <button 
            type="submit"
            disabled={!newItemText.trim()}
            className="bg-brand-accent hover:bg-brand-light text-brand-text px-4 py-2 rounded-md text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
      </form>
    </Card>
  );
};
