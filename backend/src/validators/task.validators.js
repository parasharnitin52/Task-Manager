import { z } from 'zod';
import { optionalDate } from './common.validators.js';

export const createTaskSchema = z.object({
  body: z.object({
    projectId: z.string().uuid(),
    title: z.string().trim().min(2).max(180),
    description: z.string().trim().max(2000).optional().nullable(),
    assigneeIds: z.array(z.string().uuid()).min(1, 'Select at least one project member'),
    progress: z.coerce.number().int().min(0).max(100).default(0),
    dueDate: optionalDate
  })
});

export const updateTaskSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    title: z.string().trim().min(2).max(180).optional(),
    description: z.string().trim().max(2000).optional().nullable(),
    status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
    progress: z.coerce.number().int().min(0).max(100).optional(),
    assigneeIds: z.array(z.string().uuid()).optional(),
    dueDate: optionalDate
  })
});
