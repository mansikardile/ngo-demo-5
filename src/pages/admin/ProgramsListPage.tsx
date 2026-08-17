import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, Calendar, MapPin, Users, Edit3, Trash2, Eye } from 'lucide-react';
import { ApplicationShell } from '../../components/layout/ApplicationShell';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Pagination } from '../../components/ui/Pagination';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { programService } from '../../services/programService';
import { Program, ProgramStatus } from '../../types';

export const ProgramsListPage: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ProgramStatus | 'ALL'>('ALL');
  const [location, setLocation] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchPrograms();
  }, [search, status, location, page]);

  const fetchPrograms = async () => {
    setLoading(true);
    const res = await programService.getPrograms({
      search,
      status,
      location,
      page,
      limit: 10,
    });
    if (res.success) {
      setPrograms(res.data);
      setTotalPages(res.pagination.totalPages);
      setTotalItems(res.pagination.total);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await programService.deleteProgram(deleteId);
    setDeleteId(null);
    fetchPrograms();
  };

  const statusOptions = [
    { value: 'ALL', label: 'All Statuses' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'UPCOMING', label: 'Upcoming' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'DRAFT', label: 'Draft' },
    { value: 'CANCELLED', label: 'Cancelled' },
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
        title="Program Management"
        subtitle="Create, monitor, and configure grassroots community programs."
        action={
          <Link to="/admin/programs/new">
            <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
              Create Program
            </Button>
          </Link>
        }
      />

      {/* Filter Toolbar */}
      <Card variant="solid" className="p-4 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4 shadow-xs">
        <Input
          placeholder="Search program name, code..."
          leftIcon={<Search className="w-4 h-4 text-slate-400" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          options={statusOptions}
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
        />
        <Select
          options={locationOptions}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </Card>

      {/* Data Table */}
      <Card variant="solid" className="overflow-hidden p-0 shadow-xs border-slate-200/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Program Code</th>
                <th className="py-3.5 px-4">Program Name</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Capacity</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {programs.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">{p.programCode}</td>
                  <td className="py-3.5 px-4 max-w-xs truncate font-bold text-slate-900">{p.name}</td>
                  <td className="py-3.5 px-4 font-medium">{p.location}</td>
                  <td className="py-3.5 px-4 font-medium">{new Date(p.date).toLocaleDateString()}</td>
                  <td className="py-3.5 px-4 font-medium">
                    {p.currentParticipants} / {p.maxParticipants}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <Link to={`/admin/programs/${p.id}`}>
                      <button className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer">
                        <Eye className="w-4 h-4" />
                      </button>
                    </Link>
                    <Link to={`/admin/programs/${p.id}/edit`}>
                      <button className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition-colors cursor-pointer">
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </Link>
                    <button
                      onClick={() => setDeleteId(p.id)}
                      className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalItems}
          onPageChange={setPage}
        />
      </Card>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Program"
        description="Are you sure you want to delete this program record? This action is mock-only in Phase 1."
      />
    </ApplicationShell>
  );
};
