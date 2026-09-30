// src/services/dashboardService.js
import api from './api.js';

export const dashboardService = {
  async getSummary() {
    const res = await api.get('/dashboard/summary');
    return res.data.data;
  },

  async getLatest(limit = 50) {
    const res = await api.get('/dashboard/latest', { params: { limit } });
    return res.data.data;
  },
};
