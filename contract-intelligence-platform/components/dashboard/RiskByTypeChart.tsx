
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card } from '../ui/Card';

interface ChartData {
  name: string;
  avgRisk: number;
  count: number;
}

interface RiskByTypeChartProps {
  data: ChartData[];
}

const getRiskColor = (risk: number) => {
    if (risk <= 3) return '#10B981'; // green
    if (risk <= 6) return '#F59E0B'; // yellow
    return '#EF4444'; // red
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as ChartData;
    return (
      <div className="bg-brand-secondary/95 backdrop-blur-md border border-brand-highlight/30 p-3 rounded-lg shadow-2xl text-sm animate-fade-in ring-1 ring-white/10">
        <p className="font-bold text-brand-highlight mb-2 border-b border-brand-accent/30 pb-1">{label}</p>
        <div className="space-y-1.5 min-w-[140px]">
            <div className="flex justify-between items-center gap-4">
                <span className="text-brand-light text-xs uppercase tracking-wider">Avg. Risk</span>
                <span className={`font-mono font-bold px-1.5 py-0.5 rounded bg-black/20 ${getRiskColor(data.avgRisk)}`}>
                    {data.avgRisk.toFixed(1)}
                </span>
            </div>
            <div className="flex justify-between items-center gap-4">
                <span className="text-brand-light text-xs uppercase tracking-wider">Volume</span>
                <span className="text-brand-text font-mono font-bold">{data.count}</span>
            </div>
        </div>
      </div>
    );
  }
  return null;
};

export const RiskByTypeChart: React.FC<RiskByTypeChartProps> = ({ data }) => {
  return (
    <Card className="col-span-1 border border-brand-accent/20 hover:border-brand-highlight/20 transition-colors">
      <h3 className="text-sm font-bold uppercase tracking-widest text-brand-light mb-6 flex items-center gap-2">
        <span className="w-1 h-4 bg-brand-highlight rounded-full"></span>
        Risk Index by Category
      </h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          {data.length > 0 ? (
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#415A77" horizontal={false} opacity={0.3} />
              <XAxis type="number" stroke="#E0E1DD" domain={[0, 10]} hide />
              <YAxis 
                type="category" 
                dataKey="name" 
                stroke="#778DA9" 
                width={90} 
                tick={{ fontSize: 10, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                content={<CustomTooltip />} 
                cursor={{ fill: 'rgba(56, 189, 248, 0.05)' }} 
                animationDuration={200}
              />
              <Bar 
                dataKey="avgRisk" 
                barSize={12} 
                radius={[0, 10, 10, 0]}
                animationDuration={1000}
                animationEasing="ease-out"
              >
                  {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getRiskColor(entry.avgRisk)} fillOpacity={0.8} />
                  ))}
              </Bar>
            </BarChart>
          ) : (
             <div className="flex flex-col items-center justify-center h-full text-brand-light/40 italic">
               <svg className="w-8 h-8 mb-2 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
               </svg>
               <span className="text-xs">No analytics available</span>
             </div>
          )}
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
