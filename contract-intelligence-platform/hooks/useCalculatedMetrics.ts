
import { useMemo } from 'react';
import { Contract } from '../types';

export const useCalculatedMetrics = (contracts: Contract[]) => {
  const metrics = useMemo(() => {
    if (contracts.length === 0) {
      return {
        totalContracts: 0,
        avgRiskScore: 0,
        expiringSoon: 0,
        riskByTypeData: [],
        riskDistributionData: [],
        governingLawData: [],
      };
    }

    const totalContracts = contracts.length;

    const avgRiskScore =
      contracts.reduce((acc, c) => acc + c.riskScore, 0) / totalContracts;

    const today = new Date();
    const ninetyDaysFromNow = new Date();
    ninetyDaysFromNow.setDate(today.getDate() + 90);
    const expiringSoon = contracts.filter(c => {
      const expirationDate = new Date(c.expirationDate);
      return expirationDate > today && expirationDate <= ninetyDaysFromNow;
    }).length;

    const riskByType = contracts.reduce((acc, c) => {
      if (!acc[c.contractType]) {
        acc[c.contractType] = { totalRisk: 0, count: 0 };
      }
      acc[c.contractType].totalRisk += c.riskScore;
      acc[c.contractType].count++;
      return acc;
    }, {} as Record<string, { totalRisk: number; count: number }>);

    const riskByTypeData = Object.entries(riskByType)
      .map(([name, { totalRisk, count }]) => ({
        name,
        avgRisk: totalRisk / count,
        count,
      }))
      .sort((a, b) => b.avgRisk - a.avgRisk);

    const riskDistribution = contracts.reduce(
      (acc, c) => {
        if (c.riskScore <= 3) acc.low++;
        else if (c.riskScore <= 6) acc.medium++;
        else acc.high++;
        return acc;
      },
      { low: 0, medium: 0, high: 0 }
    );
    const riskDistributionData = [
      { name: 'Low Risk (1-3)', value: riskDistribution.low, fill: '#10B981' }, // Emerald-500
      { name: 'Medium Risk (4-6)', value: riskDistribution.medium, fill: '#F59E0B' }, // Amber-500
      { name: 'High Risk (7-10)', value: riskDistribution.high, fill: '#EF4444' }, // Red-500
    ];

    const governingLaw = contracts.reduce((acc, c) => {
      acc[c.governingLaw] = (acc[c.governingLaw] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const governingLawData = Object.entries(governingLaw).map(([name, value]) => ({
      name,
      value,
    })).sort((a,b) => b.value - a.value);

    return {
      totalContracts,
      avgRiskScore: parseFloat(avgRiskScore.toFixed(1)),
      expiringSoon,
      riskByTypeData,
      riskDistributionData,
      governingLawData,
    };
  }, [contracts]);

  return metrics;
};