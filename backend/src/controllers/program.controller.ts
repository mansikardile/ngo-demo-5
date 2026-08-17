import { Response, NextFunction } from 'express';
import { programService } from '../services/program.service';
import {
  createProgramSchema,
  updateProgramSchema,
  updateProgramStatusSchema,
} from '../validators/program.validator';
import { AuthenticatedRequest } from '../types';
import { paginatedResponse, successResponse } from '../utils/helpers';

export const programController = {
  async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { programs, total, page, limit } = await programService.list(req);
      res.json(paginatedResponse(programs, total, page, limit));
    } catch (err) {
      next(err);
    }
  },

  async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const program = await programService.getById(String(req.params.id));
      res.json(successResponse(program));
    } catch (err) {
      next(err);
    }
  },

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const input = createProgramSchema.parse(req.body);
      const program = await programService.create(input);
      res.status(201).json(successResponse(program));
    } catch (err) {
      next(err);
    }
  },

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const input = updateProgramSchema.parse(req.body);
      const program = await programService.update(String(req.params.id), input);
      res.json(successResponse(program));
    } catch (err) {
      next(err);
    }
  },

  async updateStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const input = updateProgramStatusSchema.parse(req.body);
      const program = await programService.updateStatus(String(req.params.id), input);
      res.json(successResponse(program));
    } catch (err) {
      next(err);
    }
  },

  async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await programService.delete(String(req.params.id));
      res.json(successResponse({ message: 'Program deleted successfully' }));
    } catch (err) {
      next(err);
    }
  },
};
