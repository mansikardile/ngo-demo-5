import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HeartHandshake, Shield, Lock, Mail, ArrowRight } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { mockUsers } from '../../mock/users';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('sarah.admin@communityimpact.org');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(email, password);
      setLoading(false);
      navigate('/admin/dashboard');
    } catch (err) {
      setLoading(false);
      setError('Authentication failed. Please check credentials.');
    }
  };

  const handleQuickPreset = (presetEmail: string) => {
    setEmail(presetEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/60 via-slate-50 to-slate-50 text-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Brand Logo */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-3 group mb-2">
            <div className="p-3 rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <HeartHandshake className="w-8 h-8" />
            </div>
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Staff & Coordinator Portal</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">Community Program & Volunteer Impact Tracking System</p>
        </div>

        <Card variant="solid" className="p-6 sm:p-8 shadow-md">
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {error}
              </div>
            )}

            <Input
              label="Staff Email Address"
              type="email"
              placeholder="name@communityimpact.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
              required
            />

            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" defaultChecked />
                <span>Remember me</span>
              </label>
              <span className="hover:text-indigo-600 cursor-pointer">Forgot password?</span>
            </div>

            <Button type="submit" variant="primary" className="w-full justify-center" size="lg" isLoading={loading} rightIcon={<ArrowRight className="w-4 h-4" />}>
              Sign In to Management Portal
            </Button>
          </form>

          {/* Quick Preset Selector for Demo/Review */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
              Quick Prototype Preset Sign-In
            </span>
            <div className="grid grid-cols-3 gap-2">
              {mockUsers.map((u) => (
                <button
                  key={u.id}
                  onClick={() => handleQuickPreset(u.email)}
                  className={`p-2 rounded-xl border text-[11px] font-semibold transition-all cursor-pointer ${
                    email === u.email
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="font-bold">{u.role}</div>
                  <div className="truncate text-[10px] text-slate-400">{u.name.split(' ')[0]}</div>
                </button>
              ))}
            </div>
          </div>
        </Card>

        <div className="text-center text-xs text-slate-500 font-medium">
          <Link to="/" className="hover:text-slate-900 transition-colors">
            ← Return to Public Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};
