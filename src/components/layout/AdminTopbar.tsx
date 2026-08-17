import React, { useState } from 'react';
import { Search, Bell, Shield, ChevronDown, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { mockNotifications } from '../../mock/notifications';

export interface AdminTopbarProps {
  onToggleMobileSidebar: () => void;
}

export const AdminTopbar: React.FC<AdminTopbarProps> = ({ onToggleMobileSidebar }) => {
  const { user, role, setRole } = useAuth();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const roles: { key: UserRole; label: string; desc: string }[] = [
    { key: 'ADMIN', label: 'Admin Role', desc: 'Full System Access & Analytics' },
    { key: 'STAFF', label: 'Staff Role', desc: 'Program & CRM Operations' },
    { key: 'COORDINATOR', label: 'Coordinator Role', desc: 'Attendance & Tracking Actions' },
  ];

  return (
    <header className="sticky top-0 z-20 h-18 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between shadow-xs">
      {/* Global Search Bar */}
      <div className="relative w-64 sm:w-80">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search programs, participants, tracking IDs..."
          className="w-full bg-slate-100/80 text-xs text-slate-900 placeholder-slate-400 rounded-xl pl-9 pr-4 py-2 border border-slate-200/80 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
        />
      </div>

      {/* Right Controls & Role Switcher */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Prototype Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200/80 text-indigo-700 hover:bg-indigo-100/80 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5 text-indigo-600" />
            <span>{role} Role</span>
            <ChevronDown className="w-3.5 h-3.5 text-indigo-500" />
          </button>

          {roleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Switch Prototype Role</span>
                <span className="text-[11px] text-slate-500 block leading-tight mt-0.5">
                  Frontend UX view only. True authorization enforced by backend in Phase 2.
                </span>
              </div>
              {roles.map((r) => (
                <button
                  key={r.key}
                  onClick={() => {
                    setRole(r.key);
                    setRoleDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    role === r.key ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="font-medium">{r.label}</div>
                    <div className="text-[10px] text-slate-400">{r.desc}</div>
                  </div>
                  {role === r.key && <Check className="w-4 h-4 text-indigo-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Icon & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
          </button>

          {notifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-50">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900">Notifications</span>
                <span className="text-[10px] text-indigo-600 font-semibold cursor-pointer">Mark all as read</span>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {mockNotifications.map((n) => (
                  <div key={n.id} className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors text-xs">
                    <div className="font-semibold text-slate-800">{n.title}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">{n.message}</div>
                    <div className="text-[10px] text-slate-400 mt-1 font-mono">{n.createdAt}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        {user && (
          <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
            <img
              src={user.avatarUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'}
              alt={user.name}
              className="w-8.5 h-8.5 rounded-full border border-indigo-200 object-cover shadow-xs"
            />
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-slate-900 leading-tight">{user.name}</div>
              <div className="text-[10px] text-slate-400 font-semibold leading-none">{role}</div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
