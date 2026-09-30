// src/services/observationService.js
import api from './api.js';

export const observationService = {
  async list(params = {}) {
    const res = await api.get('/observations', { params });
    return res.data; // { data, pagination }
  },

  async getById(id) {
    const res = await api.get(`/observations/${id}`);
    return res.data.data;
  },

  async create(payload) {
    const res = await api.post('/observations', payload);
    return res.data.data;
  },

  async update(id, payload) {
    const res = await api.patch(`/observations/${id}`, payload);
    return res.data.data;
  },

  async delete(id) {
    await api.delete(`/observations/${id}`);
  },

  async deleteByFilter(params) {
    const res = await api.delete('/observations/filter', { params });
    return res.data;
  },

  async restore(id) {
    const res = await api.post(`/observations/${id}/restore`);
    return res.data;
  },

  async deleteAll() {
    await api.delete('/observations/all');
  },

  // Returns a URL for the browser to navigate to for CSV or Excel download
  getExportUrl(params = {}, format = 'csv') {
    const cleanParams = { ...params, format };
    Object.keys(cleanParams).forEach((k) => cleanParams[k] === undefined && delete cleanParams[k]);
    const query = new URLSearchParams(cleanParams).toString();
    return `/api/v1/observations/export${query ? `?${query}` : ''}`;
  },
};


