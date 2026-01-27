
import React from 'react';
import { Contract } from '../../types';
import { Card } from '../ui/Card';

interface AI_ExtractedDataProps {
  contract: Contract;
}

const DataRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt className="text-sm font-medium text-brand-light">{label}</dt>
        <dd className="mt-1 text-sm text-brand-text sm:mt-0 sm:col-span-2">{value}</dd>
    </div>
);

export const AI_ExtractedData: React.FC<AI_ExtractedDataProps> = ({ contract }) => {
  return (
    <Card>
        <h3 className="text-lg font-semibold text-brand-text mb-4">Extracted Intelligence</h3>
        <dl className="divide-y divide-brand-accent">
            <DataRow label="Parties" value={
                <div className="flex flex-wrap gap-2">
                    {contract.parties.map(p => <span key={p} className="px-2 py-1 bg-brand-accent text-xs rounded-full">{p}</span>)}
                </div>
            } />
            <DataRow label="Contract Type" value={contract.contractType} />
            <DataRow label="Effective Date" value={contract.effectiveDate} />
            <DataRow label="Expiration Date" value={contract.expirationDate} />
            <DataRow label="Governing Law" value={contract.governingLaw} />
            <DataRow label="Renewal Terms" value={<p className="whitespace-pre-wrap font-mono text-xs">{contract.renewalTerms}</p>} />
            <DataRow label="Termination Terms" value={<p className="whitespace-pre-wrap font-mono text-xs">{contract.terminationTerms}</p>} />
            <DataRow label="Liability Terms" value={<p className="whitespace-pre-wrap font-mono text-xs">{contract.liabilityTerms}</p>} />
            {Object.entries(contract.industrySpecific).map(([key, value]) => (
                <DataRow key={key} label={key.replace(/([A-Z])/g, ' $1').trim()} value={String(value)} />
            ))}
        </dl>
    </Card>
  );
};