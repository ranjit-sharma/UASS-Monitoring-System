// src/modules/audit-logs/auditLog.controller.js
import { listAuditLogs } from '../services/auditLog.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess, buildPagination } from '../utils/response.js';

export const getAuditLogs = asyncHandler(async (req, res) => {
  const { page, limit, userId, action, resource, startDate, endDate } = req.query;
  const { logs, total } = await listAuditLogs({
    page,
    limit,
    userId,
    action,
    resource,
    startDate,
    endDate,
  });
  sendSuccess(res, 200, 'Audit logs retrieved', logs, {
    pagination: buildPagination(page, limit, total),
  });
});

