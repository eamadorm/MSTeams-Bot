
import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, AreaChart, CartesianGrid, XAxis, YAxis, Area, BarChart, Bar } from 'recharts';
import { Risk, AuditResult } from '../../types';

interface AnalyticsViewProps {
  risks: Risk[];
  completedAudits: Record<string, AuditResult>;
  totalControls: number;
  agentsCount: number;
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ risks, completedAudits, totalControls, agentsCount }) => {
  const completedCount = Object.keys(completedAudits).length;
  const passedCount = Object.values(completedAudits).filter((a: AuditResult) => a.effective).length;
  
  // --- Mock Data for Analytics ---
  const riskTrendData = [
    { month: 'Jan', score: 88 },
    { month: 'Feb', score: 85 },
    { month: 'Mar', score: 82 },
    { month: 'Apr', score: 75 },
    { month: 'May', score: 70 },
    { month: 'Jun', score: 62 },
  ];

  const controlPerfData = [
    { name: 'IAM', effective: 12, ineffective: 3 },
    { name: 'Finance', effective: 8, ineffective: 1 },
    { name: 'IT Ops', effective: 15, ineffective: 5 },
    { name: 'Legal', effective: 5, ineffective: 0 },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <h1 className="text-3xl font-bold text-white mb-2">Operational Analytics</h1>
      <p className="text-slate-400 mb-8">Real-time insights into risk exposure and agent performance.</p>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
         <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Total Risk Exposure</div>
            <div className="flex items-end space-x-2">
               <span className="text-3xl font-bold text-white">{risks.reduce((acc, r) => acc + r.scoring, 0).toLocaleString()}</span>
               <span className="text-sm text-emerald-400 mb-1">-12% vs last month</span>
            </div>
         </div>
         <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Active Controls</div>
            <div className="flex items-end space-x-2">
               <span className="text-3xl font-bold text-blue-400">{totalControls}</span>
               <span className="text-sm text-slate-500 mb-1">controls defined</span>
            </div>
         </div>
         <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Agent Fleet Size</div>
            <div className="flex items-end space-x-2">
               <span className="text-3xl font-bold text-purple-400">{agentsCount}</span>
               <span className="text-sm text-slate-500 mb-1">active agents</span>
            </div>
         </div>
         <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Audit Velocity</div>
            <div className="flex items-end space-x-2">
               <span className="text-3xl font-bold text-emerald-400">2.4s</span>
               <span className="text-sm text-slate-500 mb-1">avg. check time</span>
            </div>
         </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
         <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-6">
               <h3 className="text-lg font-bold text-slate-200">Risk Reduction Trend</h3>
               <select className="bg-slate-800 border border-slate-700 text-xs text-slate-300 rounded px-2 py-1">
                  <option>Last 6 Months</option>
               </select>
            </div>
            <div className="h-72">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={riskTrendData}>
                     <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                     <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                     <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                     <Tooltip 
                        contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px'}} 
                        itemStyle={{color: '#e2e8f0'}}
                     />
                     <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>
         
         <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-6">
               <h3 className="text-lg font-bold text-slate-200">Control Performance by Domain</h3>
            </div>
            <div className="h-72">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={controlPerfData}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                     <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                     <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                     <Tooltip 
                        cursor={{fill: 'rgba(30, 41, 59, 0.5)'}}
                        contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px'}} 
                     />
                     <Legend />
                     <Bar dataKey="effective" name="Effective" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
                     <Bar dataKey="ineffective" name="Deficient" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={30} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 col-span-1">
              <h3 className="text-lg font-bold text-slate-200 mb-6">Current Audit Coverage</h3>
              <div className="h-64">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie 
                         data={[
                          { name: 'Effective', value: passedCount, color: '#10b981' },
                          { name: 'Ineffective', value: completedCount - passedCount, color: '#ef4444' },
                          { name: 'Untested', value: totalControls - completedCount, color: '#334155' }
                         ]} 
                         innerRadius={60} 
                         outerRadius={80} 
                         paddingAngle={5} 
                         dataKey="value"
                       >
                          {[
                             { name: 'Effective', value: passedCount, color: '#10b981' },
                             { name: 'Ineffective', value: completedCount - passedCount, color: '#ef4444' },
                             { name: 'Untested', value: totalControls - completedCount, color: '#334155' }
                          ].map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                       </Pie>
                       <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155'}} />
                       <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                 </ResponsiveContainer>
              </div>
          </div>
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 col-span-2">
             <h3 className="text-lg font-bold text-slate-200 mb-4">Recent Agent Activity</h3>
             <div className="space-y-4">
                {[1,2,3].map(i => (
                   <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-800">
                      <div className="flex items-center space-x-3">
                         <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                         <div>
                            <div className="text-sm font-medium text-slate-300">IAM Policy Scan - US East</div>
                            <div className="text-xs text-slate-500">Executed by Access Control Agent • 2 mins ago</div>
                         </div>
                      </div>
                      <span className="px-2 py-1 rounded text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">PASSED</span>
                   </div>
                ))}
             </div>
          </div>
       </div>
    </div>
  );
};

export default AnalyticsView;
