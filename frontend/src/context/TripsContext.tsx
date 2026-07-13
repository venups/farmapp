import { createContext, useContext, useReducer, ReactNode, useCallback } from 'react';
import toast from 'react-hot-toast';
import { tripService } from '@/services/tripService';
import type { Trip, TripCreate, TripUpdate, TripListResponse } from '@/types';

interface TripsState {
  trips: Trip[];
  currentTrip: Trip | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    per_page: number;
    total: number;
  };
}

type TripsAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_TRIPS'; payload: Trip[] }
  | { type: 'SET_CURRENT_TRIP'; payload: Trip }
  | { type: 'ADD_TRIP'; payload: Trip }
  | { type: 'UPDATE_TRIP'; payload: Trip }
  | { type: 'DELETE_TRIP'; payload: string }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_PAGINATION'; payload: Partial<TripsState['pagination']> };

const initialState: TripsState = {
  trips: [],
  currentTrip: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    per_page: 9,
    total: 0,
  },
};

function tripsReducer(state: TripsState, action: TripsAction): TripsState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_TRIPS':
      return { ...state, trips: action.payload };
    case 'SET_CURRENT_TRIP':
      return { ...state, currentTrip: action.payload };
    case 'ADD_TRIP':
      return { ...state, trips: [action.payload, ...state.trips] };
    case 'UPDATE_TRIP':
      return {
        ...state,
        trips: state.trips.map((t) => (t.id === action.payload.id ? action.payload : t)),
        currentTrip: state.currentTrip?.id === action.payload.id ? action.payload : state.currentTrip,
      };
    case 'DELETE_TRIP':
      return {
        ...state,
        trips: state.trips.filter((t) => t.id !== action.payload),
        currentTrip: state.currentTrip?.id === action.payload ? null : state.currentTrip,
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_PAGINATION':
      return { ...state, pagination: { ...state.pagination, ...action.payload } };
    default:
      return state;
  }
}

interface TripsContextType extends TripsState {
  fetchTrips: (params?: any) => Promise<void>;
  fetchTripById: (tripId: string) => Promise<void>;
  createTrip: (data: TripCreate) => Promise<Trip | null>;
  updateTrip: (tripId: string, data: TripUpdate) => Promise<Trip | null>;
  deleteTrip: (tripId: string) => Promise<void>;
}

const TripsContext = createContext<TripsContextType | undefined>(undefined);

export function TripsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(tripsReducer, initialState);

  const fetchTrips = useCallback(async (params?: any) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await tripService.getTrips(params);
      dispatch({ type: 'SET_TRIPS', payload: response.trips });
      dispatch({ type: 'SET_PAGINATION', payload: { page: response.page, total: response.total, per_page: response.per_page } });
      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.detail || 'Failed to fetch trips' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const fetchTripById = useCallback(async (tripId: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const trip = await tripService.getTrip(tripId);
      dispatch({ type: 'SET_CURRENT_TRIP', payload: trip });
      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.detail || 'Failed to fetch trip' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const createTrip = useCallback(async (data: TripCreate) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const trip = await tripService.createTrip(data);
      dispatch({ type: 'ADD_TRIP', payload: trip });
      toast.success('Trip created successfully');
      return trip;
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Failed to create trip';
      toast.error(message);
      dispatch({ type: 'SET_ERROR', payload: message });
      return null;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const updateTrip = useCallback(async (tripId: string, data: TripUpdate) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const trip = await tripService.updateTrip(tripId, data);
      dispatch({ type: 'UPDATE_TRIP', payload: trip });
      toast.success('Trip updated successfully');
      return trip;
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Failed to update trip';
      toast.error(message);
      dispatch({ type: 'SET_ERROR', payload: message });
      return null;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const deleteTrip = useCallback(async (tripId: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await tripService.deleteTrip(tripId);
      dispatch({ type: 'DELETE_TRIP', payload: tripId });
      toast.success('Trip deleted successfully');
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Failed to delete trip';
      toast.error(message);
      dispatch({ type: 'SET_ERROR', payload: message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  return (
    <TripsContext.Provider
      value={{
        ...state,
        fetchTrips,
        fetchTripById,
        createTrip,
        updateTrip,
        deleteTrip,
      }}
    >
      {children}
    </TripsContext.Provider>
  );
}

export function useTrips() {
  const context = useContext(TripsContext);
  if (!context) throw new Error('useTrips must be used within TripsProvider');
  return context;
}
