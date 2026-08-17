import { prisma } from '../config/prisma';
import { AppError } from '../middleware/errorHandler';
import { ErrorCode, RegistrantType, RegistrationStatus } from '../types';
import {
  ParticipantRegistrationInput,
  UpdateRegistrationStatusInput,
  VolunteerRegistrationInput,
} from '../validators/registration.validator';
import {
  generateParticipantTrackingId,
  generateVolunteerTrackingId,
  getPagination,
} from '../utils/helpers';
import { Request } from 'express';

export const registrationService = {
  /**
   * Register a PARTICIPANT for a program — use-case J, K
   * Creates or finds the Participant, then creates a Registration
   * Returns the tracking ID — use-case K
   */
  async registerParticipant(
    programId: string,
    input: ParticipantRegistrationInput
  ) {
    // Validate program exists and is active
    const program = await prisma.program.findUnique({ where: { id: programId } });
    if (!program) {
      throw new AppError('Program not found', 404, ErrorCode.PROGRAM_NOT_FOUND);
    }
    if (program.status !== 'ACTIVE' && program.status !== 'UPCOMING') {
      throw new AppError(
        'Program is not accepting registrations',
        400,
        ErrorCode.PROGRAM_NOT_ACTIVE
      );
    }

    // Find or create participant (allows re-registration with same email for different programs)
    let participant = await prisma.participant.findFirst({
      where: { email: input.email },
    });

    if (!participant) {
      participant = await prisma.participant.create({
        data: {
          ...input,
          trackingId: generateParticipantTrackingId(),
        },
      });
    }

    // Check if already registered for this program
    const existing = await prisma.registration.findUnique({
      where: {
        programId_participantId: {
          programId,
          participantId: participant.id,
        },
      },
    });

    if (existing) {
      throw new AppError(
        'Already registered for this program',
        409,
        ErrorCode.ALREADY_REGISTERED
      );
    }

    const registration = await prisma.registration.create({
      data: {
        programId,
        participantId: participant.id,
        registrantType: RegistrantType.PARTICIPANT,
        status: RegistrationStatus.REGISTERED,
      },
      include: {
        program: { select: { id: true, name: true, programCode: true, startDate: true } },
      },
    });

    return {
      trackingId: participant.trackingId,
      registrationId: registration.id,
      participant: {
        id: participant.id,
        name: participant.name,
        email: participant.email,
        trackingId: participant.trackingId,
      },
      program: registration.program,
      status: registration.status,
      registeredAt: registration.registeredAt,
    };
  },

  /**
   * Register a VOLUNTEER for a program — use-case J, K
   */
  async registerVolunteer(
    programId: string,
    input: VolunteerRegistrationInput
  ) {
    const program = await prisma.program.findUnique({ where: { id: programId } });
    if (!program) {
      throw new AppError('Program not found', 404, ErrorCode.PROGRAM_NOT_FOUND);
    }
    if (program.status !== 'ACTIVE' && program.status !== 'UPCOMING') {
      throw new AppError(
        'Program is not accepting registrations',
        400,
        ErrorCode.PROGRAM_NOT_ACTIVE
      );
    }

    let volunteer = await prisma.volunteer.findFirst({
      where: { email: input.email },
    });

    if (!volunteer) {
      volunteer = await prisma.volunteer.create({
        data: {
          ...input,
          trackingId: generateVolunteerTrackingId(),
        },
      });
    }

    const existing = await prisma.registration.findUnique({
      where: {
        programId_volunteerId: {
          programId,
          volunteerId: volunteer.id,
        },
      },
    });

    if (existing) {
      throw new AppError(
        'Already registered for this program',
        409,
        ErrorCode.ALREADY_REGISTERED
      );
    }

    const registration = await prisma.registration.create({
      data: {
        programId,
        volunteerId: volunteer.id,
        registrantType: RegistrantType.VOLUNTEER,
        status: RegistrationStatus.REGISTERED,
        volunteerStatus: 'REGISTERED',
      },
      include: {
        program: { select: { id: true, name: true, programCode: true, startDate: true } },
      },
    });

    return {
      trackingId: volunteer.trackingId,
      registrationId: registration.id,
      volunteer: {
        id: volunteer.id,
        name: volunteer.name,
        email: volunteer.email,
        trackingId: volunteer.trackingId,
      },
      program: registration.program,
      status: registration.status,
      volunteerStatus: registration.volunteerStatus,
      registeredAt: registration.registeredAt,
    };
  },

  /**
   * Get registration by ID
   */
  async getById(id: string) {
    const reg = await prisma.registration.findUnique({
      where: { id },
      include: {
        program: { select: { id: true, name: true, programCode: true, location: true, startDate: true, endDate: true } },
        participant: { select: { id: true, name: true, email: true, trackingId: true } },
        volunteer: { select: { id: true, name: true, email: true, trackingId: true } },
      },
    });

    if (!reg) {
      throw new AppError('Registration not found', 404, ErrorCode.REGISTRATION_NOT_FOUND);
    }

    return reg;
  },

  /**
   * Update participation status — use-case D (the funnel)
   * REGISTERED → ATTENDED → PARTICIPATED → COMPLETED
   */
  async updateStatus(id: string, input: UpdateRegistrationStatusInput) {
    const reg = await registrationService.getById(id);

    const timestamps: Record<string, Date | undefined> = {};
    if (input.status === 'ATTENDED' && !reg.attendedAt) {
      timestamps.attendedAt = new Date();
    }
    if (input.status === 'PARTICIPATED' && !reg.participatedAt) {
      timestamps.participatedAt = new Date();
    }
    if (input.status === 'COMPLETED' && !reg.completedAt) {
      timestamps.completedAt = new Date();
    }

    // Accumulate volunteer hours if completing
    if (
      reg.registrantType === 'VOLUNTEER' &&
      input.status === 'COMPLETED' &&
      input.hoursContributed
    ) {
      await prisma.volunteer.update({
        where: { id: reg.volunteerId! },
        data: { totalHours: { increment: input.hoursContributed } },
      });
    }

    const updated = await prisma.registration.update({
      where: { id },
      data: {
        status: input.status as RegistrationStatus,
        volunteerStatus: input.volunteerStatus as any ?? undefined,
        hoursContributed: input.hoursContributed,
        notes: input.notes,
        ...timestamps,
      },
    });

    return updated;
  },

  /**
   * List registrations for a program — use-case B
   */
  async listByProgram(programId: string, req: Request) {
    const { page, limit, skip } = getPagination(req);
    const { status, type, search } = req.query as Record<string, string>;

    const where: Record<string, unknown> = { programId };
    if (status) where.status = status;
    if (type) where.registrantType = type;
    if (search) {
      where.OR = [
        { participant: { name: { contains: search, mode: 'insensitive' } } },
        { participant: { email: { contains: search, mode: 'insensitive' } } },
        { volunteer: { name: { contains: search, mode: 'insensitive' } } },
        { volunteer: { email: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [registrations, total] = await Promise.all([
      prisma.registration.findMany({
        where,
        skip,
        take: limit,
        orderBy: { registeredAt: 'desc' },
        include: {
          participant: { select: { id: true, name: true, email: true, phone: true, trackingId: true } },
          volunteer: { select: { id: true, name: true, email: true, phone: true, trackingId: true } },
        },
      }),
      prisma.registration.count({ where }),
    ]);

    return { registrations, total, page, limit };
  },
};
