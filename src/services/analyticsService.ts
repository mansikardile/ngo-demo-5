import { mockDashboardAnalytics } from '../mock/analytics';
import { DashboardAnalytics, ApiResponse } from '../types';

export const analyticsService = {
  async getDashboardAnalytics(): Promise<ApiResponse<DashboardAnalytics>> {
    return {
      success: true,
      data: mockDashboardAnalytics,
    };
  },
};
