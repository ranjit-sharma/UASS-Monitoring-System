// src/services/authService.js
import api from './api.js';

export const authService = {
  async login({ email, password }) {
    const res = await api.post('/auth/login', { email, password });
    return res.data.data; // user object
  },

  async logout() {
    await api.post('/auth/logout');
  },

  async getMe() {
    const res = await api.get('/auth/me');
    return res.data.data;
  },
};
