// src/modules/audit-logs/auditLog.service.js
import { AuditLog } from '../models/auditLog.model.js';
import { logger } from '../utils/logger.js';

/**
 * Creates an audit log entry. Failures are logged but never thrown,
 * so an audit failure never breaks the primary operation.
 *
 * @param {object} params
 * @param {string|null} params.userId
 * @param {string} params.action - One of AUDIT_ACTIONS
 * @param {string} params.resource
 * @param {string|null} [params.resourceId]
 * @param {object} [params.metadata]
 */
export async function createAuditLog({ userId, action, resource, resourceId = null, metadata = {} }) {
  try {
    await AuditLog.create({ userId, action, resource, resourceId, metadata });
  } catch (err) {
    logger.error({ err }, 'Failed to write audit log');
  }
}

/**
 * Returns paginated audit logs with optional filters.
 */
export async function listAuditLogs({ page, limit, userId, action, resource, startDate, endDate }) {
  const filter = {};

  if (userId) filter.userId = userId;
  if (action) filter.action = action;
  if (resource) filter.resource = resource;
  if (startDate || endDate) {
    filter.timestamp = {};
    if (startDate) filter.timestamp.$gte = startDate;
    if (endDate) filter.timestamp.$lte = endDate;
  }

  const skip = (page - 1) * limit;
  const [logs, total] = await Promise.all([
    AuditLog.find(filter)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'name email role')
      .lean(),
    AuditLog.countDocuments(filter),
  ]);

  return { logs, total };
}

