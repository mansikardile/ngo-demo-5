import { Request } from 'express';
import { PaginationParams } from '../types';

/**
 * Extract and validate pagination parameters from query string
 * Default: page=1, limit=20
 */
export function getPagination(req: Request): PaginationParams {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

/**
 * Generate a human-readable tracking ID for participants
 * Format: CPR-PAR-XXXXXXXX (8 hex chars from UUID)
 */
export function generateParticipantTrackingId(): string {
  const hex = generateRandomHex(8);
  return `CPR-PAR-${hex.toUpperCase()}`;
}

/**
 * Generate a human-readable tracking ID for volunteers
 * Format: CPR-VOL-XXXXXXXX (8 hex chars from UUID)
 */
export function generateVolunteerTrackingId(): string {
  const hex = generateRandomHex(8);
  return `CPR-VOL-${hex.toUpperCase()}`;
}

/**
 * Generate a unique program code
 * Format: <CATEGORY_PREFIX>-<LOCATION_PREFIX>-<YEAR>-<SEQUENCE>
 * Example: EDU-PUN-2026-01
 */
export function generateProgramCode(
  category: string,
  location: string,
  sequence: number
): string {
  const cat = category.substring(0, 3).toUpperCase().replace(/\s/g, '');
  const loc = location.substring(0, 3).toUpperCase().replace(/\s/g, '');
  const year = new Date().getFullYear();
  const seq = String(sequence).padStart(2, '0');
  return `${cat}-${loc}-${year}-${seq}`;
}

function generateRandomHex(length: number): string {
  const chars = '0123456789abcdef';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

/**
 * Build a standard paginated API response — contract Section 12
 */
export function paginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
) {
  return {
    success: true as const,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Build a standard success API response — contract Section 12
 */
export function successResponse<T>(data: T) {
  return {
    success: true as const,
    data,
  };
}
