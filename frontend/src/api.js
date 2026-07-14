import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const apiClient = {
  health: () => api.get('/api/health'),

  trips: {
    list: () => api.get('/api/trips'),
    get: (id) => api.get(`/api/trips/${id}`),
    create: (data) => api.post('/api/trips', data),
    update: (id, data) => api.put(`/api/trips/${id}`, data),
    delete: (id) => api.delete(`/api/trips/${id}`),
    dashboard: () => api.get('/api/trips/dashboard'),
  },

  budget: {
    add: (tripId, data) => api.post(`/api/trips/${tripId}/budget`, data),
    delete: (tripId, itemId) => api.delete(`/api/trips/${tripId}/budget/${itemId}`),
  },

  checklist: {
    add: (tripId, data) => api.post(`/api/trips/${tripId}/checklist`, data),
    toggle: (tripId, itemId) => api.put(`/api/trips/${tripId}/checklist/${itemId}/toggle`),
    delete: (tripId, itemId) => api.delete(`/api/trips/${tripId}/checklist/${itemId}`),
  },

  itinerary: {
    addDay: (tripId, data) => api.post(`/api/trips/${tripId}/itinerary`, data),
    addActivity: (tripId, dayIndex, data) => api.post(`/api/trips/${tripId}/itinerary/${dayIndex}/activities`, data),
  },
}

export default apiClient
