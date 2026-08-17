import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { loginSchema } from '../validators/auth.validator';
import { AuthenticatedRequest } from '../types';
import { successResponse } from '../utils/helpers';

export const authController = {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const input = loginSchema.parse(req.body);
      const result = await authService.login(input);
      res.status(200).json(successResponse(result));
    } catch (err) {
      next(err);
    }
  },

  async logout(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.split(' ')[1] ?? '';
      await authService.logout(token);
      res.status(200).json(successResponse({ message: 'Logged out successfully' }));
    } catch (err) {
      next(err);
    }
  },

  async me(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = await authService.getMe(req.user!.id);
      res.status(200).json(successResponse(user));
    } catch (err) {
      next(err);
    }
  },
};
