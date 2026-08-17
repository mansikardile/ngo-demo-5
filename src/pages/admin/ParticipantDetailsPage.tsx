import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, MapPin, Award, CheckCircle2, Clock } from 'lucide-react';
import { ApplicationShell } from '../../components/layout/ApplicationShell';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { participantService } from '../../services/participantService';
import { Participant, RegistrationStatus } from '../../types';

export const ParticipantDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchParticipant();
  }, [id]);

  const fetchParticipant = async () => {
    setLoading(true);
    const res = await participantService.getParticipants({ limit: 50 });
    if (res.success) {
      const match = res.data.find((p) => p.id === id || p.trackingId === id);
      setParticipant(match || null);
    }
    setLoading(false);
  };

  const handleUpdateStatus = async (newStatus: RegistrationStatus) => {
    if (!participant) return;
    const res = await participantService.updateParticipationStatus(participant.id, newStatus);
    if (res.success && res.data) {
      setParticipant(res.data);
    }
  };

  if (!participant) {
    return (
      <ApplicationShell>
        <div className="text-center py-12">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Participant Record Not Found</h2>
          <Button variant="primary" onClick={() => navigate('/admin/participants')}>Back to CRM</Button>
        </div>
      </ApplicationShell>
    );
  }

  const stages: { key: RegistrationStatus; label: string; date?: string }[] = [
    { key: 'REGISTERED', label: 'Registered', date: participant.registeredDate },
    { key: 'ATTENDED', label: 'Attended', date: participant.attendanceDate },
    { key: 'PARTICIPATED', label: 'Participated', date: participant.participationDate },
    { key: 'COMPLETED', label: 'Completed', date: participant.completionDate },
  ];

  return (
    <ApplicationShell>
      <button
        onClick={() => navigate('/admin/participants')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-4 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Participants CRM
      </button>

      <PageHeader
        title={participant.name}
        subtitle={`Tracking ID: ${participant.trackingId} • ${participant.registrationType}`}
        action={<StatusBadge status={participant.status} />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card variant="solid" className="p-6 space-y-4 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Personal & Academic Details</h3>
            <div className="grid grid-cols-2 gap-4 text-xs text-slate-600">
              <div>
                <span className="text-slate-400 font-semibold uppercase block mb-1">Email Address</span>
                <p className="font-bold text-slate-900">{participant.email}</p>
              </div>
              <div>
                <span className="text-slate-400 font-semibold uppercase block mb-1">Phone Number</span>
                <p className="font-bold text-slate-900">{participant.phone}</p>
              </div>
              <div>
                <span className="text-slate-400 font-semibold uppercase block mb-1">College / Organization</span>
                <p className="font-bold text-slate-900">{participant.collegeOrOrganization}</p>
              </div>
              <div>
                <span className="text-slate-400 font-semibold uppercase block mb-1">Location & Age</span>
                <p className="font-bold text-slate-900">{participant.location} ({participant.ageOrYear})</p>
              </div>
            </div>
          </Card>

          {/* Timeline */}
          <Card variant="solid" className="p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-6">Participation Milestone Progress</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              {stages.map((st) => {
                const isCurrent = participant.status === st.key;
                return (
                  <div key={st.key} className={`p-4 rounded-xl border ${isCurrent ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-xs' : 'bg-slate-50 border-slate-200/80 text-slate-500'}`}>
                    <div className="text-xs font-bold uppercase">{st.label}</div>
                    {st.date && <div className="text-[10px] font-mono mt-1">{new Date(st.date).toLocaleDateString()}</div>}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card variant="solid" className="p-6 space-y-4 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Update Status Action</h3>
            <p className="text-xs text-slate-500">Update status in-memory for Phase 1 demonstration:</p>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => handleUpdateStatus('ATTENDED')}>
                Mark ATTENDED
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => handleUpdateStatus('PARTICIPATED')}>
                Mark PARTICIPATED
              </Button>
              <Button variant="emerald" size="sm" className="w-full justify-start" onClick={() => handleUpdateStatus('COMPLETED')}>
                Mark COMPLETED
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </ApplicationShell>
  );
};
