import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Ugyldig e-postadresse.'),
  password: z.string().min(8, 'Passord må være minst 8 tegn.')
});

export const machineRequestSchema = z.object({
  machineId: z.coerce.number().int().positive(),
  message: z.string().min(10, 'Meldingen må ha minst 10 tegn.')
});

export const updateRequestStatusSchema = z.object({
  requestId: z.coerce.number().int().positive(),
  status: z.enum(['sendt', 'godkjent', 'avslått'])
});
