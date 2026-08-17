import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export interface VolunteerContributionChartProps {
  data: { month: string; hours: number }[];
}

export const VolunteerContributionChart: React.FC<VolunteerContributionChartProps> = ({ data }) => {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} />
          <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', color: '#0f172a', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
          />
          <Line type="monotone" dataKey="hours" stroke="#0284c7" strokeWidth={3} dot={{ fill: '#0284c7', r: 4 }} name="Volunteer Hours" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
