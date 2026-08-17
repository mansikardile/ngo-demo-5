import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Eye, Download } from 'lucide-react';
import { ApplicationShell } from '../../components/layout/ApplicationShell';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Pagination } from '../../components/ui/Pagination';
import { participantService } from '../../services/participantService';
import { Participant, RegistrationStatus } from '../../types';

export const ParticipantsPage: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<RegistrationStatus | 'ALL'>('ALL');
  const [location, setLocation] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    fetchParticipants();
  }, [search, status, location, page]);

  const fetchParticipants = async () => {
    setLoading(true);
    const res = await participantService.getParticipants({
      search,
      status,
      location,
      page,
      limit: 10,
    });
    if (res.success) {
      setParticipants(res.data);
      setTotalPages(res.pagination.totalPages);
      setTotalItems(res.pagination.total);
    }
    setLoading(false);
  };

  const statusOptions = [
    { value: 'ALL', label: 'All Statuses' },
    { value: 'REGISTERED', label: 'REGISTERED' },
    { value: 'ATTENDED', label: 'ATTENDED' },
    { value: 'PARTICIPATED', label: 'PARTICIPATED' },
    { value: 'COMPLETED', label: 'COMPLETED' },
  ];

  const locationOptions = [
    { value: 'ALL', label: 'All Locations' },
    { value: 'Pune', label: 'Pune' },
    { value: 'Mumbai', label: 'Mumbai' },
    { value: 'Delhi', label: 'Delhi' },
    { value: 'Bangalore', label: 'Bangalore' },
  ];

  return (
    <ApplicationShell>
      <PageHeader
        title="Participant CRM"
        subtitle="Comprehensive database of enrolled participants, tracking codes, and participation status."
        action={
          <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />}>
            Export Records CSV
          </Button>
        }
      />

      <Card variant="solid" className="p-4 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4 shadow-xs">
        <Input
          placeholder="Search name, email, tracking ID..."
          leftIcon={<Search className="w-4 h-4 text-slate-400" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select options={statusOptions} value={status} onChange={(e) => setStatus(e.target.value as any)} />
        <Select options={locationOptions} value={location} onChange={(e) => setLocation(e.target.value)} />
      </Card>

      <Card variant="solid" className="overflow-hidden p-0 shadow-xs border-slate-200/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Tracking ID</th>
                <th className="py-3.5 px-4">Participant</th>
                <th className="py-3.5 px-4">College / Org</th>
                <th className="py-3.5 px-4">Program</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Reg Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {participants.map((pt) => (
                <tr key={pt.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">{pt.trackingId}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{pt.name}</div>
                    <div className="text-[11px] text-slate-500 font-normal">{pt.email}</div>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs truncate">{pt.collegeOrOrganization}</td>
                  <td className="py-3.5 px-4 max-w-xs truncate font-medium">{pt.programName}</td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={pt.status} />
                  </td>
                  <td className="py-3.5 px-4">{new Date(pt.registeredDate).toLocaleDateString()}</td>
                  <td className="py-3.5 px-4 text-right">
                    <Link to={`/admin/participants/${pt.id}`}>
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
