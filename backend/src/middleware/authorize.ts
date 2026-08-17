import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, ErrorCode, UserRole } from '../types';

/**
 * Role-Based Authorization Middleware Factory
 * Usage: router.get('/admin-only', authenticate, authorize(UserRole.ADMIN), handler)
 * Usage: router.get('/admin-or-staff', authenticate, authorize(UserRole.ADMIN, UserRole.STAFF), handler)
 *
 * IMPORTANT: Always use AFTER authenticate middleware.
 * Backend is the final authority on authorization — contract Section 19.
 */
export function authorize(...allowedRoles: UserRole[]) {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
        code: ErrorCode.UNAUTHORIZED,
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${allowedRoles.join(' or ')}`,
        code: ErrorCode.FORBIDDEN,
      });
      return;
    }

    next();
  };
}
