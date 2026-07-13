import { useState, useCallback } from 'react';
import { activityService } from '@/services/activityService';
import type { Activity, ActivityCreate, ActivityUpdate } from '@/types';
import toast from 'react-hot-toast';

export function useActivities(tripId: string) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchActivities = useCallback(async (dayNumber?: number) => {
    setIsLoading(true);
    try {
      const data = await activityService.getActivities(tripId, dayNumber);
      setActivities(data);
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to fetch activities');
    } finally {
      setIsLoading(false);
    }
  }, [tripId]);

  const createActivity = useCallback(async (data: ActivityCreate) => {
    try {
      const newActivity = await activityService.createActivity(data);
      setActivities((prev) => [...prev, newActivity]);
      toast.success('Activity added!');
      return newActivity;
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to add activity');
      throw error;
    }
  }, []);

  const updateActivity = useCallback(async (activityId: string, data: ActivityUpdate) => {
    try {
      const updated = await activityService.updateActivity(activityId, data);
      setActivities((prev) => prev.map((a) => (a.id === activityId ? updated : a)));
      toast.success('Activity updated!');
      return updated;
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to update activity');
      throw error;
    }
  }, []);

  const deleteActivity = useCallback(async (activityId: string) => {
    try {
      await activityService.deleteActivity(activityId);
      setActivities((prev) => prev.filter((a) => a.id !== activityId));
      toast.success('Activity deleted');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to delete activity');
      throw error;
    }
  }, []);

  const reorderActivities = useCallback(async (dayNumber: number, activityIds: string[]) => {
    try {
      const reordered = await activityService.reorderActivities(tripId, dayNumber, activityIds);
      setActivities((prev) => {
        const map = new Map(reordered.map((a) => [a.id, a]));
        return prev.map((a) => map.get(a.id) || a);
      });
      return reordered;
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to reorder activities');
      throw error;
    }
  }, [tripId]);

  const activitiesByDay = activities.reduce<Record<number, Activity[]>>((acc, act) => {
    if (!acc[act.day_number]) acc[act.day_number] = [];
    acc[act.day_number].push(act);
    return acc;
  }, {});

  return { activities, activitiesByDay, isLoading, fetchActivities, createActivity, updateActivity, deleteActivity, reorderActivities };
}
