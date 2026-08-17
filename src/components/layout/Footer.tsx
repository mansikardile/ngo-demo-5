import React from 'react';
import { Link } from 'react-router-dom';
import { HeartHandshake, Globe, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-sm">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-slate-900">ImpactPulse</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-500">
              Empowering grassroots communities through transparent program execution, volunteer tracking, and verified real-time impact measurement.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Navigation</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link></li>
              <li><Link to="/programs" className="hover:text-indigo-600 transition-colors">Browse Programs</Link></li>
              <li><Link to="/tracking" className="hover:text-indigo-600 transition-colors">Track Participation</Link></li>
              <li><Link to="/profile" className="hover:text-indigo-600 transition-colors">Volunteer Impact Profile</Link></li>
              <li><Link to="/login" className="hover:text-indigo-600 transition-colors">Internal Staff Portal</Link></li>
            </ul>
          </div>

          {/* Program Categories */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Focus Areas</h4>
            <ul className="space-y-2.5 text-xs">
              <li><span className="hover:text-indigo-600 cursor-pointer">STEM & Digital Literacy</span></li>
              <li><span className="hover:text-indigo-600 cursor-pointer">Environment & Sustainability</span></li>
              <li><span className="hover:text-indigo-600 cursor-pointer">Healthcare & Wellness Drive</span></li>
              <li><span className="hover:text-indigo-600 cursor-pointer">Vocational Skill Development</span></li>
              <li><span className="hover:text-indigo-600 cursor-pointer">Urban & Rural Agriculture</span></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Headquarters</h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span>Sector 4, Kothrud, Pune, Maharashtra 411038</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>contact@communityimpact.org</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>+91 20 2543 8900</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>www.communityimpact.org</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 Community Program & Volunteer Impact Tracking System. Shared Contract Compliance Enabled.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-600 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-600 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-600 cursor-pointer">Impact Transparency Report</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
