
import React from 'react';

interface ContractTypeSelectorProps {
  selectedType: string;
  onChange: (type: string) => void;
  availableTypes: string[];
}

export const ContractTypeSelector: React.FC<ContractTypeSelectorProps> = ({ selectedType, onChange, availableTypes }) => {
  return (
    <div className="w-full md:w-64">
      <label htmlFor="type-selector" className="sr-only">Select Contract Type</label>
      <select
        id="type-selector"
        value={selectedType}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-brand-accent text-brand-text border-brand-light rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-highlight"
      >
        <option value="All">All Types</option>
        {availableTypes.map(type => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
    </div>
  );
};
