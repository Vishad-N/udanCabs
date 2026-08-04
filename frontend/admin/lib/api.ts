import api from './axios';

export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },
  me: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
};

export const bookingsApi = {
  getAll: async (params?: any) => {
    const res = await api.get('/bookings', { params });
    return res.data;
  },
  getOne: async (id: string) => {
    const res = await api.get(`/bookings/${id}`);
    return res.data;
  },
  updateStatus: async (id: string, payload: { status: string; note?: string }) => {
    const res = await api.patch(`/bookings/${id}/status`, payload);
    return res.data;
  },
  update: async (id: string, payload: any) => {
    const res = await api.patch(`/bookings/${id}`, payload);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await api.delete(`/bookings/${id}`);
    return res.data;
  },
};
