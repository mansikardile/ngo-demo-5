import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, CheckCircle2, Clock, Calendar, MapPin, Award } from 'lucide-react';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { participantService } from '../../services/participantService';
import { Participant } from '../../types';

export const TrackingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialId = searchParams.get('id') || 'CPR-PAR-2EC3287E';

  const [inputTrackingId, setInputTrackingId] = useState(initialId);
  const [record, setRecord] = useState<Participant | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialId) handleSearch(initialId);
  }, []);

  const handleSearch = async (queryId?: string) => {
    const idToSearch = (queryId || inputTrackingId).trim();
    if (!idToSearch) return;

    setLoading(true);
    setSearched(true);
    const res = await participantService.getParticipantByTrackingId(idToSearch);

    if (res.success && res.data) {
      setRecord(res.data);
    } else {
      setRecord(null);
    }
    setLoading(false);
  };

  const stages: { key: string; label: string; dateField?: string }[] = [
    { key: 'REGISTERED', label: 'Registered', dateField: 'registeredDate' },
    { key: 'ATTENDED', label: 'Attended', dateField: 'attendanceDate' },
    { key: 'PARTICIPATED', label: 'Participated', dateField: 'participationDate' },
    { key: 'COMPLETED', label: 'Completed', dateField: 'completionDate' },
  ];

  const getStageStatus = (stageKey: string) => {
    if (!record) return 'upcoming';
    const order = ['REGISTERED', 'ATTENDED', 'PARTICIPATED', 'COMPLETED'];
    const currentIdx = order.indexOf(record.status);
    const stageIdx = order.indexOf(stageKey);

    if (stageIdx <= currentIdx) return 'completed';
    return 'upcoming';
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Header />

      <main className="flex-1 py-12 max-w-4xl mx-auto px-4 sm:px-6 w-full">
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest block mb-2">Live Verification</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Participation Tracking Portal</h1>
          <p className="text-sm text-slate-600 mt-2 font-medium">Enter your unique tracking code to view your verified milestone progress.</p>
        </div>

        {/* Search Bar */}
        <Card variant="solid" className="p-6 mb-10 max-w-2xl mx-auto shadow-sm">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Input
              placeholder="e.g. CPR-PAR-2EC3287E"
              value={inputTrackingId}
              onChange={(e) => setInputTrackingId(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-slate-400" />}
              className="flex-1"
            />
            <Button type="submit" variant="primary" isLoading={loading} leftIcon={<Search className="w-4 h-4" />}>
              Verify Status
            </Button>
          </form>
        </Card>

        {/* Results */}
        {searched && !record && !loading && (
          <EmptyState
            title="Tracking Record Not Found"
            description={`No participant or volunteer record matched '${inputTrackingId}'. Please double-check the tracking ID formatting.`}
          />
        )}

        {record && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Record Overview Header */}
            <Card variant="solid" className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
                <div>
                  <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded border border-indigo-200">
                    {record.trackingId}
                  </span>
                  <h2 className="text-xl font-extrabold text-slate-900 mt-2">{record.name}</h2>
                  <p className="text-xs text-slate-500 font-medium">{record.collegeOrOrganization} — {record.location}</p>
                </div>
                <StatusBadge status={record.status} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-600" />
                  <span>Program: <strong className="text-slate-900">{record.programName}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>Type: <strong className="text-slate-900">{record.registrationType}</strong></span>
                </div>
              </div>
            </Card>

            {/* Interactive Timeline Progress */}
            <Card variant="solid" className="p-6">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-8">Participation Progress Pipeline</h3>

              <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-0">
                {/* Connecting Bar */}
                <div className="hidden sm:block absolute top-5 left-10 right-10 h-1 bg-slate-200 -z-0">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500 rounded-full"
                    style={{
                      width:
                        record.status === 'REGISTERED'
                          ? '25%'
                          : record.status === 'ATTENDED'
                          ? '50%'
                          : record.status === 'PARTICIPATED'
                          ? '75%'
                          : '100%',
                    }}
                  />
                </div>

                {stages.map((st) => {
                  const state = getStageStatus(st.key);
                  const isDone = state === 'completed';
                  const dateVal = (record as any)[st.dateField || ''];

                  return (
                    <div key={st.key} className="relative z-10 flex flex-col items-center text-center w-full sm:w-1/4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                          isDone
                            ? 'bg-emerald-500 text-white border-emerald-500 font-bold shadow-md shadow-emerald-500/20'
                            : 'bg-white text-slate-400 border-slate-200'
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-4 h-4" />}
                      </div>

                      <div className="mt-3">
                        <span className={`text-xs font-bold block ${isDone ? 'text-slate-900' : 'text-slate-400'}`}>
                          {st.label}
                        </span>
                        {dateVal && (
                          <span className="text-[10px] text-slate-500 font-mono block mt-0.5 font-medium">
                            {new Date(dateVal).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
