import api from './api';
import type { Activity, ActivityCreate, ActivityUpdate } from '@/types';

export const activityService = {
  async getActivities(tripId: string, dayNumber?: number): Promise<Activity[]> {
    const params = dayNumber !== undefined ? { day_number: dayNumber } : {};
    const { data } = await api.get<Activity[]>(`/trips/${tripId}/activities`, { params });
    return data;
  },

  async getActivity(activityId: string): Promise<Activity> {
    const { data } = await api.get<Activity>(`/activities/${activityId}`);
    return data;
  },

  async createActivity(activityData: ActivityCreate): Promise<Activity> {
    const { data } = await api.post<Activity>('/activities', activityData);
    return data;
  },

  async updateActivity(activityId: string, data: ActivityUpdate): Promise<Activity> {
    const { data: updated } = await api.put<Activity>(`/activities/${activityId}`, data);
    return updated;
  },

  async deleteActivity(activityId: string): Promise<void> {
    await api.delete(`/activities/${activityId}`);
  },

  async reorderActivities(tripId: string, dayNumber: number, activityIds: string[]): Promise<Activity[]> {
    const { data } = await api.post<Activity[]>(`/trips/${tripId}/activities/reorder`, {
      day_number: dayNumber,
      activity_ids: activityIds,
    });
    return data;
  },
};
