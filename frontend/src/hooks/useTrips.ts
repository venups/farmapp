import { useState, useCallback } from 'react';
import { tripService } from '@/services/tripService';
import type { Trip, TripCreate, TripUpdate } from '@/types';
import toast from 'react-hot-toast';

export function useTrips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchTrips = useCallback(async (params?: {
    status?: string;
    page?: number;
    per_page?: number;
    sort_by?: string;
    sort_order?: string;
  }) => {
    setIsLoading(true);
    try {
      const data = await tripService.getTrips(params);
      setTrips(data.trips);
      setTotal(data.total);
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to fetch trips');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTrip = useCallback(async (data: TripCreate) => {
    try {
      const newTrip = await tripService.createTrip(data);
      setTrips((prev) => [newTrip, ...prev]);
      toast.success('Trip created!');
      return newTrip;
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to create trip');
      throw error;
    }
  }, []);

  const updateTrip = useCallback(async (tripId: string, data: TripUpdate) => {
    try {
      const updated = await tripService.updateTrip(tripId, data);
      setTrips((prev) => prev.map((t) => (t.id === tripId ? updated : t)));
      toast.success('Trip updated!');
      return updated;
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to update trip');
      throw error;
    }
  }, []);

  const deleteTrip = useCallback(async (tripId: string) => {
    try {
      await tripService.deleteTrip(tripId);
      setTrips((prev) => prev.filter((t) => t.id !== tripId));
      toast.success('Trip deleted');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to delete trip');
      throw error;
    }
  }, []);

  return { trips, isLoading, total, fetchTrips, createTrip, updateTrip, deleteTrip };
}
