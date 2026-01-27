
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card } from '../ui/Card';

interface ChartData {
  name: string;
  value: number;
  [key: string]: any;
}

interface GoverningLawChartProps {
  data: ChartData[];
}

const COLORS = ['#38BDF8', '#818CF8', '#A78BFA', '#F472B6', '#FB923C', '#A3E635'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const color = payload[0].payload.fill || COLORS[0];
    return (
      <div className="bg-brand-secondary/95 backdrop-blur-md border border-brand-highlight/30 p-2.5 rounded-lg shadow-2xl text-sm animate-fade-in ring-1 ring-white/10">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></span>
          <span className="font-bold text-brand-text text-xs uppercase tracking-tight">{data.name}</span>
        </div>
        <div className="flex justify-between items-center gap-6">
          <span className="text-brand-light text-[10px] uppercase">Jurisdiction</span>
          <span className="text-brand-highlight font-mono font-bold">{data.value} {data.value === 1 ? 'Contract' : 'Contracts'}</span>
        </div>
      </div>
    );
  }
  return null;
};

export const GoverningLawChart: React.FC<GoverningLawChartProps> = ({ data }) => {
  const hasData = data.some(item => item.value > 0);
  return (
    <Card className="col-span-1 border border-brand-accent/20 hover:border-brand-highlight/20 transition-colors">
      <h3 className="text-sm font-bold uppercase tracking-widest text-brand-light mb-6 flex items-center gap-2">
        <span className="w-1 h-4 bg-brand-highlight rounded-full"></span>
        Legal Jurisdiction
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
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                animationBegin={400}
                animationDuration={1500}
                animationEasing="ease-in-out"
                stroke="rgba(0,0,0,0.1)"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle" 
                iconSize={8}
                formatter={(value) => <span className="text-[10px] text-brand-light uppercase tracking-tighter font-medium">{value}</span>}
              />
            </PieChart>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-brand-light/40 italic">
               <svg className="w-8 h-8 mb-2 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
               </svg>
               <span className="text-xs">No jurisdiction data</span>
             </div>
          )}
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
