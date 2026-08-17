import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Users,
  Award,
  Clock,
  TrendingUp,
  Plus,
  FileSpreadsheet,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { ApplicationShell } from '../../components/layout/ApplicationShell';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ParticipationTrendChart } from '../../components/charts/ParticipationTrendChart';
import { FunnelChart } from '../../components/charts/FunnelChart';
import { StatusDonutChart } from '../../components/charts/StatusDonutChart';
import { CategoryBarChart } from '../../components/charts/CategoryBarChart';
import { VolunteerContributionChart } from '../../components/charts/VolunteerContributionChart';
import { analyticsService } from '../../services/analyticsService';
import { programService } from '../../services/programService';
import { participantService } from '../../services/participantService';
import { DashboardAnalytics, Program, Participant } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const AdminDashboardPage: React.FC = () => {
  const { user, role } = useAuth();
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [recentPrograms, setRecentPrograms] = useState<Program[]>([]);
  const [recentParticipants, setRecentParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    const [analyticsRes, programsRes, participantsRes] = await Promise.all([
      analyticsService.getDashboardAnalytics(),
      programService.getPrograms({ limit: 4 }),
      participantService.getParticipants({ limit: 4 }),
    ]);

    if (analyticsRes.success) setAnalytics(analyticsRes.data);
    if (programsRes.success) setRecentPrograms(programsRes.data);
    if (participantsRes.success) setRecentParticipants(participantsRes.data);
    setLoading(false);
  };

  const kpis = [
    { label: 'TOTAL PROGRAMS', value: analytics?.totalPrograms || 24, trend: '+12% this month', icon: Calendar, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'ACTIVE PROGRAMS', value: analytics?.activePrograms || 6, trend: '+8% this month', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'TOTAL PARTICIPANTS', value: analytics?.totalParticipants.toLocaleString() || '1,840', trend: '+15% this month', icon: Users, color: 'text-sky-600', bg: 'bg-sky-50' },
    { label: 'TOTAL VOLUNTEERS', value: analytics?.totalVolunteers.toLocaleString() || '312', trend: '+18% this month', icon: Award, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'ATTENDANCE RATE', value: `${analytics?.attendanceRate || 84.5}%`, trend: '+5.2% this month', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'VOLUNTEER IMPACT', value: `${analytics?.volunteerHours.toLocaleString()} hrs`, trend: '+18% this month', icon: Clock, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  return (
    <ApplicationShell>
      <PageHeader
        title={`Good morning, ${user?.name.split(' ')[0] || 'Admin'} 👋`}
        subtitle="Here's your real-time operational overview for community programs and volunteer tracking."
        action={
          <div className="flex items-center gap-3">
            <Link to="/admin/reports">
              <Button variant="outline" size="sm" leftIcon={<FileSpreadsheet className="w-4 h-4 text-slate-500" />}>
                Export Reports
              </Button>
            </Link>
            <Link to="/admin/programs/new">
              <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                Create Program
              </Button>
            </Link>
          </div>
        }
      />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label} variant="solid" className="p-4 flex flex-col justify-between shadow-xs border-slate-200/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{kpi.label}</span>
                <div className={`p-1.5 rounded-lg ${kpi.bg} ${kpi.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-extrabold font-mono text-slate-900 tracking-tight">{kpi.value}</div>
                <div className="text-[11px] font-semibold text-emerald-600 mt-1">{kpi.trend}</div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Main Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Participation Trend Chart */}
        <Card variant="solid" className="lg:col-span-2 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Program Participation Trend</h3>
              <p className="text-xs text-slate-500 font-medium">Monthly registrations vs completions</p>
            </div>
            <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
              Last 6 Months
            </span>
          </div>
          {analytics && <ParticipationTrendChart data={analytics.participationTrend} />}
        </Card>

        {/* Pipeline Funnel */}
        <Card variant="solid" className="p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Participation Pipeline</h3>
              <p className="text-xs text-slate-500 font-medium">Contract lifecycle funnel breakdown</p>
            </div>
          </div>
          {analytics && <FunnelChart data={analytics.funnelData} />}
        </Card>
      </div>

      {/* Secondary Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <Card variant="solid" className="p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-2">Programs by Status</h3>
          {analytics && <StatusDonutChart data={analytics.statusDistribution} />}
        </Card>

        <Card variant="solid" className="p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-2">Programs by Category</h3>
          {analytics && <CategoryBarChart data={analytics.categoryBreakdown} />}
        </Card>

        <Card variant="solid" className="p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-2">Volunteer Hours Over Time</h3>
          {analytics && <VolunteerContributionChart data={analytics.volunteerContributionHistory} />}
        </Card>
      </div>

      {/* Data Overview Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Programs Overview */}
        <Card variant="solid" className="p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Active Community Programs</h3>
            <Link to="/admin/programs" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentPrograms.map((p) => (
              <div key={p.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">{p.programCode}</span>
                    <StatusBadge status={p.status} />
                  </div>
                  <h4 className="font-bold text-slate-900 mt-1">{p.name}</h4>
                  <p className="text-[11px] text-slate-500 font-medium">{p.location} • {new Date(p.date).toLocaleDateString()}</p>
                </div>
                <Link to={`/admin/programs/${p.id}`}>
                  <Button variant="ghost" size="sm">Manage</Button>
                </Link>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Participant Registrations */}
        <Card variant="solid" className="p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Recent Participant Registrations</h3>
            <Link to="/admin/participants" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              View All CRM <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentParticipants.map((pt) => (
              <div key={pt.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">{pt.trackingId}</span>
                    <StatusBadge status={pt.status} />
                  </div>
                  <h4 className="font-bold text-slate-900 mt-1">{pt.name}</h4>
                  <p className="text-[11px] text-slate-500 font-medium">{pt.programName}</p>
                </div>
                <Link to={`/admin/participants/${pt.id}`}>
                  <Button variant="ghost" size="sm">Details</Button>
                </Link>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </ApplicationShell>
  );
};
