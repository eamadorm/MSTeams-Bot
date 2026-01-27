
import React from 'react';
import { IndustryTrack } from '../../types';

interface IndustrySelectorProps {
  selectedIndustry: IndustryTrack;
  onChange: (industry: IndustryTrack) => void;
}

const industries: IndustryTrack[] = ["All", "Financial Services", "Healthcare", "Manufacturing", "Base"];

export const IndustrySelector: React.FC<IndustrySelectorProps> = ({ selectedIndustry, onChange }) => {
  return (
    <div className="w-full md:w-64">
      <label htmlFor="industry-selector" className="sr-only">Select Industry</label>
      <select
        id="industry-selector"
        value={selectedIndustry}
        onChange={(e) => onChange(e.target.value as IndustryTrack)}
        className="w-full bg-brand-accent text-brand-text border-brand-light rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-highlight"
      >
        {industries.map(industry => (
          <option key={industry} value={industry}>
            {industry}
          </option>
        ))}
      </select>
    </div>
  );
};