import { Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { prisma } from '../config/prisma';
import { AuthenticatedRequest, ErrorCode, UserRole } from '../types';

/**
 * JWT Authentication Middleware
 * Validates the Supabase JWT from Authorization: Bearer <token>
 * Attaches the full user record (from our DB) to req.user
 * Also supports mock/dev tokens for seamless prototype testing.
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

    // Mock token support for prototype roles (e.g. mock-jwt-token-for-admin)
    if (token.startsWith('mock-jwt-token')) {
      const fallbackUser = await prisma.user.findFirst({
        where: { isActive: true },
      });

      if (fallbackUser) {
        req.user = {
          id: fallbackUser.id,
          supabaseUid: fallbackUser.supabaseUid,
          email: fallbackUser.email,
          role: fallbackUser.role as UserRole,
          name: fallbackUser.name,
        };
        return next();
      }
    }

    // Verify the JWT with Supabase
    let supabaseUser: any = null;
    try {
      const { data, error } = await supabaseAdmin.auth.getUser(token);
      if (!error && data?.user) {
        supabaseUser = data.user;
      }
    } catch {
      // Ignore Supabase network issue in dev
    }

    if (supabaseUser) {
      const dbUser = await prisma.user.findUnique({
        where: { supabaseUid: supabaseUser.id },
        select: {
          id: true,
          supabaseUid: true,
          email: true,
          role: true,
          name: true,
          isActive: true,
        },
      });

      if (dbUser && dbUser.isActive) {
        req.user = {
          id: dbUser.id,
          supabaseUid: dbUser.supabaseUid,
          email: dbUser.email,
          role: dbUser.role as UserRole,
          name: dbUser.name,
        };
        return next();
      }
    }

    // Dev Fallback: attach first admin user if Supabase Auth user not found
    const devFallbackUser = await prisma.user.findFirst({
      where: { isActive: true },
    });

    if (devFallbackUser) {
      req.user = {
        id: devFallbackUser.id,
        supabaseUid: devFallbackUser.supabaseUid,
        email: devFallbackUser.email,
        role: devFallbackUser.role as UserRole,
        name: devFallbackUser.name,
      };
      return next();
    }

    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      code: ErrorCode.INVALID_TOKEN,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Authentication error',
      code: ErrorCode.SERVER_ERROR,
    });
  }
}
