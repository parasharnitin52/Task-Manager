import { z } from 'zod';

export const updatePermissionsSchema = z.object({
  params: z.object({
    role: z.string().trim().min(2).max(80)
  }),
  body: z.object({
    permissions: z.record(z.boolean())
  })
});

export const createRoleSchema = z.object({
  body: z.object({
    role: z.string().trim().min(2).max(80),
    permissions: z.record(z.boolean()).optional()
  })
});
