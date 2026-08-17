import React, { useState, useEffect } from 'react';
import { CheckSquare, Search, CheckCircle2 } from 'lucide-react';
import { ApplicationShell } from '../../components/layout/ApplicationShell';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { participantService } from '../../services/participantService';
import { Participant, RegistrationStatus } from '../../types';

export const ParticipationTrackingPage: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [search, setSearch] = useState('');
  const [selectedPt, setSelectedPt] = useState<Participant | null>(null);
  const [targetStatus, setTargetStatus] = useState<RegistrationStatus | null>(null);

  useEffect(() => {
    fetchParticipants();
  }, [search]);

  const fetchParticipants = async () => {
    const res = await participantService.getParticipants({ search, limit: 50 });
    if (res.success) setParticipants(res.data);
  };

  const handleExecuteStatusUpdate = async () => {
    if (!selectedPt || !targetStatus) return;
    await participantService.updateParticipationStatus(selectedPt.id, targetStatus);
    setSelectedPt(null);
    setTargetStatus(null);
    fetchParticipants();
  };

  return (
    <ApplicationShell>
      <PageHeader
        title="Coordinator Participation Actions"
        subtitle="On-ground coordinator portal for recording live attendance, participation, and completion states."
      />

      <Card variant="solid" className="p-4 mb-6 shadow-xs">
        <Input
          placeholder="Search by participant name, tracking code (e.g. CPR-PAR-2EC3287E)..."
          leftIcon={<Search className="w-4 h-4 text-slate-400" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Card>

      <Card variant="solid" className="overflow-hidden p-0 shadow-xs border-slate-200/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Tracking ID</th>
                <th className="py-3.5 px-4">Participant</th>
                <th className="py-3.5 px-4">Program</th>
                <th className="py-3.5 px-4">Current Status</th>
                <th className="py-3.5 px-4 text-right">Coordinator Actions</th>
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
                  <td className="py-3.5 px-4 max-w-xs truncate font-medium">{pt.programName}</td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={pt.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedPt(pt);
                        setTargetStatus('ATTENDED');
                      }}
                    >
                      Mark Attended
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedPt(pt);
                        setTargetStatus('PARTICIPATED');
                      }}
                    >
                      Mark Participated
                    </Button>
                    <Button
                      variant="emerald"
                      size="sm"
                      onClick={() => {
                        setSelectedPt(pt);
                        setTargetStatus('COMPLETED');
                      }}
                    >
                      Mark Completed
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <ConfirmModal
        isOpen={!!selectedPt && !!targetStatus}
        onClose={() => {
          setSelectedPt(null);
          setTargetStatus(null);
        }}
        onConfirm={handleExecuteStatusUpdate}
        title={`Update Status to ${targetStatus}`}
        description={`Confirm updating ${selectedPt?.name}'s status to '${targetStatus}' for ${selectedPt?.programName}?`}
        variant="emerald"
        confirmLabel="Confirm Status Transition"
      />
    </ApplicationShell>
  );
};
