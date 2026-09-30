// src/modules/audit-logs/auditLog.model.js
import mongoose from 'mongoose';

/**
 * Valid audit actions. Keeping this as a constant prevents
 * arbitrary strings from being inserted into the audit log.
 */
export const AUDIT_ACTIONS = {
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  USER_CREATED: 'USER_CREATED',
  USER_UPDATED: 'USER_UPDATED',
  USER_DEACTIVATED: 'USER_DEACTIVATED',
  ROLE_CHANGED: 'ROLE_CHANGED',
  OBSERVATION_CREATED: 'OBSERVATION_CREATED',
  OBSERVATION_UPDATED: 'OBSERVATION_UPDATED',
  OBSERVATION_DELETED: 'OBSERVATION_DELETED',
  COLLECTION_STARTED: 'COLLECTION_STARTED',
  COLLECTION_STOPPED: 'COLLECTION_STOPPED',
};

const auditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // null for failed logins where user may not exist
    },
    action: {
      type: String,
      enum: { values: Object.values(AUDIT_ACTIONS), message: 'Invalid audit action' },
      required: [true, 'Action is required'],
      index: true,
    },
    resource: {
      type: String,
      required: [true, 'Resource is required'],
      trim: true,
    },
    resourceId: {
      type: String,
      default: null,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { versionKey: false } // no __v for audit logs
);

// Compound index for common audit queries
auditLogSchema.index({ userId: 1, timestamp: -1 });
auditLogSchema.index({ action: 1, timestamp: -1 });

export const AuditLog = mongoose.model('AuditLog', auditLogSchema);

