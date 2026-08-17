import { Request, Response, NextFunction } from 'express';
import { participantService, volunteerService } from '../services/participant.service';
import { AuthenticatedRequest } from '../types';
import { paginatedResponse, successResponse } from '../utils/helpers';

export const participantController = {
  async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { participants, total, page, limit } = await participantService.list(req);
      res.json(paginatedResponse(participants, total, page, limit));
    } catch (err) {
      next(err);
    }
  },

  async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const participant = await participantService.getById(String(req.params.id));
      res.json(successResponse(participant));
    } catch (err) {
      next(err);
    }
  },

  /**
   * Public tracking page — use-case L
   * No authentication required, returns only their own data
   */
  async getByTrackingId(req: Request, res: Response, next: NextFunction) {
    try {
      const participant = await participantService.getByTrackingId(
        String(req.params.trackingId)
      );
      res.json(successResponse(participant));
    } catch (err) {
      next(err);
    }
  },
};

export const volunteerController = {
  async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { volunteers, total, page, limit } = await volunteerService.list(req);
      res.json(paginatedResponse(volunteers, total, page, limit));
    } catch (err) {
      next(err);
    }
  },

  async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const volunteer = await volunteerService.getById(String(req.params.id));
      res.json(successResponse(volunteer));
    } catch (err) {
      next(err);
    }
  },

  async getByTrackingId(req: Request, res: Response, next: NextFunction) {
    try {
      const volunteer = await volunteerService.getByTrackingId(
        String(req.params.trackingId)
      );
      res.json(successResponse(volunteer));
    } catch (err) {
      next(err);
    }
  },
};
