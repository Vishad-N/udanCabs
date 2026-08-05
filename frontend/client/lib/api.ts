import api from './axios';

export interface CreateBookingPayload {
  bookingType?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  pickupLocation?: string;
  dropoffLocation?: string;
  pickupDate?: string;
  pickupTime?: string;
  passengers?: number;
  vehicleCategory?: string;
  flightNumber?: string;
  tourPackageId?: string;
  rentalVehicleId?: string;
  rentalDuration?: string;
  licenseNumber?: string;
  notes?: string;
  totalFare?: number;
  pickupAddress?: string;
  pickupLatitude?: number;
  pickupLongitude?: number;
  destinationAddress?: string;
  destinationLatitude?: number;
  destinationLongitude?: number;
  distance?: number;
  estimatedDuration?: string;
  estimatedFare?: number;
  pricingSnapshot?: string;
  routePolyline?: string;
}

export const bookingApi = {
  create: async (payload: CreateBookingPayload) => {
    const response = await api.post('/bookings', payload);
    return response.data;
  },
  track: async (identifier: string) => {
    const response = await api.get(`/bookings/track/${encodeURIComponent(identifier)}`);
    return response.data;
  },
  cancelPublic: async (payload: { bookingNumber: string; customerPhone: string }) => {
    const response = await api.post('/bookings/cancel-public', payload);
    return response.data;
  },
};

export const mapsApi = {
  autocomplete: async (input: string) => {
    const response = await api.get('/maps/autocomplete', { params: { input } });
    return response.data;
  },
  geocode: async (params: { address?: string; lat?: number; lng?: number }) => {
    const response = await api.get('/maps/geocode', { params });
    return response.data;
  },
  calculateRoute: async (origin: string, destination: string) => {
    const response = await api.get('/maps/route', { params: { origin, destination } });
    return response.data;
  },
};

export const pricingApi = {
  estimate: async (params: { distance: number; duration?: number; pickupTime?: string; categoryId?: string }) => {
    const response = await api.get('/pricing/estimate', { params });
    return response.data;
  },
  getCategories: async () => {
    const response = await api.get('/pricing/public-categories');
    return response.data;
  },
};

export const settingsApi = {
  getPublic: async () => {
    const response = await api.get('/settings');
    return response.data;
  },
};

export const tourApi = {
  getPublic: async () => {
    const response = await api.get('/tours');
    return response.data;
  },
};

export const rentalApi = {
  getPublic: async () => {
    const response = await api.get('/rentals');
    return response.data;
  },
};
