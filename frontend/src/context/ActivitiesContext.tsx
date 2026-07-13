import { createContext, useContext, useReducer, ReactNode, useCallback } from 'react';
import toast from 'react-hot-toast';
import { activityService } from '@/services/activityService';
import type { Activity, ActivityCreate, ActivityUpdate } from '@/types';

interface ActivitiesState {
  activities: Map<number, Activity[]>;
  isLoading: boolean;
  error: string | null;
}

type ActivitiesAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ACTIVITIES'; payload: { dayNumber: number; activities: Activity[] } }
  | { type: 'ADD_ACTIVITY'; payload: Activity }
  | { type: 'UPDATE_ACTIVITY'; payload: Activity }
  | { type: 'DELETE_ACTIVITY'; payload: string }
  | { type: 'REORDER_ACTIVITIES'; payload: { dayNumber: number; activities: Activity[] } }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: ActivitiesState = {
  activities: new Map<number, Activity[]>(),
  isLoading: false,
  error: null,
};

function activitiesReducer(state: ActivitiesState, action: ActivitiesAction): ActivitiesState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ACTIVITIES': {
      const newMap = new Map(state.activities);
      newMap.set(action.payload.dayNumber, action.payload.activities);
      return { ...state, activities: newMap };
    }
    case 'ADD_ACTIVITY': {
      const dayNumber = action.payload.day_number;
      const existing = state.activities.get(dayNumber) || [];
      return {
        ...state,
        activities: new Map(state.activities).set(dayNumber, [...existing, action.payload]),
      };
    }
    case 'UPDATE_ACTIVITY': {
      const dayNumber = action.payload.day_number;
      const existing = state.activities.get(dayNumber) || [];
      return {
        ...state,
        activities: new Map(state.activities).set(dayNumber, existing.map((a) => (a.id === action.payload.id ? action.payload : a))),
      };
    }
    case 'DELETE_ACTIVITY': {
      const newMap = new Map(state.activities);
      for (const [dayNumber, dayActivities] of newMap.entries()) {
        if (dayActivities.some((a) => a.id === action.payload)) {
          newMap.set(dayNumber, dayActivities.filter((a) => a.id !== action.payload));
        }
      }
      return { ...state, activities: newMap };
    }
    case 'REORDER_ACTIVITIES': {
      const newMap = new Map(state.activities);
      newMap.set(action.payload.dayNumber, action.payload.activities);
      return { ...state, activities: newMap };
    }
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

interface ActivitiesContextType extends ActivitiesState {
  fetchActivities: (tripId: string, dayNumber?: number) => Promise<void>;
  createActivity: (data: ActivityCreate) => Promise<Activity | null>;
  updateActivity: (activityId: string, data: ActivityUpdate) => Promise<Activity | null>;
  deleteActivity: (activityId: string) => Promise<void>;
  reorderActivities: (tripId: string, dayNumber: number, activityIds: string[]) => Promise<void>;
}

const ActivitiesContext = createContext<ActivitiesContextType | undefined>(undefined);

export function ActivitiesProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(activitiesReducer, initialState);

  const fetchActivities = useCallback(async (tripId: string, dayNumber?: number) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const activities = await activityService.getActivities(tripId, dayNumber);
      if (dayNumber !== undefined) {
        dispatch({ type: 'SET_ACTIVITIES', payload: { dayNumber, activities } });
      } else {
        const grouped = new Map<number, Activity[]>();
        activities.forEach((a) => {
          const day = a.day_number;
          if (!grouped.has(day)) grouped.set(day, []);
          grouped.get(day)?.push(a);
        });
        dispatch({ type: 'SET_ACTIVITIES', payload: { dayNumber: 1, activities: grouped.get(1) || [] } });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to fetch activities');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const createActivity = useCallback(async (data: ActivityCreate) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const activity = await activityService.createActivity(data);
      dispatch({ type: 'ADD_ACTIVITY', payload: activity });
      toast.success('Activity added');
      return activity;
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Failed to create activity';
      toast.error(message);
      return null;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const updateActivity = useCallback(async (activityId: string, data: ActivityUpdate) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const activity = await activityService.updateActivity(activityId, data);
      dispatch({ type: 'UPDATE_ACTIVITY', payload: activity });
      toast.success('Activity updated');
      return activity;
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Failed to update activity';
      toast.error(message);
      return null;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const deleteActivity = useCallback(async (activityId: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await activityService.deleteActivity(activityId);
      dispatch({ type: 'DELETE_ACTIVITY', payload: activityId });
      toast.success('Activity deleted');
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Failed to delete activity';
      toast.error(message);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const reorderActivities = useCallback(async (tripId: string, dayNumber: number, activityIds: string[]) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const activities = await activityService.reorderActivities(tripId, dayNumber, activityIds);
      dispatch({ type: 'REORDER_ACTIVITIES', payload: { dayNumber, activities } });
      toast.success('Activities reordered');
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Failed to reorder activities';
      toast.error(message);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  return (
    <ActivitiesContext.Provider
      value={{
        ...state,
        fetchActivities,
        createActivity,
        updateActivity,
        deleteActivity,
        reorderActivities,
      }}
    >
      {children}
    </ActivitiesContext.Provider>
  );
}

export function useActivities() {
  const context = useContext(ActivitiesContext);
  if (!context) throw new Error('useActivities must be used within ActivitiesProvider');
  return context;
}
