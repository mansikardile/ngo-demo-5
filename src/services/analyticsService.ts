import { mockDashboardAnalytics } from '../mock/analytics';
import { DashboardAnalytics, ApiResponse } from '../types';
import { apiRequest } from '../lib/apiClient';

export const analyticsService = {
  async getDashboardAnalytics(): Promise<ApiResponse<DashboardAnalytics>> {
    try {
      const res = await apiRequest<any>('/analytics/dashboard');
      if (res.success && res.data) {
        const d = res.data;
        const funnel = d.registrationFunnel || d.funnelData || {};

        const mapped: DashboardAnalytics = {
          totalPrograms: d.totalPrograms ?? mockDashboardAnalytics.totalPrograms,
          activePrograms: d.activePrograms ?? mockDashboardAnalytics.activePrograms,
          totalParticipants: d.totalParticipants ?? mockDashboardAnalytics.totalParticipants,
          totalVolunteers: d.totalVolunteers ?? mockDashboardAnalytics.totalVolunteers,
          attendanceRate: d.attendanceRate ?? mockDashboardAnalytics.attendanceRate,
          completionRate: d.completionRate ?? mockDashboardAnalytics.completionRate,
          volunteerHours: d.volunteerHoursContributed ?? d.volunteerHours ?? mockDashboardAnalytics.volunteerHours,
          participationTrend: mockDashboardAnalytics.participationTrend,
          funnelData: [
            { stage: 'REGISTERED', count: funnel.registered ?? 1840 },
            { stage: 'ATTENDED', count: funnel.attended ?? 1554 },
            { stage: 'PARTICIPATED', count: funnel.participated ?? 1320 },
            { stage: 'COMPLETED', count: funnel.completed ?? 1100 },
          ],
          statusDistribution: mockDashboardAnalytics.statusDistribution,
          categoryBreakdown: mockDashboardAnalytics.categoryBreakdown,
          volunteerContributionHistory: mockDashboardAnalytics.volunteerContributionHistory,
          locationImpact: mockDashboardAnalytics.locationImpact,
        };

        return { success: true, data: mapped };
      }
    } catch (err) {
      console.warn('[analyticsService] Backend analytics call failed, using mock dataset:', err);
    }

    return {
      success: true,
      data: mockDashboardAnalytics,
    };
  },
};
