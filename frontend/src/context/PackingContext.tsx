import { createContext, useContext, useReducer, ReactNode, useCallback } from 'react';
import toast from 'react-hot-toast';
import { packingService } from '@/services/packingService';
import type { PackingItem, PackingItemCreate, PackingListResponse } from '@/types';

interface PackingState {
  packingItems: PackingItem[];
  isLoading: boolean;
  error: string | null;
}

type PackingAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ITEMS'; payload: PackingItem[] }
  | { type: 'ADD_ITEM'; payload: PackingItem }
  | { type: 'UPDATE_ITEM'; payload: PackingItem }
  | { type: 'DELETE_ITEM'; payload: string }
  | { type: 'TOGGLE_PACKED'; payload: PackingItem }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: PackingState = {
  packingItems: [],
  isLoading: false,
  error: null,
};

function packingReducer(state: PackingState, action: PackingAction): PackingState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ITEMS':
      return { ...state, packingItems: action.payload };
    case 'ADD_ITEM':
      return { ...state, packingItems: [...state.packingItems, action.payload] };
    case 'UPDATE_ITEM':
      return {
        ...state,
        packingItems: state.packingItems.map((i) => (i.id === action.payload.id ? action.payload : i)),
      };
    case 'DELETE_ITEM':
      return { ...state, packingItems: state.packingItems.filter((i) => i.id !== action.payload) };
    case 'TOGGLE_PACKED':
      return {
        ...state,
        packingItems: state.packingItems.map((i) =>
          i.id === action.payload.id ? action.payload : i
        ),
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

interface PackingContextType extends PackingState {
  fetchPackingList: (tripId: string) => Promise<void>;
  createItem: (data: PackingItemCreate) => Promise<PackingItem | null>;
  updateItem: (itemId: string, data: Partial<PackingItem>) => Promise<PackingItem | null>;
  deleteItem: (itemId: string) => Promise<void>;
  togglePacked: (itemId: string) => Promise<PackingItem | null>;
}

const PackingContext = createContext<PackingContextType | undefined>(undefined);

export function PackingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(packingReducer, initialState);

  const fetchPackingList = useCallback(async (tripId: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await packingService.getPackingList(tripId);
      dispatch({ type: 'SET_ITEMS', payload: response.items });
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to fetch packing list');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const createItem = useCallback(async (data: PackingItemCreate) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const item = await packingService.createItem(data);
      dispatch({ type: 'ADD_ITEM', payload: item });
      toast.success('Packing item added');
      return item;
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Failed to create packing item';
      toast.error(message);
      return null;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const updateItem = useCallback(async (itemId: string, data: Partial<PackingItem>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const item = await packingService.updateItem(itemId, data);
      dispatch({ type: 'UPDATE_ITEM', payload: item });
      toast.success('Packing item updated');
      return item;
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Failed to update packing item';
      toast.error(message);
      return null;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const deleteItem = useCallback(async (itemId: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await packingService.deleteItem(itemId);
      dispatch({ type: 'DELETE_ITEM', payload: itemId });
      toast.success('Packing item deleted');
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Failed to delete packing item';
      toast.error(message);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const togglePacked = useCallback(async (itemId: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const item = await packingService.togglePacked(itemId);
      dispatch({ type: 'TOGGLE_PACKED', payload: item });
      toast.success(`Item marked as ${item.is_packed ? 'packed' : 'unpacked'}`);
      return item;
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Failed to update packing item';
      toast.error(message);
      return null;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  return (
    <PackingContext.Provider
      value={{
        ...state,
        fetchPackingList,
        createItem,
        updateItem,
        deleteItem,
        togglePacked,
      }}
    >
      {children}
    </PackingContext.Provider>
  );
}

export function usePacking() {
  const context = useContext(PackingContext);
  if (!context) throw new Error('usePacking must be used within PackingProvider');
  return context;
}
