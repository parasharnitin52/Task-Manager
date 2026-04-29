import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(120).optional(),
    email: z.string().trim().email().toLowerCase().optional()
  })
});

export const updateUserSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  }),
  body: z.object({
    name: z.string().trim().min(2).max(120).optional(),
    email: z.string().trim().email().toLowerCase().optional(),
    role: z.string().trim().min(2).max(80).optional()
  })
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8).max(72)
  })
});

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(120),
    email: z.string().trim().email().toLowerCase(),
    password: z.string().min(8).max(72),
    role: z.string().trim().min(2).max(80).default('MEMBER')
  })
});

export const updateUserStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  }),
  body: z.object({
    isActive: z.boolean()
  })
});
