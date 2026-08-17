import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Award,
  ClipboardList,
  CheckSquare,
  BarChart3,
  FileText,
  Bell,
  Settings,
  HeartHandshake,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export interface AdminSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ collapsed, onToggleCollapse }) => {
  const location = useLocation();
  const { user, role, logout } = useAuth();

  const navigationItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'STAFF', 'COORDINATOR'] },
    { name: 'Programs', path: '/admin/programs', icon: Calendar, roles: ['ADMIN', 'STAFF', 'COORDINATOR'] },
    { name: 'Participants', path: '/admin/participants', icon: Users, roles: ['ADMIN', 'STAFF', 'COORDINATOR'] },
    { name: 'Volunteers', path: '/admin/volunteers', icon: Award, roles: ['ADMIN', 'STAFF', 'COORDINATOR'] },
    { name: 'Registrations', path: '/admin/registrations', icon: ClipboardList, roles: ['ADMIN', 'STAFF'] },
    { name: 'Participation Tracking', path: '/admin/participation', icon: CheckSquare, roles: ['ADMIN', 'COORDINATOR'] },
    { name: 'Analytics & Impact', path: '/admin/analytics', icon: BarChart3, roles: ['ADMIN', 'STAFF'] },
    { name: 'Reports', path: '/admin/reports', icon: FileText, roles: ['ADMIN', 'STAFF'] },
  ];

  const secondaryItems = [
    { name: 'Notifications', path: '/admin/notifications', icon: Bell },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const filteredNav = navigationItems.filter((item) => item.roles.includes(role));

  return (
    <aside
      className={`fixed top-0 left-0 z-30 h-screen bg-white border-r border-slate-200/80 transition-all duration-300 flex flex-col justify-between shadow-xs ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div>
        {/* Sidebar Header */}
        <div className="h-18 px-4 flex items-center justify-between border-b border-slate-100">
          <Link to="/admin/dashboard" className="flex items-center gap-3 overflow-hidden">
            <div className="p-2.5 rounded-xl bg-indigo-600 text-white shrink-0 shadow-sm">
              <HeartHandshake className="w-5 h-5" />
            </div>
            {!collapsed && (
              <div className="truncate">
                <span className="text-sm font-extrabold text-slate-900 block leading-tight">ImpactPortal</span>
                <span className="text-[10px] text-indigo-600 font-bold tracking-wider block uppercase">NGO Management</span>
              </div>
            )}
          </Link>
          <button
            onClick={onToggleCollapse}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors hidden lg:block"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Main Nav Links */}
        <div className="px-3 py-4 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]">
          <div className={`px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider ${collapsed ? 'hidden' : 'block'}`}>
            Main Management
          </div>
          {filteredNav.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
            return (
              <Link
                key={item.path}
                to={item.path}
                title={collapsed ? item.name : undefined}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 font-semibold border border-indigo-100/60 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                {!collapsed && <span className="truncate">{item.name}</span>}
              </Link>
            );
          })}

          <div className={`pt-4 px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider ${collapsed ? 'hidden' : 'block'}`}>
            Preferences
          </div>
          {secondaryItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                title={collapsed ? item.name : undefined}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 font-semibold border border-indigo-100/60 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                {!collapsed && <span className="truncate">{item.name}</span>}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Sidebar Footer User Info */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between gap-2">
          {!collapsed && user && (
            <div className="flex items-center gap-2.5 overflow-hidden">
              <img
                src={user.avatarUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'}
                alt={user.name}
                className="w-8 h-8 rounded-full border border-indigo-200 object-cover shrink-0"
              />
              <div className="truncate">
                <p className="text-xs font-semibold text-slate-800 truncate">{user.name}</p>
                <p className="text-[10px] text-slate-400 font-mono truncate">{role}</p>
              </div>
            </div>
          )}
          <button
            onClick={logout}
            title="Log out"
            className="text-slate-400 hover:text-rose-600 p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
