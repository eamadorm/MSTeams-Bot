
import React from 'react';
import { Contract } from '../../types';
import { Card } from '../ui/Card';

interface AI_SummaryProps {
  contract: Contract;
}

const RiskScoreDisplay: React.FC<{ score: number }> = ({ score }) => {
    let circleColorClasses = 'bg-gray-500 text-gray-100';
    let textColorClasses = 'text-gray-400';
    let text = 'Medium Risk';

    if (score <= 3) {
      circleColorClasses = 'bg-green-600 text-green-100';
      textColorClasses = 'text-green-400';
      text = 'Low Risk';
    } else if (score <= 6) {
      circleColorClasses = 'bg-yellow-600 text-yellow-100';
      textColorClasses = 'text-yellow-400';
      text = 'Medium Risk';
    } else {
      circleColorClasses = 'bg-red-600 text-red-100';
      textColorClasses = 'text-red-400';
      text = 'High Risk';
    }

    return (
        <div className="text-center">
            <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold ${circleColorClasses}`}>
                {score}
            </div>
            <p className={`mt-2 font-semibold ${textColorClasses}`}>{text}</p>
        </div>
    );
};

export const AI_Summary: React.FC<AI_SummaryProps> = ({ contract }) => {
  return (
    <Card>
        <h2 className="text-xl font-bold text-brand-text mb-4">{contract.contractTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
                <RiskScoreDisplay score={contract.riskScore} />
            </div>
            <div className="md:col-span-2 space-y-4">
                <div>
                    <h3 className="font-semibold text-brand-highlight">Executive Summary</h3>
                    <p className="text-sm text-brand-light">{contract.executiveSummary}</p>
                </div>
                <div>
                    <h3 className="font-semibold text-brand-highlight">Risk Analysis</h3>
                    <p className="text-sm text-brand-light">{contract.riskAnalysis}</p>
                </div>
            </div>
        </div>
    </Card>
  );
};