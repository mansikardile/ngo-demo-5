import { Request, Response, NextFunction } from 'express';
import { registrationService } from '../services/registration.service';
import {
  participantRegistrationSchema,
  volunteerRegistrationSchema,
  updateRegistrationStatusSchema,
} from '../validators/registration.validator';
import { AuthenticatedRequest } from '../types';
import { paginatedResponse, successResponse } from '../utils/helpers';

export const registrationController = {
  /**
   * POST /api/v1/programs/:programId/register/participant — public
   */
  async registerParticipant(req: Request, res: Response, next: NextFunction) {
    try {
      const input = participantRegistrationSchema.parse(req.body);
      const result = await registrationService.registerParticipant(
        String(req.params.programId),
        input
      );
      res.status(201).json(successResponse(result));
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/v1/programs/:programId/register/volunteer — public
   */
  async registerVolunteer(req: Request, res: Response, next: NextFunction) {
    try {
      const input = volunteerRegistrationSchema.parse(req.body);
      const result = await registrationService.registerVolunteer(
        String(req.params.programId),
        input
      );
      res.status(201).json(successResponse(result));
    } catch (err) {
      next(err);
    }
  },

  async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const reg = await registrationService.getById(String(req.params.id));
      res.json(successResponse(reg));
    } catch (err) {
      next(err);
    }
  },

  /**
   * PATCH /api/v1/registrations/:id — update participation funnel status
   */
  async updateStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const input = updateRegistrationStatusSchema.parse(req.body);
      const reg = await registrationService.updateStatus(String(req.params.id), input);
      res.json(successResponse(reg));
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/v1/programs/:programId/registrations — list for a program
   */
  async listByProgram(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { registrations, total, page, limit } =
        await registrationService.listByProgram(String(req.params.programId), req);
      res.json(paginatedResponse(registrations, total, page, limit));
    } catch (err) {
      next(err);
    }
  },
};
