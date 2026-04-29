import { z } from 'zod';

export const idParamSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  })
});

export const optionalDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD format')
  .optional()
  .nullable();
