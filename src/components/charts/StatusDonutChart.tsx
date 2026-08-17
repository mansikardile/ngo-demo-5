import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { ProgramStatus } from '../../types';

export interface StatusDonutChartProps {
  data: { status: ProgramStatus; count: number }[];
}

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: '#10b981',
  UPCOMING: '#6366f1',
  COMPLETED: '#0284c7',
  DRAFT: '#f59e0b',
  CANCELLED: '#f43f5e',
};

export const StatusDonutChart: React.FC<StatusDonutChartProps> = ({ data }) => {
  return (
    <div className="w-full h-64 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={4}
            dataKey="count"
            nameKey="status"
          >
            {data.map((entry) => (
              <Cell key={entry.status} fill={STATUS_COLORS[entry.status] || '#94a3b8'} stroke="#ffffff" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', color: '#0f172a', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
