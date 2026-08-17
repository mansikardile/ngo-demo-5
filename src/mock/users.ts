import { User } from '../types';

export const mockUsers: User[] = [
  {
    id: 'usr-001-admin',
    name: 'Sarah Jenkins',
    email: 'sarah.admin@communityimpact.org',
    role: 'ADMIN',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    phone: '+91 98765 43210',
    location: 'Pune, Maharashtra',
    organization: 'Community Impact Network',
  },
  {
    id: 'usr-002-staff',
    name: 'Rajesh Sharma',
    email: 'rajesh.staff@communityimpact.org',
    role: 'STAFF',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    phone: '+91 98765 43211',
    location: 'Mumbai, Maharashtra',
    organization: 'Community Impact Network',
  },
  {
    id: 'usr-003-coordinator',
    name: 'Priya Verma',
    email: 'priya.coord@communityimpact.org',
    role: 'COORDINATOR',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    phone: '+91 98765 43212',
    location: 'Pune, Maharashtra',
    organization: 'Community Impact Network',
  },
];
