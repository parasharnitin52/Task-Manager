import { z } from 'zod';

export const taskIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  })
});

export const createCommentSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  }),
  body: z.object({
    body: z.string().trim().min(1).max(2000)
  })
});
