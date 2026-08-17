import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit3, MapPin, Calendar, Users, Award, Clock, FileSpreadsheet } from 'lucide-react';
import { ApplicationShell } from '../../components/layout/ApplicationShell';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Skeleton } from '../../components/ui/Skeleton';
import { programService } from '../../services/programService';
import { Program } from '../../types';

export const AdminProgramDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchProgram();
  }, [id]);

  const fetchProgram = async () => {
    setLoading(true);
    const res = await programService.getProgramById(id!);
    if (res.success && res.data) setProgram(res.data);
    setLoading(false);
  };

  if (loading) {
    return (
      <ApplicationShell>
        <Skeleton className="h-12 w-1/2 mb-6" />
        <Skeleton className="h-64 w-full" />
      </ApplicationShell>
    );
  }

  if (!program) {
    return (
      <ApplicationShell>
        <div className="text-center py-12">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Program Not Found</h2>
          <Button variant="primary" onClick={() => navigate('/admin/programs')}>Back to List</Button>
        </div>
      </ApplicationShell>
    );
  }

  return (
    <ApplicationShell>
      <button
        onClick={() => navigate('/admin/programs')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-4 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Programs List
      </button>

      <PageHeader
        title={program.name}
        subtitle={`Program Code: ${program.programCode} • ${program.category}`}
        action={
          <div className="flex items-center gap-3">
            <Link to={`/admin/programs/${program.id}/edit`}>
              <Button variant="outline" size="sm" leftIcon={<Edit3 className="w-4 h-4" />}>
                Edit Program
              </Button>
            </Link>
            <Link to={`/admin/participants?programId=${program.id}`}>
              <Button variant="primary" size="sm" leftIcon={<Users className="w-4 h-4" />}>
                View Registered Participants
              </Button>
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card variant="solid" className="p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Program Overview</h3>
              <StatusBadge status={program.status} />
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">{program.description}</p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs text-slate-600">
              <div className="space-y-1">
                <span className="text-slate-400 font-semibold uppercase block">Location & Address</span>
                <p className="font-bold text-slate-900">{program.location} — {program.address}</p>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 font-semibold uppercase block">Date & Timing</span>
                <p className="font-bold text-slate-900">{new Date(program.date).toLocaleDateString()} ({program.startTime} - {program.endTime})</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card variant="solid" className="p-6 space-y-4 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Enrollment Metrics</h3>

            <div>
              <div className="flex justify-between text-xs text-slate-600 font-medium mb-1">
                <span>Participants</span>
                <span className="font-bold text-slate-900">{program.currentParticipants} / {program.maxParticipants}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${(program.currentParticipants / program.maxParticipants) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-600 font-medium mb-1">
                <span>Volunteers</span>
                <span className="font-bold text-slate-900">{program.currentVolunteers} / {program.volunteerRequirement}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${(program.currentVolunteers / program.volunteerRequirement) * 100}%` }} />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </ApplicationShell>
  );
};
