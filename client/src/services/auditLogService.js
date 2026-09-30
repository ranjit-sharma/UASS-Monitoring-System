// src/services/auditLogService.js
import api from './api.js';

export const auditLogService = {
  async list(params = {}) {
    const res = await api.get('/audit-logs', { params });
    return res.data;
  },
};
