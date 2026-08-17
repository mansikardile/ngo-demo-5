import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HeartHandshake, Menu, X, Shield, Search } from 'lucide-react';
import { Button } from '../ui/Button';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Programs', path: '/programs' },
    { name: 'Track Status', path: '/tracking' },
    { name: 'Volunteer Impact', path: '/profile' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-slate-900 block leading-tight">ImpactPulse</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 block">Community & Volunteer NGO</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors ${
                    isActive ? 'text-indigo-600 font-semibold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/tracking">
              <Button variant="outline" size="sm" leftIcon={<Search className="w-4 h-4 text-indigo-600" />}>
                Tracking ID
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="primary" size="sm" leftIcon={<Shield className="w-4 h-4" />}>
                Portal Sign In
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 py-6 space-y-4 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 text-base font-medium ${
                  location.pathname === link.path ? 'text-indigo-600 font-bold' : 'text-slate-700'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            <Link to="/tracking" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full justify-start" leftIcon={<Search className="w-4 h-4 text-indigo-600" />}>
                Track Participation Status
              </Button>
            </Link>
            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" className="w-full justify-start" leftIcon={<Shield className="w-4 h-4" />}>
                Portal Sign In
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
