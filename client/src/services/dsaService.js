import api from './api';

export const dsaService = {
  getAll: (params) => api.get('/problems', { params }),
  getById: (id) => api.get(`/problems/${id}`),
  create: (data) => api.post('/problems', data),
  update: (id, data) => api.put(`/problems/${id}`, data),
  delete: (id) => api.delete(`/problems/${id}`),
};
