// src/modules/data-collection/collection.schema.js
import { z } from 'zod';

export const startCollectionSchema = z.object({
  sessionName: z
    .string()
    .trim()
    .max(200, 'Session name cannot exceed 200 characters')
    .optional(),
});

export const collectionIdParamSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid collection ID'),
});

export const listCollectionsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(['idle', 'running', 'completed', 'failed']).optional(),
});

