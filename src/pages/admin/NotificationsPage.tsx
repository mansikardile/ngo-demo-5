import React, { useState } from 'react';
import { Bell, CheckCircle2, Trash2 } from 'lucide-react';
import { ApplicationShell } from '../../components/layout/ApplicationShell';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { mockNotifications } from '../../mock/notifications';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState(mockNotifications);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClear = () => {
    setNotifications([]);
  };

  return (
    <ApplicationShell>
      <PageHeader
        title="Notification Center"
        subtitle="System alerts, registration notifications, and volunteer milestones."
        action={
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={handleMarkAllRead} leftIcon={<CheckCircle2 className="w-4 h-4" />}>
              Mark All as Read
            </Button>
            <Button variant="danger" size="sm" onClick={handleClear} leftIcon={<Trash2 className="w-4 h-4" />}>
              Clear Inbox
            </Button>
          </div>
        }
      />

      <Card variant="solid" className="p-6 space-y-4 shadow-sm">
        {notifications.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-8 font-medium">Notification inbox is clear.</p>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-xl border flex items-start gap-4 transition-colors ${
                n.read ? 'bg-slate-50/80 border-slate-200/80 text-slate-600' : 'bg-indigo-50/60 border-indigo-200 text-slate-900 font-semibold shadow-xs'
              }`}
            >
              <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700 shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900">{n.title}</h4>
                  <span className="text-[10px] font-mono text-slate-400 font-medium">{n.createdAt}</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">{n.message}</p>
              </div>
            </div>
          ))
        )}
      </Card>
    </ApplicationShell>
  );
};
