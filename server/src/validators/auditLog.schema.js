// src/modules/audit-logs/auditLog.schema.js
import { z } from 'zod';
import { AUDIT_ACTIONS } from '../models/auditLog.model.js';

export const listAuditLogsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  userId: z
    .string()
    .regex(/^[a-f\d]{24}$/i, 'Invalid user ID')
    .optional(),
  action: z.enum(Object.values(AUDIT_ACTIONS)).optional(),
  resource: z.string().trim().max(100).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
}).refine(
  (data) =>
    !data.startDate || !data.endDate || data.startDate <= data.endDate,
  { message: 'startDate must be before or equal to endDate', path: ['startDate'] }
);

