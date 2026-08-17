import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Award, Clock, Plus } from 'lucide-react';
import { ApplicationShell } from '../../components/layout/ApplicationShell';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { StatusBadge } from '../../components/common/StatusBadge';
import { volunteerService } from '../../services/volunteerService';
import { Volunteer } from '../../types';

export const VolunteerDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [volunteer, setVolunteer] = useState<Volunteer | null>(null);
  const [hoursToLog, setHoursToLog] = useState(4);
  const [programName, setProgramName] = useState('STEM Robotics Drive');

  useEffect(() => {
    if (id) fetchVolunteer();
  }, [id]);

  const fetchVolunteer = async () => {
    const res = await volunteerService.getVolunteerById(id!);
    if (res.success) setVolunteer(res.data);
  };

  const handleLogHours = async () => {
    if (!volunteer) return;
    const res = await volunteerService.logHours(volunteer.id, hoursToLog, programName, 'Field Volunteer');
    if (res.success) setVolunteer(res.data);
  };

  if (!volunteer) {
    return (
      <ApplicationShell>
        <div className="text-center py-12">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Volunteer Record Not Found</h2>
          <Button variant="primary" onClick={() => navigate('/admin/volunteers')}>Back to Directory</Button>
        </div>
      </ApplicationShell>
    );
  }

  return (
    <ApplicationShell>
      <button
        onClick={() => navigate('/admin/volunteers')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-4 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Volunteers Directory
      </button>

      <PageHeader
        title={volunteer.name}
        subtitle={`Volunteer ID: ${volunteer.volunteerId} • ${volunteer.location}`}
        action={<StatusBadge status={volunteer.status} />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card variant="solid" className="p-6 space-y-4 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Assigned Programs & History</h3>
            <div className="space-y-3">
              {volunteer.assignedPrograms.map((ap, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900">{ap.programName}</h4>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">Role: {ap.role}</p>
                  </div>
                  <div className="font-mono font-bold text-indigo-700 text-sm">{ap.hoursLogged} hrs</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card variant="solid" className="p-6 space-y-4 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Log Impact Hours</h3>
            <Input label="Hours to Log" type="number" value={hoursToLog} onChange={(e) => setHoursToLog(Number(e.target.value))} />
            <Input label="Program Name" value={programName} onChange={(e) => setProgramName(e.target.value)} />
            <Button variant="emerald" className="w-full justify-center" onClick={handleLogHours} leftIcon={<Plus className="w-4 h-4" />}>
              Add Logged Hours
            </Button>
          </Card>
        </div>
      </div>
    </ApplicationShell>
  );
};
