import { z } from 'zod';
import { optionalDate } from './common.validators.js';

export const createProjectSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(160),
    description: z.string().trim().max(2000).optional().nullable(),
    dueDate: optionalDate
  })
});

export const updateProjectSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    name: z.string().trim().min(2).max(160).optional(),
    description: z.string().trim().max(2000).optional().nullable(),
    status: z.enum(['ACTIVE', 'COMPLETED', 'ARCHIVED']).optional(),
    dueDate: optionalDate
  })
});

export const memberSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    userId: z.string().uuid(),
    role: z.enum(['ADMIN', 'MEMBER']).default('MEMBER')
  })
});
