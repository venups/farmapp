import api from './api';
import type { Trip, TripCreate, TripUpdate, TripListResponse } from '@/types';

export const tripService = {
  async getTrips(params?: {
    status?: string;
    page?: number;
    per_page?: number;
    sort_by?: string;
    sort_order?: string;
  }): Promise<TripListResponse> {
    const { data } = await api.get<TripListResponse>('/trips', { params });
    return data;
  },

  async getTrip(tripId: string): Promise<Trip> {
    const { data } = await api.get<Trip>(`/trips/${tripId}`);
    return data;
  },

  async createTrip(tripData: TripCreate): Promise<Trip> {
    const { data } = await api.post<Trip>('/trips', tripData);
    return data;
  },

  async updateTrip(tripId: string, tripData: TripUpdate): Promise<Trip> {
    const { data } = await api.put<Trip>(`/trips/${tripId}`, tripData);
    return data;
  },

  async deleteTrip(tripId: string): Promise<void> {
    await api.delete(`/trips/${tripId}`);
  },

  async addCollaborator(tripId: string, email: string): Promise<Trip> {
    const { data } = await api.post<Trip>(`/trips/${tripId}/collaborators`, { email });
    return data;
  },

  async removeCollaborator(tripId: string, userId: string): Promise<Trip> {
    const { data } = await api.delete<Trip>(`/trips/${tripId}/collaborators/${userId}`);
    return data;
  },

  async getTripOverview(tripId: string): Promise<any> {
    const { data } = await api.get(`/trips/${tripId}/overview`);
    return data;
  },
};
