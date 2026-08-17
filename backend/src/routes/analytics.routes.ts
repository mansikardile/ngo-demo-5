import { Router } from 'express';
import { analyticsController } from '../controllers/analytics.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { UserRole } from '../types';

const router = Router();

// All analytics are JWT-protected — ADMIN and STAFF only
const adminOrStaff = [
  authenticate,
  authorize(UserRole.ADMIN, UserRole.STAFF, UserRole.COORDINATOR),
];

// GET /api/v1/analytics/dashboard
router.get('/dashboard', ...adminOrStaff, analyticsController.getDashboard as any);

// GET /api/v1/analytics/programs
router.get('/programs', ...adminOrStaff, analyticsController.getProgramAnalytics as any);

// GET /api/v1/analytics/location
router.get('/location', ...adminOrStaff, analyticsController.getLocationAnalytics as any);

export default router;
