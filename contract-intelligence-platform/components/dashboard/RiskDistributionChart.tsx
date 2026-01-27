
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card } from '../ui/Card';

interface ChartData {
  name: string;
  value: number;
  fill: string;
  [key: string]: any;
}

interface RiskDistributionChartProps {
  data: ChartData[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-brand-secondary/95 backdrop-blur-md border border-brand-highlight/30 p-2.5 rounded-lg shadow-2xl text-sm animate-fade-in ring-1 ring-white/10">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: data.fill }}></span>
          <span className="font-bold text-brand-text text-xs uppercase tracking-tight">{data.name}</span>
        </div>
        <div className="flex justify-between items-center gap-6">
          <span className="text-brand-light text-[10px] uppercase">Count</span>
          <span className="text-brand-highlight font-mono font-bold">{data.value}</span>
        </div>
      </div>
    );
  }
  return null;
};

export const RiskDistributionChart: React.FC<RiskDistributionChartProps> = ({ data }) => {
  const hasData = data.some(item => item.value > 0);
  return (
    <Card className="col-span-1 border border-brand-accent/20 hover:border-brand-highlight/20 transition-colors">
      <h3 className="text-sm font-bold uppercase tracking-widest text-brand-light mb-6 flex items-center gap-2">
        <span className="w-1 h-4 bg-brand-highlight rounded-full"></span>
        Portfolio Risk Spread
      </h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          {hasData ? (
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="45%"
                labelLine={false}
                outerRadius={85}
                innerRadius={60}
                fill="#8884d8"
                dataKey="value"
                paddingAngle={8}
                animationBegin={200}
                animationDuration={1200}
                animationEasing="ease-out"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.fill} 
                    style={{ filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.3))' }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle" 
                iconSize={8}
                formatter={(value) => <span className="text-[11px] text-brand-light uppercase tracking-wider font-medium">{value}</span>}
              />
            </PieChart>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-brand-light/40 italic">
               <svg className="w-8 h-8 mb-2 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
               </svg>
               <span className="text-xs">Insufficient risk data</span>
             </div>
          )}
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
