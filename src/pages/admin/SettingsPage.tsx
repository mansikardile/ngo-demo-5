import React from 'react';
import { User, Building, Bell, Shield, Save } from 'lucide-react';
import { ApplicationShell } from '../../components/layout/ApplicationShell';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Tabs } from '../../components/ui/Tabs';
import { useAuth } from '../../context/AuthContext';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = React.useState('account');

  const tabs = [
    { id: 'account', label: 'Account Profile' },
    { id: 'organization', label: 'Organization' },
    { id: 'notifications', label: 'Notification Settings' },
    { id: 'security', label: 'Security & Access' },
  ];

  return (
    <ApplicationShell>
      <PageHeader
        title="Settings & Platform Preferences"
        subtitle="Manage staff credentials, default locations, and security policies."
      />

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="mb-6" />

      {activeTab === 'account' && (
        <Card variant="solid" className="p-6 max-w-3xl space-y-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">User Profile Settings</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input label="Full Name" defaultValue={user?.name} />
            <Input label="Email Address" defaultValue={user?.email} />
            <Input label="Phone Number" defaultValue={user?.phone} />
            <Input label="City Location" defaultValue={user?.location} />
          </div>
          <Button variant="primary" leftIcon={<Save className="w-4 h-4" />}>
            Save Profile Changes
          </Button>
        </Card>
      )}

      {activeTab === 'organization' && (
        <Card variant="solid" className="p-6 max-w-3xl space-y-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">NGO Organization Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input label="Organization Name" defaultValue="Community Impact Network India" />
            <Input label="Default City Hub" defaultValue="Pune, Maharashtra" />
            <Input label="Registration Code" defaultValue="NGO-MH-2024-889" />
            <Input label="Support Email" defaultValue="contact@communityimpact.org" />
          </div>
          <Button variant="primary" leftIcon={<Save className="w-4 h-4" />}>
            Update Organization Specs
          </Button>
        </Card>
      )}

      {activeTab === 'notifications' && (
        <Card variant="solid" className="p-6 max-w-3xl space-y-4 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Notification Preferences</h3>
          <div className="space-y-3 text-xs text-slate-700 font-medium">
            <label className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
              <div>
                <div className="font-bold text-slate-900">Email Alerts on New Registrations</div>
                <div className="text-slate-500">Receive instant notification when participants register.</div>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
              <div>
                <div className="font-bold text-slate-900">Volunteer Hours Milestone Alerts</div>
                <div className="text-slate-500">Notify when volunteers exceed 50+ hours.</div>
              </div>
            </label>
          </div>
        </Card>
      )}

      {activeTab === 'security' && (
        <Card variant="solid" className="p-6 max-w-3xl space-y-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Security & Password</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input label="Current Password" type="password" placeholder="••••••••" />
            <Input label="New Password" type="password" placeholder="••••••••" />
          </div>
          <Button variant="primary" leftIcon={<Shield className="w-4 h-4" />}>
            Update Security Credentials
          </Button>
        </Card>
      )}
    </ApplicationShell>
  );
};
