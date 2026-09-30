// src/services/collectionService.js
import api from './api.js';

export const collectionService = {
  async list(params = {}) {
    const res = await api.get('/collections', { params });
    return res.data;
  },

  async getById(id) {
    const res = await api.get(`/collections/${id}`);
    return res.data.data;
  },

  async start(payload = {}) {
    const res = await api.post('/collections/start', payload);
    return res.data.data;
  },

  async stop(id) {
    const res = await api.post(`/collections/${id}/stop`);
    return res.data.data;
  },
};
