import { prisma } from '../config/prisma';
import { AppError } from '../middleware/errorHandler';
import { ErrorCode } from '../types';
import { getPagination } from '../utils/helpers';
import { Request } from 'express';

export const participantService = {
  /**
   * List all participants — use-case B, C (admin)
   * Supports search, filter by program, pagination
   */
  async list(req: Request) {
    const { page, limit, skip } = getPagination(req);
    const { search, programId, status } = req.query as Record<string, string>;

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { trackingId: { contains: search, mode: 'insensitive' } },
        { college: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (programId) {
      where.registrations = { some: { programId } };
    }

    const [participants, total] = await Promise.all([
      prisma.participant.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          registrations: {
            where: status ? { status: status as any } : undefined,
            include: {
              program: { select: { id: true, name: true, programCode: true, status: true } },
            },
          },
        },
      }),
      prisma.participant.count({ where }),
    ]);

    return { participants, total, page, limit };
  },

  /**
   * Get participant by ID (admin)
   */
  async getById(id: string) {
    const participant = await prisma.participant.findUnique({
      where: { id },
      include: {
        registrations: {
          include: {
            program: { select: { id: true, name: true, programCode: true, location: true, startDate: true, status: true } },
          },
          orderBy: { registeredAt: 'desc' },
        },
      },
    });

    if (!participant) {
      throw new AppError('Participant not found', 404, ErrorCode.PARTICIPANT_NOT_FOUND);
    }

    return participant;
  },

  /**
   * Public tracking page — use-case L
   * Returns ONLY that participant's own data via their tracking ID
   */
  async getByTrackingId(trackingId: string) {
    const participant = await prisma.participant.findUnique({
      where: { trackingId },
      select: {
        id: true,
        trackingId: true,
        name: true,
        email: true,
        location: true,
        college: true,
        areaOfInterest: true,
        createdAt: true,
        registrations: {
          select: {
            id: true,
            status: true,
            registeredAt: true,
            attendedAt: true,
            participatedAt: true,
            completedAt: true,
            program: {
              select: {
                id: true,
                name: true,
                programCode: true,
                location: true,
                startDate: true,
                endDate: true,
                status: true,
                category: true,
              },
            },
          },
          orderBy: { registeredAt: 'desc' },
        },
      },
    });

    if (!participant) {
      throw new AppError(
        'Tracking ID not found. Please check and try again.',
        404,
        ErrorCode.PARTICIPANT_NOT_FOUND
      );
    }

    return participant;
  },
};

export const volunteerService = {
  /**
   * List all volunteers — use-case B, C, E
   */
  async list(req: Request) {
    const { page, limit, skip } = getPagination(req);
    const { search, programId, status } = req.query as Record<string, string>;

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { trackingId: { contains: search, mode: 'insensitive' } },
        { college: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (programId) {
      where.registrations = { some: { programId } };
    }

    const [volunteers, total] = await Promise.all([
      prisma.volunteer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          registrations: {
            where: status ? { volunteerStatus: status as any } : undefined,
            include: {
              program: { select: { id: true, name: true, programCode: true, status: true } },
            },
          },
        },
      }),
      prisma.volunteer.count({ where }),
    ]);

    return { volunteers, total, page, limit };
  },

  async getById(id: string) {
    const volunteer = await prisma.volunteer.findUnique({
      where: { id },
      include: {
        registrations: {
          include: {
            program: { select: { id: true, name: true, programCode: true, location: true, startDate: true, status: true } },
          },
          orderBy: { registeredAt: 'desc' },
        },
      },
    });

    if (!volunteer) {
      throw new AppError('Volunteer not found', 404, ErrorCode.VOLUNTEER_NOT_FOUND);
    }

    return volunteer;
  },

  /**
   * Public tracking page for volunteers — use-case L
   */
  async getByTrackingId(trackingId: string) {
    const volunteer = await prisma.volunteer.findUnique({
      where: { trackingId },
      select: {
        id: true,
        trackingId: true,
        name: true,
        email: true,
        location: true,
        college: true,
        areaOfInterest: true,
        totalHours: true,
        createdAt: true,
        registrations: {
          select: {
            id: true,
            status: true,
            volunteerStatus: true,
            hoursContributed: true,
            registeredAt: true,
            attendedAt: true,
            participatedAt: true,
            completedAt: true,
            program: {
              select: {
                id: true,
                name: true,
                programCode: true,
                location: true,
                startDate: true,
                endDate: true,
                status: true,
                category: true,
              },
            },
          },
          orderBy: { registeredAt: 'desc' },
        },
      },
    });

    if (!volunteer) {
      throw new AppError(
        'Tracking ID not found. Please check and try again.',
        404,
        ErrorCode.VOLUNTEER_NOT_FOUND
      );
    }

    return volunteer;
  },
};
