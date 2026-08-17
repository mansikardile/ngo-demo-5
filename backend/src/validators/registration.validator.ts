import { z } from 'zod';

// Use-case J — registration form fields
const baseRegistrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Valid email is required'),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian phone number'),
  location: z.string().min(2, 'Location is required'),
  college: z.string().optional(),
  ageOrYear: z.string().optional(),
  areaOfInterest: z.string().optional(),
});

export const participantRegistrationSchema = baseRegistrationSchema;
export const volunteerRegistrationSchema = baseRegistrationSchema;

export const updateRegistrationStatusSchema = z.object({
  status: z.enum(['REGISTERED', 'ATTENDED', 'PARTICIPATED', 'COMPLETED']),
  volunteerStatus: z
    .enum(['REGISTERED', 'ASSIGNED', 'ACTIVE', 'COMPLETED'])
    .optional(),
  hoursContributed: z.number().nonnegative().optional(),
  notes: z.string().optional(),
});

export type ParticipantRegistrationInput = z.infer<
  typeof participantRegistrationSchema
>;
export type VolunteerRegistrationInput = z.infer<
  typeof volunteerRegistrationSchema
>;
export type UpdateRegistrationStatusInput = z.infer<
  typeof updateRegistrationStatusSchema
>;
