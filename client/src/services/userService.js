// src/services/userService.js
import api from './api.js';

export const userService = {
  async list(params = {}) {
    const res = await api.get('/users', { params });
    return res.data;
  },

  async getById(id) {
    const res = await api.get(`/users/${id}`);
    return res.data.data;
  },

  async create(payload) {
    const res = await api.post('/users', payload);
    return res.data.data;
  },

  async update(id, payload) {
    const res = await api.patch(`/users/${id}`, payload);
    return res.data.data;
  },

  async deactivate(id) {
    const res = await api.delete(`/users/${id}`);
    return res.data.data;
  },

  async permanentlyDelete(id) {
    const res = await api.delete(`/users/${id}`, { params: { permanent: 'true' } });
    return res.data.data;
  },
};

