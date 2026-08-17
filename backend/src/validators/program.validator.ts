import { z } from 'zod';
import { ProgramStatus } from '../types';

export const createProgramSchema = z.object({
  name: z.string().min(3, 'Program name must be at least 3 characters'),
  description: z.string().optional(),
  category: z.string().min(2, 'Category is required'),
  location: z.string().min(2, 'Location is required'),
  address: z.string().optional(),
  startDate: z.string().datetime({ message: 'Start date must be ISO 8601' }),
  endDate: z.string().datetime({ message: 'End date must be ISO 8601' }),
  maxParticipants: z.number().int().positive().optional(),
  maxVolunteers: z.number().int().positive().optional(),
  coordinatorId: z.string().uuid().optional(),
});

export const updateProgramSchema = createProgramSchema.partial();

export const updateProgramStatusSchema = z.object({
  status: z.nativeEnum(ProgramStatus, {
    message: `Status must be one of: ${Object.values(ProgramStatus).join(', ')}`,
  }),
});

export type CreateProgramInput = z.infer<typeof createProgramSchema>;
export type UpdateProgramInput = z.infer<typeof updateProgramSchema>;
export type UpdateProgramStatusInput = z.infer<typeof updateProgramStatusSchema>;
