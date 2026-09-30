// src/routes/auditLog.routes.js
import { Router } from 'express';
import { getAuditLogs } from '../controllers/auditLog.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import { listAuditLogsQuerySchema } from '../validators/auditLog.schema.js';

export const auditLogRouter = Router();

auditLogRouter.use(authenticate, authorize('admin'));
auditLogRouter.get('/', validate(listAuditLogsQuerySchema, 'query'), getAuditLogs);

