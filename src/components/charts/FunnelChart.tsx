import React from 'react';

export interface FunnelChartProps {
  data: { stage: string; count: number }[];
}

export const FunnelChart: React.FC<FunnelChartProps> = ({ data }) => {
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  const colors = [
    'from-indigo-500 to-purple-600',
    'from-blue-500 to-indigo-500',
    'from-purple-500 to-pink-500',
    'from-emerald-500 to-teal-500',
  ];

  return (
    <div className="w-full flex flex-col gap-4 py-2">
      {data.map((item, idx) => {
        const percentage = Math.round((item.count / maxCount) * 100);
        return (
          <div key={item.stage} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-600" />
                {item.stage}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-slate-900 font-bold">{item.count.toLocaleString()}</span>
                <span className="text-slate-500 font-mono text-[11px]">{percentage}%</span>
              </div>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${colors[idx % colors.length]} transition-all duration-500`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
