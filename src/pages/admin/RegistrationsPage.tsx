import React, { useState, useEffect } from 'react';
import { Search, Filter, ClipboardList } from 'lucide-react';
import { ApplicationShell } from '../../components/layout/ApplicationShell';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Pagination } from '../../components/ui/Pagination';
import { participantService } from '../../services/participantService';
import { Registration, RegistrationStatus } from '../../types';

export const RegistrationsPage: React.FC = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<RegistrationStatus | 'ALL'>('ALL');

  useEffect(() => {
    fetchRegistrations();
  }, [search, status]);

  const fetchRegistrations = async () => {
    const res = await participantService.getRegistrations({ search, status });
    if (res.success) setRegistrations(res.data);
  };

  const statusOptions = [
    { value: 'ALL', label: 'All Statuses' },
    { value: 'REGISTERED', label: 'REGISTERED' },
    { value: 'ATTENDED', label: 'ATTENDED' },
    { value: 'PARTICIPATED', label: 'PARTICIPATED' },
    { value: 'COMPLETED', label: 'COMPLETED' },
  ];

  return (
    <ApplicationShell>
      <PageHeader
        title="Central Registration Management"
        subtitle="Manage program registrations adhering to contract registration lifecycle states."
      />

      <Card variant="solid" className="p-4 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4 shadow-xs">
        <Input
          placeholder="Search registration ID, person name..."
          leftIcon={<Search className="w-4 h-4 text-slate-400" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select options={statusOptions} value={status} onChange={(e) => setStatus(e.target.value as any)} />
      </Card>

      <Card variant="solid" className="overflow-hidden p-0 shadow-xs border-slate-200/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Tracking Code</th>
                <th className="py-3.5 px-4">Registrant Name</th>
                <th className="py-3.5 px-4">Program Name</th>
                <th className="py-3.5 px-4">Reg Type</th>
                <th className="py-3.5 px-4">Registration Date</th>
                <th className="py-3.5 px-4">Current Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {registrations.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">{r.trackingId}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{r.personName}</div>
                    <div className="text-[11px] text-slate-500 font-normal">{r.email}</div>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs truncate font-medium">{r.programName}</td>
                  <td className="py-3.5 px-4">{r.registrationType}</td>
                  <td className="py-3.5 px-4">{new Date(r.registrationDate).toLocaleDateString()}</td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={r.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </ApplicationShell>
  );
};
