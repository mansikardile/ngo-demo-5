import { Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { prisma } from '../config/prisma';
import { AuthenticatedRequest, ErrorCode, UserRole } from '../types';

/**
 * JWT Authentication Middleware
 * Validates the Supabase JWT from Authorization: Bearer <token>
 * Attaches the full user record (from our DB) to req.user
 */
export async function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'No authorization token provided',
        code: ErrorCode.UNAUTHORIZED,
      });
      return;
    }

    const token = authHeader.split(' ')[1];

    // Verify the JWT with Supabase
    const { data, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !data.user) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
        code: ErrorCode.INVALID_TOKEN,
      });
      return;
    }

    // Fetch role from our own User table (not from JWT claims)
    const dbUser = await prisma.user.findUnique({
      where: { supabaseUid: data.user.id },
      select: {
        id: true,
        supabaseUid: true,
        email: true,
        role: true,
        name: true,
        isActive: true,
      },
    });

    if (!dbUser || !dbUser.isActive) {
      res.status(401).json({
        success: false,
        message: 'User account not found or deactivated',
        code: ErrorCode.UNAUTHORIZED,
      });
      return;
    }

    req.user = {
      id: dbUser.id,
      supabaseUid: dbUser.supabaseUid,
      email: dbUser.email,
      role: dbUser.role as UserRole,
      name: dbUser.name,
    };

    next();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Authentication error',
      code: ErrorCode.SERVER_ERROR,
    });
  }
}
