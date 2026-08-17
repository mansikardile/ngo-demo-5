import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye, Award, Clock } from 'lucide-react';
import { ApplicationShell } from '../../components/layout/ApplicationShell';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Pagination } from '../../components/ui/Pagination';
import { volunteerService } from '../../services/volunteerService';
import { Volunteer, VolunteerStatus } from '../../types';

export const VolunteersPage: React.FC = () => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<VolunteerStatus | 'ALL'>('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    fetchVolunteers();
  }, [search, status, page]);

  const fetchVolunteers = async () => {
    setLoading(true);
    const res = await volunteerService.getVolunteers({ search, status, page, limit: 10 });
    if (res.success) {
      setVolunteers(res.data);
      setTotalPages(res.pagination.totalPages);
      setTotalItems(res.pagination.total);
    }
    setLoading(false);
  };

  const statusOptions = [
    { value: 'ALL', label: 'All Statuses' },
    { value: 'REGISTERED', label: 'REGISTERED' },
    { value: 'ASSIGNED', label: 'ASSIGNED' },
    { value: 'ACTIVE', label: 'ACTIVE' },
    { value: 'COMPLETED', label: 'COMPLETED' },
  ];

  return (
    <ApplicationShell>
      <PageHeader
        title="Volunteer Directory CRM"
        subtitle="Manage assigned volunteers, total logged impact hours, and skill qualifications."
      />

      <Card variant="solid" className="p-4 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4 shadow-xs">
        <Input
          placeholder="Search volunteer name, email, skills..."
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
                <th className="py-3.5 px-4">Volunteer ID</th>
                <th className="py-3.5 px-4">Volunteer Name</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Impact Hours</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Last Activity</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {volunteers.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">{v.volunteerId}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{v.name}</div>
                    <div className="text-[11px] text-slate-500 font-normal">{v.email}</div>
                  </td>
                  <td className="py-3.5 px-4 font-medium">{v.location}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">{v.totalHours} hrs</td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={v.status} />
                  </td>
                  <td className="py-3.5 px-4">{v.lastParticipation}</td>
                  <td className="py-3.5 px-4 text-right">
                    <Link to={`/admin/volunteers/${v.id}`}>
                      <button className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer">
                        <Eye className="w-4 h-4" />
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination currentPage={page} totalPages={totalPages} totalItems={totalItems} onPageChange={setPage} />
      </Card>
    </ApplicationShell>
  );
};
