import { Request, Response, NextFunction } from 'express';
import { ErrorCode } from '../types';

/**
 * Global Error Handler — contract Section 13
 * Catches any unhandled errors and formats them per the contract error format.
 * Must be registered LAST in app.ts: app.use(errorHandler)
 */
export function errorHandler(
  err: Error & { statusCode?: number; code?: ErrorCode },
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('[ERROR]', err.message, err.stack);

  const statusCode = err.statusCode ?? 500;
  const code = err.code ?? ErrorCode.SERVER_ERROR;
  const message =
    process.env.NODE_ENV === 'production' && statusCode === 500
      ? 'Internal server error'
      : err.message;

  res.status(statusCode).json({
    success: false,
    message,
    code,
  });
}

/**
 * Utility: Create a typed API error to throw inside services/controllers
 */
export class AppError extends Error {
  statusCode: number;
  code: ErrorCode;

  constructor(message: string, statusCode: number, code: ErrorCode) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
