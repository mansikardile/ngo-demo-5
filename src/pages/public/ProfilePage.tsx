import React from 'react';
import { Award, Clock, Calendar, MapPin, Mail, Phone, CheckCircle2 } from 'lucide-react';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { mockVolunteers } from '../../mock/volunteers';
import { VolunteerContributionChart } from '../../components/charts/VolunteerContributionChart';
import { mockDashboardAnalytics } from '../../mock/analytics';

export const ProfilePage: React.FC = () => {
  const volunteer = mockVolunteers[0]; // Kabir Mehta

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Header />

      <main className="flex-1 py-12 max-w-5xl mx-auto px-4 sm:px-6 w-full space-y-8">
        {/* Profile Card */}
        <Card variant="solid" className="p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xl font-bold border-2 border-indigo-200 shadow-sm">
                KM
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-extrabold text-slate-900">{volunteer.name}</h1>
                  <Badge variant="emerald">{volunteer.status}</Badge>
                </div>
                <p className="text-xs text-slate-500 font-mono mt-1 font-semibold">Volunteer ID: {volunteer.volunteerId}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-xs text-slate-500 font-bold block uppercase tracking-wider">Total Verified Hours</span>
                <span className="text-2xl font-mono font-extrabold text-indigo-600">{volunteer.totalHours} hrs</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-xs text-slate-600 font-medium">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-indigo-600" />
              <span>{volunteer.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>{volunteer.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-purple-600" />
              <span>{volunteer.location}, Maharashtra</span>
            </div>
          </div>
        </Card>

        {/* Contribution Chart & Programs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card variant="solid" className="p-6">
            <h3 className="text-base font-bold text-slate-900 mb-4">Monthly Volunteer Hours Contribution</h3>
            <VolunteerContributionChart data={mockDashboardAnalytics.volunteerContributionHistory} />
          </Card>

          <Card variant="solid" className="p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Programs Supported</h3>
            <div className="space-y-3">
              {volunteer.assignedPrograms.map((p) => (
                <div key={p.programId} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900">{p.programName}</h4>
                    <span className="text-[11px] text-slate-500 font-medium">{p.role}</span>
                  </div>
                  <span className="font-mono font-bold text-indigo-600">{p.hoursLogged} hrs</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};
