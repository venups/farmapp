import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

export const tripService = {
  getAll: () => apiClient.get('/trips'),
  getOne: (id) => apiClient.get(`/trips/${id}`),
  create: (data) => apiClient.post('/trips', data),
  update: (id, data) => apiClient.put(`/trips/${id}`, data),
  delete: (id) => apiClient.delete(`/trips/${id}`),
};

export const itineraryService = {
  getByTrip: (tripId) => apiClient.get(`/trips/${tripId}/itinerary`),
  create: (tripId, data) => apiClient.post(`/trips/${tripId}/itinerary`, data),
  update: (id, data) => apiClient.put(`/itinerary/${id}`, data),
  delete: (id) => apiClient.delete(`/itinerary/${id}`),
};

export const budgetService = {
  getByTrip: (tripId) => apiClient.get(`/trips/${tripId}/budget`),
  create: (tripId, data) => apiClient.post(`/trips/${tripId}/budget`, data),
  update: (id, data) => apiClient.put(`/budget/${id}`, data),
  delete: (id) => apiClient.delete(`/budget/${id}`),
};

export const checklistService = {
  getByTrip: (tripId) => apiClient.get(`/trips/${tripId}/checklist`),
  create: (tripId, data) => apiClient.post(`/trips/${tripId}/checklist`, data),
  update: (id, data) => apiClient.put(`/checklist/${id}`, data),
  delete: (id) => apiClient.delete(`/checklist/${id}`),
};
