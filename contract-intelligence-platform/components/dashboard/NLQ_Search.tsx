
import React, { useState } from 'react';
import { SearchIcon } from '../ui/Icons';

interface NLQSearchProps {
    query: string;
    setQuery: (query: string) => void;
    onAskAI: (query: string) => void;
    isAiLoading: boolean;
}

export const NLQ_Search: React.FC<NLQSearchProps> = ({ query, setQuery, onAskAI, isAiLoading }) => {
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && query.trim()) {
            onAskAI(query);
        }
    };

    return (
        <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className={`h-5 w-5 transition-colors ${isAiLoading ? 'text-brand-highlight animate-pulse' : 'text-brand-light'}`} />
            </div>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isAiLoading}
                placeholder='Search or ask AI... (e.g., "Which contracts have uncapped liability?")'
                className={`block w-full bg-brand-accent/50 text-brand-text border-brand-light/30 rounded-lg py-3 pl-10 pr-24 shadow-inner focus:outline-none focus:ring-2 focus:ring-brand-highlight transition-all ${isAiLoading ? 'opacity-70 cursor-wait' : 'hover:bg-brand-accent'}`}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                <button
                    onClick={() => onAskAI(query)}
                    disabled={isAiLoading || !query.trim()}
                    className="bg-brand-highlight text-brand-primary px-3 py-1.5 rounded-md text-xs font-bold hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {isAiLoading ? (
                        <span className="flex items-center">
                            <svg className="animate-spin h-3 w-3 mr-2" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Thinking...
                        </span>
                    ) : 'ASK AI'}
                </button>
            </div>
            {query && !isAiLoading && (
                <div className="absolute -bottom-6 left-0 text-[10px] text-brand-light animate-fade-in">
                    Press <span className="font-bold">Enter</span> for AI insights
                </div>
            )}
        </div>
    );
};
