// Shared types, enums and interfaces — mirrors contract Section 14
// These must stay in sync with the Prisma schema and API contract

export enum UserRole {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  COORDINATOR = 'COORDINATOR',
}

export enum ProgramStatus {
  DRAFT = 'DRAFT',
  UPCOMING = 'UPCOMING',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum RegistrationStatus {
  REGISTERED = 'REGISTERED',
  ATTENDED = 'ATTENDED',
  PARTICIPATED = 'PARTICIPATED',
  COMPLETED = 'COMPLETED',
}

export enum VolunteerStatus {
  REGISTERED = 'REGISTERED',
  ASSIGNED = 'ASSIGNED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
}

export enum RegistrantType {
  PARTICIPANT = 'PARTICIPANT',
  VOLUNTEER = 'VOLUNTEER',
}

// Error codes — contract Section 13
export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  PROGRAM_NOT_FOUND = 'PROGRAM_NOT_FOUND',
  PARTICIPANT_NOT_FOUND = 'PARTICIPANT_NOT_FOUND',
  VOLUNTEER_NOT_FOUND = 'VOLUNTEER_NOT_FOUND',
  REGISTRATION_NOT_FOUND = 'REGISTRATION_NOT_FOUND',
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  INVALID_TOKEN = 'INVALID_TOKEN',
  SERVER_ERROR = 'SERVER_ERROR',
  ALREADY_REGISTERED = 'ALREADY_REGISTERED',
  PROGRAM_NOT_ACTIVE = 'PROGRAM_NOT_ACTIVE',
}

// Augment Express Request to carry authenticated user info
import { Request } from 'express';
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;           // our DB user id
    supabaseUid: string;
    email: string;
    role: UserRole;
    name: string;
  };
}

// Standard API response shapes — contract Section 12
export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiList<T> {
  success: true;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  success: false;
  message: string;
  code: ErrorCode;
}

// Pagination query params
export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}
