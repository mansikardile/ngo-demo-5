import { Response, NextFunction } from 'express';
import { analyticsService } from '../services/analytics.service';
import { AuthenticatedRequest } from '../types';
import { successResponse } from '../utils/helpers';

export const analyticsController = {
  async getDashboard(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = await analyticsService.getDashboard();
      res.json(successResponse(data));
    } catch (err) {
      next(err);
    }
  },

  async getProgramAnalytics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = await analyticsService.getProgramAnalytics();
      res.json(successResponse(data));
    } catch (err) {
      next(err);
    }
  },

  async getLocationAnalytics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = await analyticsService.getLocationAnalytics();
      res.json(successResponse(data));
    } catch (err) {
      next(err);
    }
  },
};
