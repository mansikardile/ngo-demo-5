import { prisma } from '../config/prisma';
import { AppError } from '../middleware/errorHandler';
import { ErrorCode, ProgramStatus } from '../types';
import {
  CreateProgramInput,
  UpdateProgramInput,
  UpdateProgramStatusInput,
} from '../validators/program.validator';
import {
  generateProgramCode,
  getPagination,
} from '../utils/helpers';
import { Request } from 'express';

export const programService = {
  /**
   * List programs with pagination, search, and filtering — use-case B, C
   */
  async list(req: Request) {
    const { page, limit, skip } = getPagination(req);
    const { search, status, location } = req.query as Record<string, string>;

    const where: Record<string, unknown> = {};

    if (status) where.status = status as ProgramStatus;
    if (location) where.location = { contains: location, mode: 'insensitive' };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { programCode: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [programs, total] = await Promise.all([
      prisma.program.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          coordinator: { select: { id: true, name: true, email: true } },
          _count: { select: { registrations: true } },
        },
      }),
      prisma.program.count({ where }),
    ]);

    return { programs, total, page, limit };
  },

  /**
   * Get single program by ID
   */
  async getById(id: string) {
    const program = await prisma.program.findUnique({
      where: { id },
      include: {
        coordinator: { select: { id: true, name: true, email: true } },
        _count: { select: { registrations: true } },
        impactRecords: { orderBy: { recordedAt: 'desc' }, take: 1 },
      },
    });

    if (!program) {
      throw new AppError('Program not found', 404, ErrorCode.PROGRAM_NOT_FOUND);
    }

    return program;
  },

  /**
   * Create a new program — use-case A
   * Generates a unique programCode
   */
  async create(input: CreateProgramInput) {
    // Count programs in same category+location for code sequence
    const count = await prisma.program.count({
      where: {
        category: { contains: input.category, mode: 'insensitive' },
        location: { contains: input.location, mode: 'insensitive' },
      },
    });

    let seqNumber = count + 1;
    let programCode = generateProgramCode(
      input.category,
      input.location,
      seqNumber
    );

    let existing = await prisma.program.findUnique({ where: { programCode } });
    while (existing) {
      seqNumber += 1;
      programCode = generateProgramCode(input.category, input.location, seqNumber);
      existing = await prisma.program.findUnique({ where: { programCode } });
    }

    const program = await prisma.program.create({
      data: {
        ...input,
        programCode,
        startDate: new Date(input.startDate),
        endDate: new Date(input.endDate),
      },
      include: {
        coordinator: { select: { id: true, name: true, email: true } },
      },
    });

    return program;
  },

  /**
   * Update a program — use-case A
   */
  async update(id: string, input: UpdateProgramInput) {
    await programService.getById(id); // Ensures it exists

    const program = await prisma.program.update({
      where: { id },
      data: {
        ...input,
        startDate: input.startDate ? new Date(input.startDate) : undefined,
        endDate: input.endDate ? new Date(input.endDate) : undefined,
        updatedAt: new Date(),
      },
      include: {
        coordinator: { select: { id: true, name: true, email: true } },
      },
    });

    return program;
  },

  /**
   * Update program status — use-case G
   */
  async updateStatus(id: string, input: UpdateProgramStatusInput) {
    await programService.getById(id);

    return prisma.program.update({
      where: { id },
      data: { status: input.status },
    });
  },

  /**
   * Delete a program (ADMIN only)
   */
  async delete(id: string) {
    await programService.getById(id);
    await prisma.program.delete({ where: { id } });
  },
};
