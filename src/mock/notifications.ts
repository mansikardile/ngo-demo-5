import { Notification } from '../types';

export const mockNotifications: Notification[] = [
  {
    id: 'notif-001',
    title: 'New Volunteer Registration',
    message: 'Ananya Deshmukh registered for Mula-Mutha Clean River & Eco Campaign.',
    type: 'REGISTRATION',
    read: false,
    createdAt: '10 minutes ago',
  },
  {
    id: 'notif-002',
    title: 'Program Threshold Reached',
    message: 'Community STEM Workshop reached 85% participant capacity.',
    type: 'PROGRAM',
    read: false,
    createdAt: '1 hour ago',
  },
  {
    id: 'notif-003',
    title: 'Volunteer Hours Milestones',
    message: 'Kabir Mehta logged over 100 volunteer contribution hours!',
    type: 'VOLUNTEER',
    read: true,
    createdAt: '3 hours ago',
  },
  {
    id: 'notif-004',
    title: 'Program Status Update',
    message: 'Rural Youth Mental Health Drive marked as COMPLETED.',
    type: 'SYSTEM',
    read: true,
    createdAt: 'Yesterday',
  },
];
