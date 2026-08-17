import { Router } from 'express';
import { programController } from '../controllers/program.controller';
import { registrationController } from '../controllers/registration.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { UserRole } from '../types';

const router = Router();

// GET /api/v1/programs — all authenticated users
router.get('/', authenticate, programController.list as any);

// GET /api/v1/programs/:id
router.get('/:id', authenticate, programController.getById as any);

// POST /api/v1/programs — ADMIN or STAFF only
router.post(
  '/',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.STAFF),
  programController.create as any
);

// PATCH /api/v1/programs/:id
router.patch(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.STAFF, UserRole.COORDINATOR),
  programController.update as any
);

// PATCH /api/v1/programs/:id/status — use-case G
router.patch(
  '/:id/status',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.STAFF),
  programController.updateStatus as any
);

// DELETE /api/v1/programs/:id — ADMIN only
router.delete(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  programController.delete as any
);

// ── Registration sub-routes ──────────────────────────────────────────────────

// POST /api/v1/programs/:programId/register/participant — PUBLIC
router.post('/:programId/register/participant', registrationController.registerParticipant);

// POST /api/v1/programs/:programId/register/volunteer — PUBLIC
router.post('/:programId/register/volunteer', registrationController.registerVolunteer);

// GET /api/v1/programs/:programId/registrations — admin
router.get(
  '/:programId/registrations',
  authenticate,
  registrationController.listByProgram as any
);

export default router;
