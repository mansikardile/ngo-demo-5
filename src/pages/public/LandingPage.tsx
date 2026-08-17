import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Users,
  Award,
  Calendar,
  CheckCircle2,
  TrendingUp,
  MapPin,
  HeartHandshake,
} from 'lucide-react';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { mockPrograms } from '../../mock/programs';
import { StatusBadge } from '../../components/common/StatusBadge';

export const LandingPage: React.FC = () => {
  const featuredPrograms = mockPrograms.slice(0, 3);

  const stats = [
    { label: 'Community Programs', value: '24+', icon: Calendar, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Participants Reached', value: '1,840+', icon: Users, color: 'text-sky-600', bg: 'bg-sky-50' },
    { label: 'Volunteers Engaged', value: '312+', icon: Award, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Impact Hours Logged', value: '3,450+', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const steps = [
    {
      num: '01',
      title: 'Explore Programs',
      desc: 'Browse verified grassroots STEM, environment, health, and vocational initiatives across cities.',
    },
    {
      num: '02',
      title: 'Register as Participant or Volunteer',
      desc: 'Sign up in under 60 seconds with frontend validated input to receive your unique tracking code.',
    },
    {
      num: '03',
      title: 'Track Participation Pipeline',
      desc: 'Follow your live journey from REGISTERED → ATTENDED → PARTICIPATED → COMPLETED.',
    },
    {
      num: '04',
      title: 'Log Verified Impact',
      desc: 'Earn volunteer hours and verified milestone records transparently tracked in our system.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden bg-gradient-to-b from-indigo-50/60 via-purple-50/30 to-slate-50 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-8 shadow-xs">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            Empowering Grassroots Impact Across India
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto mb-6">
            Turn Community Participation Into <span className="gradient-text">Measurable Impact</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Manage community programs, engage volunteers, track participation, and measure real social impact in one comprehensive platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/programs">
              <Button variant="primary" size="lg" className="w-full sm:w-auto" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Explore Programs
              </Button>
            </Link>
            <Link to="/programs?type=volunteer">
              <Button variant="outline" size="lg" className="w-full sm:w-auto" leftIcon={<HeartHandshake className="w-5 h-5 text-indigo-600" />}>
                Become a Volunteer
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Impact Stats Grid */}
      <section className="py-12 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-center">
                  <div className={`inline-flex p-3 rounded-2xl ${s.bg} ${s.color} mb-3`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">{s.value}</div>
                  <div className="text-xs text-slate-500 font-bold mt-1 uppercase tracking-wider">{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Programs Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest block mb-2">Active Initiatives</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Featured Community Programs</h2>
          </div>
          <Link to="/programs" className="mt-4 md:mt-0 text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5">
            View All Programs <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredPrograms.map((p) => (
            <Card key={p.id} variant="interactive" className="flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
                    {p.programCode}
                  </span>
                  <StatusBadge status={p.status} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">{p.name}</h3>
                <p className="text-xs text-slate-600 line-clamp-3 mb-6 leading-relaxed">{p.description}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span className="truncate">{p.location} — {p.address}</span>
                </div>
                <div className="flex items-center justify-between text-xs pt-2">
                  <span className="text-slate-600 font-semibold">{p.currentParticipants} Registered</span>
                  <Link to={`/programs/${p.id}`}>
                    <Button variant="outline" size="sm">
                      Details & Register
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works Timeline */}
      <section className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest block mb-2">Simplicity & Transparency</span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-16">How The Platform Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
            {steps.map((st) => (
              <div key={st.num} className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 relative">
                <span className="text-3xl font-extrabold font-mono text-indigo-600/30 block mb-4">{st.num}</span>
                <h3 className="text-base font-bold text-slate-900 mb-2">{st.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-purple-600 uppercase tracking-widest block mb-2">Community Stories</span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Voices of Impact</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card variant="solid" className="p-8">
            <p className="text-sm text-slate-600 italic mb-6 leading-relaxed">
              "Being able to enter my unique tracking ID and see my participation status update from Registered to Completed gave me total confidence in how our volunteer hours were documented."
            </p>
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"
                alt="Meera"
                className="w-10 h-10 rounded-full border border-indigo-200 object-cover"
              />
              <div>
                <h4 className="text-sm font-bold text-slate-900">Meera Iyer</h4>
                <p className="text-xs text-slate-500">STEM Workshop Volunteer, Pune</p>
              </div>
            </div>
          </Card>

          <Card variant="solid" className="p-8">
            <p className="text-sm text-slate-600 italic mb-6 leading-relaxed">
              "The platform’s real-time funnel chart and coordinator participation marking allowed our NGO team to streamline on-ground event attendance effortlessly."
            </p>
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120"
                alt="Rajesh"
                className="w-10 h-10 rounded-full border border-indigo-200 object-cover"
              />
              <div>
                <h4 className="text-sm font-bold text-slate-900">Rajesh Sharma</h4>
                <p className="text-xs text-slate-500">Program Coordinator, Mumbai Drive</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">Ready to Make a Verified Difference?</h2>
          <p className="text-indigo-100 text-sm max-w-xl mx-auto mb-8 font-medium">
            Explore our active community initiatives or log into the staff management portal to oversee program operations.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/programs">
              <Button variant="emerald" size="lg">Join an Initiative</Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg">Staff Sign In</Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
