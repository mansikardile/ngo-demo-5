import React, { useState, useEffect } from 'react';
import { BarChart3, Download, Calendar, Filter } from 'lucide-react';
import { ApplicationShell } from '../../components/layout/ApplicationShell';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { ParticipationTrendChart } from '../../components/charts/ParticipationTrendChart';
import { FunnelChart } from '../../components/charts/FunnelChart';
import { StatusDonutChart } from '../../components/charts/StatusDonutChart';
import { CategoryBarChart } from '../../components/charts/CategoryBarChart';
import { VolunteerContributionChart } from '../../components/charts/VolunteerContributionChart';
import { analyticsService } from '../../services/analyticsService';
import { DashboardAnalytics } from '../../types';

export const AnalyticsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [dateRange, setDateRange] = useState('6M');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    const res = await analyticsService.getDashboardAnalytics();
    if (res.success) setAnalytics(res.data);
  };

  const ranges = [
    { value: '30D', label: 'Last 30 Days' },
    { value: '6M', label: 'Last 6 Months' },
    { value: '1Y', label: 'Last 1 Year' },
  ];

  return (
    <ApplicationShell>
      <PageHeader
        title="Impact Analytics & Reports Product"
        subtitle="Visual analytics platform consuming contract analytics aggregation schemas."
        action={
          <div className="flex items-center gap-3">
            <Select options={ranges} value={dateRange} onChange={(e) => setDateRange(e.target.value)} />
            <Button variant="emerald" size="sm" leftIcon={<Download className="w-4 h-4" />}>
              Download Analytics Brief
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <Card variant="solid" className="lg:col-span-2 p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4">6-Month Program Participation Trend</h3>
          {analytics && <ParticipationTrendChart data={analytics.participationTrend} />}
        </Card>

        <Card variant="solid" className="p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4">Lifecycle Conversion Funnel</h3>
          {analytics && <FunnelChart data={analytics.funnelData} />}
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <Card variant="solid" className="p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-2">Status Distribution</h3>
          {analytics && <StatusDonutChart data={analytics.statusDistribution} />}
        </Card>
        <Card variant="solid" className="p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-2">Category Performance</h3>
          {analytics && <CategoryBarChart data={analytics.categoryBreakdown} />}
        </Card>
        <Card variant="solid" className="p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-2">Volunteer Hours Over Time</h3>
          {analytics && <VolunteerContributionChart data={analytics.volunteerContributionHistory} />}
        </Card>
      </div>

      {/* Location Impact Table */}
      <Card variant="solid" className="p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3">Location-wise Impact Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
              <tr>
                <th className="py-3 px-4">Location / City</th>
                <th className="py-3 px-4">Participants Reached</th>
                <th className="py-3 px-4">Volunteers Engaged</th>
                <th className="py-3 px-4">Impact Hours Logged</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {analytics?.locationImpact.map((loc) => (
                <tr key={loc.location} className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-bold text-slate-900">{loc.location}</td>
                  <td className="py-3 px-4">{loc.participants.toLocaleString()}</td>
                  <td className="py-3 px-4">{loc.volunteers.toLocaleString()}</td>
                  <td className="py-3 px-4 font-mono font-bold text-indigo-700">{loc.hours.toLocaleString()} hrs</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </ApplicationShell>
  );
};
