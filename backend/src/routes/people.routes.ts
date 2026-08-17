import { Router } from 'express';
import { participantController, volunteerController } from '../controllers/participant.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// ── Participant routes ───────────────────────────────────────────────────────

// GET /api/v1/participants — admin/staff/coordinator
router.get('/participants', authenticate, participantController.list as any);

// GET /api/v1/participants/track/:trackingId — PUBLIC (own data only)
router.get('/participants/track/:trackingId', participantController.getByTrackingId);

// GET /api/v1/participants/:id — admin
router.get('/participants/:id', authenticate, participantController.getById as any);

// ── Volunteer routes ─────────────────────────────────────────────────────────

// GET /api/v1/volunteers — admin/staff/coordinator
router.get('/volunteers', authenticate, volunteerController.list as any);

// GET /api/v1/volunteers/track/:trackingId — PUBLIC (own data only)
router.get('/volunteers/track/:trackingId', volunteerController.getByTrackingId);

// GET /api/v1/volunteers/:id — admin
router.get('/volunteers/:id', authenticate, volunteerController.getById as any);

export default router;
