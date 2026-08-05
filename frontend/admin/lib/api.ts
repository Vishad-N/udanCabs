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

export const dashboardApi = {
  getStatistics: async () => {
    const res = await api.get('/dashboard/statistics');
    return res.data;
  },
};

export const auditApi = {
  getAll: async (params?: any) => {
    const res = await api.get('/audit', { params });
    return res.data;
  },
};

export const settingsApi = {
  getAll: async () => {
    const res = await api.get('/settings');
    return res.data;
  },
  bulkUpdate: async (payload: any) => {
    const res = await api.post('/settings/bulk', payload);
    return res.data;
  },
};

export const driversApi = {
  getAll: async (params?: any) => {
    const res = await api.get('/drivers', { params });
    return res.data;
  },
  getOne: async (id: string) => {
    const res = await api.get(`/drivers/${id}`);
    return res.data;
  },
  create: async (payload: any) => {
    const res = await api.post('/drivers', payload);
    return res.data;
  },
  update: async (id: string, payload: any) => {
    const res = await api.patch(`/drivers/${id}`, payload);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await api.delete(`/drivers/${id}`);
    return res.data;
  },
  getAvailable: async () => {
    const res = await api.get('/drivers/available');
    return res.data;
  },
};

export const vehiclesApi = {
  getAll: async (params?: any) => {
    const res = await api.get('/vehicles', { params });
    return res.data;
  },
  getOne: async (id: string) => {
    const res = await api.get(`/vehicles/${id}`);
    return res.data;
  },
  create: async (payload: any) => {
    const res = await api.post('/vehicles', payload);
    return res.data;
  },
  update: async (id: string, payload: any) => {
    const res = await api.patch(`/vehicles/${id}`, payload);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await api.delete(`/vehicles/${id}`);
    return res.data;
  },
  getAvailable: async () => {
    const res = await api.get('/vehicles/available');
    return res.data;
  },
};

export const tourApi = {
  getAll: async (params?: any) => {
    const res = await api.get('/tours', { params });
    return res.data;
  },
  getOne: async (id: string) => {
    const res = await api.get(`/tours/${id}`);
    return res.data;
  },
  create: async (payload: any) => {
    const res = await api.post('/tours', payload);
    return res.data;
  },
  update: async (id: string, payload: any) => {
    const res = await api.patch(`/tours/${id}`, payload);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await api.delete(`/tours/${id}`);
    return res.data;
  },
};

export const rentalApi = {
  getAll: async (params?: any) => {
    const res = await api.get('/rentals', { params });
    return res.data;
  },
  getOne: async (id: string) => {
    const res = await api.get(`/rentals/${id}`);
    return res.data;
  },
  create: async (payload: any) => {
    const res = await api.post('/rentals', payload);
    return res.data;
  },
  update: async (id: string, payload: any) => {
    const res = await api.patch(`/rentals/${id}`, payload);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await api.delete(`/rentals/${id}`);
    return res.data;
  },
};

export const dispatchApi = {
  assignDriver: async (payload: { bookingId: string; driverId: string; vehicleId: string; note?: string }) => {
    const res = await api.post('/dispatch/assign', payload);
    return res.data;
  },
  changeDriver: async (payload: { bookingId: string; newDriverId: string; newVehicleId?: string; note?: string }) => {
    const res = await api.post('/dispatch/change-driver', payload);
    return res.data;
  },
};
