import React, { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopbar } from './AdminTopbar';

export interface ApplicationShellProps {
  children: React.ReactNode;
}

export const ApplicationShell: React.FC<ApplicationShellProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Sidebar */}
      <AdminSidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <AdminTopbar onToggleMobileSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
};
