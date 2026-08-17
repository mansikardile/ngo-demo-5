import { Router } from 'express';
import { registrationController } from '../controllers/registration.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// GET /api/v1/registrations/:id
router.get('/:id', authenticate, registrationController.getById as any);

// PATCH /api/v1/registrations/:id — update funnel status
router.patch('/:id', authenticate, registrationController.updateStatus as any);

export default router;
