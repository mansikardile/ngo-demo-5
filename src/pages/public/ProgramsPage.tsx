import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, MapPin, Calendar, Users, ArrowRight } from 'lucide-react';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Pagination } from '../../components/ui/Pagination';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { programService } from '../../services/programService';
import { Program, ProgramStatus } from '../../types';

export const ProgramsPage: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');
  const [location, setLocation] = useState('ALL');
  const [status, setStatus] = useState<ProgramStatus | 'ALL'>('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    fetchPrograms();
  }, [search, category, location, status, page]);

  const fetchPrograms = async () => {
    setLoading(true);
    const res = await programService.getPrograms({
      search,
      category,
      location,
      status,
      page,
      limit: 6,
    });
    if (res.success) {
      setPrograms(res.data);
      setTotalPages(res.pagination.totalPages);
      setTotalItems(res.pagination.total);
    }
    setLoading(false);
  };

  const categories = [
    { value: 'ALL', label: 'All Categories' },
    { value: 'Education & Technology', label: 'Education & Tech' },
    { value: 'Environment & Sustainability', label: 'Environment' },
    { value: 'Healthcare & Wellness', label: 'Healthcare' },
    { value: 'Vocational Training', label: 'Vocational Training' },
    { value: 'Agriculture & Green Tech', label: 'Agriculture' },
  ];

  const locations = [
    { value: 'ALL', label: 'All Locations' },
    { value: 'Pune', label: 'Pune' },
    { value: 'Mumbai', label: 'Mumbai' },
    { value: 'Delhi', label: 'Delhi' },
    { value: 'Bangalore', label: 'Bangalore' },
  ];

  const statuses = [
    { value: 'ALL', label: 'All Statuses' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'UPCOMING', label: 'Upcoming' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'DRAFT', label: 'Draft' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Header />

      <main className="flex-1 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Header */}
        <div className="mb-8 text-center sm:text-left">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest block mb-2">Impact Catalog</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Explore Community Programs</h1>
          <p className="text-sm text-slate-600 mt-2 font-medium">Discover, participate, or volunteer in grassroots community initiatives across India.</p>
        </div>

        {/* Filter Bar */}
        <Card variant="solid" className="p-5 mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            placeholder="Search name, code, description..."
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          <Select
            options={categories}
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
          />

          <Select
            options={locations}
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              setPage(1);
            }}
          />

          <Select
            options={statuses}
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as any);
              setPage(1);
            }}
          />
        </Card>

        {/* Grid or Skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <Card key={n} className="h-64 flex flex-col justify-between">
                <div className="space-y-3">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-12 w-full" />
                </div>
                <Skeleton className="h-8 w-full" />
              </Card>
            ))}
          </div>
        ) : programs.length === 0 ? (
          <EmptyState
            title="No programs match your filters"
            description="Try resetting your search query or selecting a different category/location filter."
            onAction={() => {
              setSearch('');
              setCategory('ALL');
              setLocation('ALL');
              setStatus('ALL');
              setPage(1);
            }}
            actionLabel="Reset Filters"
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {programs.map((p) => (
                <Card key={p.id} variant="interactive" className="flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-100">
                        {p.programCode}
                      </span>
                      <StatusBadge status={p.status} />
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">{p.name}</h3>
                    <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">{p.description}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span className="truncate">{p.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{new Date(p.date).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                        <Users className="w-3.5 h-3.5 text-purple-600" />
                        <span>{p.currentParticipants} / {p.maxParticipants}</span>
                      </div>

                      <Link to={`/programs/${p.id}`}>
                        <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={6}
              onPageChange={setPage}
            />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};
