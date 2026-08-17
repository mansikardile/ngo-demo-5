import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { CheckCircle2, Copy, Check, Search, Calendar } from 'lucide-react';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export const RegistrationSuccessPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const state = location.state as {
    trackingId?: string;
    participantName?: string;
    programName?: string;
    registrationType?: string;
  } | null;

  const trackingId = state?.trackingId || 'CPR-PAR-2EC3287E';
  const name = state?.participantName || 'Participant';
  const programName = state?.programName || 'Community STEM Workshop';
  const type = state?.registrationType || 'PARTICIPANT';

  useEffect(() => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(trackingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Header />

      <main className="flex-1 py-16 max-w-2xl mx-auto px-4 w-full flex items-center justify-center">
        <Card variant="solid" className="p-8 text-center w-full relative overflow-hidden shadow-md">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto mb-6 flex items-center justify-center border border-emerald-200">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest block mb-1">Registration Verified</span>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Registration Successful!</h1>
          <p className="text-sm text-slate-600 max-w-md mx-auto mb-8">
            Thank you, <span className="text-slate-900 font-bold">{name}</span>. You have successfully registered as a{' '}
            <span className="text-indigo-600 font-bold">{type}</span> for <span className="text-slate-900 font-bold">{programName}</span>.
          </p>

          {/* Tracking Code Box */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 mb-8 max-w-md mx-auto text-center space-y-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Your Unique Participation Tracking ID</span>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl sm:text-3xl font-mono font-extrabold text-indigo-700 tracking-wider select-all">{trackingId}</span>
              <button
                onClick={handleCopy}
                className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer shadow-xs"
                title="Copy Tracking ID"
              >
                {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Save this tracking ID to check your attendance and milestone status at any time.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="primary"
              onClick={() => navigate(`/tracking?id=${trackingId}`)}
              leftIcon={<Search className="w-4 h-4" />}
            >
              Track Participation Status
            </Button>

            <Link to="/programs">
              <Button variant="outline" leftIcon={<Calendar className="w-4 h-4" />}>
                Explore More Programs
              </Button>
            </Link>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
};
