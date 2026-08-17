import { DashboardAnalytics } from '../types';

export const mockDashboardAnalytics: DashboardAnalytics = {
  totalPrograms: 24,
  activePrograms: 6,
  totalParticipants: 1840,
  totalVolunteers: 312,
  attendanceRate: 84.5,
  completionRate: 78.2,
  volunteerHours: 3450,
  participationTrend: [
    { month: 'Mar', registered: 220, completed: 180 },
    { month: 'Apr', registered: 310, completed: 260 },
    { month: 'May', registered: 290, completed: 240 },
    { month: 'Jun', registered: 420, completed: 350 },
    { month: 'Jul', registered: 480, completed: 390 },
    { month: 'Aug', registered: 520, completed: 420 },
  ],
  funnelData: [
    { stage: 'REGISTERED', count: 1840 },
    { stage: 'ATTENDED', count: 1555 },
    { stage: 'PARTICIPATED', count: 1438 },
    { stage: 'COMPLETED', count: 1290 },
  ],
  statusDistribution: [
    { status: 'ACTIVE', count: 6 },
    { status: 'UPCOMING', count: 10 },
    { status: 'COMPLETED', count: 7 },
    { status: 'DRAFT', count: 1 },
    { status: 'CANCELLED', count: 0 },
  ],
  categoryBreakdown: [
    { category: 'Education & Tech', count: 8 },
    { category: 'Environment', count: 6 },
    { category: 'Healthcare', count: 4 },
    { category: 'Vocational Skill', count: 4 },
    { category: 'Agriculture', count: 2 },
  ],
  locationImpact: [
    { location: 'Pune', participants: 850, volunteers: 140, hours: 1650 },
    { location: 'Mumbai', participants: 520, volunteers: 95, hours: 980 },
    { location: 'Delhi', participants: 270, volunteers: 45, hours: 490 },
    { location: 'Bangalore', participants: 200, volunteers: 32, hours: 330 },
  ],
  volunteerContributionHistory: [
    { month: 'Mar', hours: 380 },
    { month: 'Apr', hours: 490 },
    { month: 'May', hours: 540 },
    { month: 'Jun', hours: 620 },
    { month: 'Jul', hours: 710 },
    { month: 'Aug', hours: 710 },
  ],
};
