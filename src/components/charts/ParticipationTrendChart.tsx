import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

export interface ParticipationTrendChartProps {
  data: { month: string; registered: number; completed: number }[];
}

export const ParticipationTrendChart: React.FC<ParticipationTrendChartProps> = ({ data }) => {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorComp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} />
          <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', color: '#0f172a', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
          />
          <Area type="monotone" dataKey="registered" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorReg)" name="Registered" />
          <Area type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorComp)" name="Completed" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
