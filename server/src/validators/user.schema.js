// src/modules/users/user.schema.js
import { z } from 'zod';

const ROLES = ['admin', 'operator', 'viewer'];

export const createUserSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email address')
    .max(254, 'Email too long')
    .toLowerCase()
    .trim(),
  password: z
    .string({ required_error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long'),
  role: z.enum(ROLES, { errorMap: () => ({ message: 'Role must be admin, operator, or viewer' }) }),
});

export const updateUserSchema = z
  .object({
    name: z.string().trim().min(2).max(100).optional(),
    role: z.enum(ROLES).optional(),
    isActive: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

export const userIdParamSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid user ID'),
});

export const listUsersQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  role: z.enum(ROLES).optional(),
  isActive: z
    .string()
    .transform((v) => v === 'true')
    .optional(),
});

