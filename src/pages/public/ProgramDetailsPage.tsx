import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  Award,
  ArrowLeft,
  Share2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Skeleton } from '../../components/ui/Skeleton';
import { programService } from '../../services/programService';
import { Program } from '../../types';

export const ProgramDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchProgram();
  }, [id]);

  const fetchProgram = async () => {
    setLoading(true);
    const res = await programService.getProgramById(id!);
    if (res.success && res.data) {
      setProgram(res.data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
        <Header />
        <main className="flex-1 max-w-5xl mx-auto px-4 py-12 w-full space-y-6">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-64 w-full" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <AlertCircle className="w-12 h-12 text-rose-500 mb-4" />
          <h2 className="text-xl font-bold text-slate-900">Program Not Found</h2>
          <p className="text-sm text-slate-500 mt-1 mb-6">The requested program code or ID does not exist in the platform system.</p>
          <Link to="/programs">
            <Button variant="primary">Back to Programs</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const stages = ['REGISTERED', 'ATTENDED', 'PARTICIPATED', 'COMPLETED'];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Header />

      <main className="flex-1 py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Breadcrumb Back Link */}
        <Link to="/programs" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Programs Catalog
        </Link>

        {/* Hero Header Card */}
        <Card variant="solid" className="p-6 sm:p-8 border-indigo-100 bg-gradient-to-r from-white via-indigo-50/30 to-white mb-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-md border border-indigo-200">
                {program.programCode}
              </span>
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-md">
                {program.category}
              </span>
            </div>
            <StatusBadge status={program.status} />
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">{program.name}</h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">{program.description}</p>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info Columns */}
          <div className="lg:col-span-2 space-y-8">
            {/* Program Pipeline Lifecycle Funnel */}
            <Card variant="solid" className="p-6">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Program Participation Lifecycle Pipeline</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {stages.map((st, idx) => (
                  <div key={st} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
                    <div className="text-[10px] font-mono text-slate-400 mb-1">Step 0{idx + 1}</div>
                    <div className="text-xs font-bold text-indigo-600">{st}</div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Specifications & Location Details */}
            <Card variant="solid" className="p-6 space-y-6">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Program Specifications</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Date & Time</span>
                  <div className="flex items-center gap-2 text-slate-800 font-medium">
                    <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{new Date(program.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 text-xs pl-6">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{program.startTime} - {program.endTime}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Location & Address</span>
                  <div className="flex items-start gap-2 text-slate-800 font-medium">
                    <MapPin className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block text-slate-900">{program.location}</span>
                      <span className="text-xs text-slate-500">{program.address}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Target Audience</span>
                  <p className="text-slate-800 font-medium">{program.targetAudience}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Area of Interest</span>
                  <p className="text-slate-800 font-medium">{program.areaOfInterest}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar Registration CTA */}
          <div className="space-y-6">
            <Card variant="solid" className="p-6 space-y-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Registration Summary</h3>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5 font-medium">
                    <span>Participant Capacity</span>
                    <span className="font-bold text-slate-900">{program.currentParticipants} / {program.maxParticipants}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full"
                      style={{ width: `${Math.min((program.currentParticipants / program.maxParticipants) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5 font-medium">
                    <span>Volunteer Openings</span>
                    <span className="font-bold text-slate-900">{program.currentVolunteers} / {program.volunteerRequirement}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full"
                      style={{ width: `${Math.min((program.currentVolunteers / program.volunteerRequirement) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100">
                <Link to={`/programs/${program.id}/register?type=PARTICIPANT`} className="block">
                  <Button variant="primary" className="w-full justify-center">
                    Register as Participant
                  </Button>
                </Link>

                <Link to={`/programs/${program.id}/register?type=VOLUNTEER`} className="block">
                  <Button variant="emerald" className="w-full justify-center">
                    Register as Volunteer
                  </Button>
                </Link>
              </div>

              <div className="pt-4 border-t border-slate-100 text-center">
                <button className="text-xs text-slate-500 hover:text-slate-900 inline-flex items-center gap-1.5 transition-colors cursor-pointer">
                  <Share2 className="w-3.5 h-3.5" /> Share this program
                </button>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
