import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// POST /api/v1/auth/login — public
router.post('/login', authController.login);

// POST /api/v1/auth/logout — protected
router.post('/logout', authenticate, authController.logout as any);

// GET /api/v1/auth/me — protected
router.get('/me', authenticate, authController.me as any);

export default router;
