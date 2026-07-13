# Skill 10: State Management & API Integration

> **Goal**: Implement the complete frontend state management system using React Context + useReducer, create the API service layer with Axios, and connect every frontend page to the real backend API. After this skill, the frontend and backend should be fully integrated.

---

## Step 10.1: Axios API Client

### File: `frontend/src/services/api.ts`

Create a centralized Axios instance and interceptors:

```typescript
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor: attach JWT token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('tripforge_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ detail: string }>) => {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.detail || 'An error occurred';
      
      if (status === 401) {
        // Token expired or invalid — clear auth and redirect to login
        localStorage.removeItem('tripforge_token');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
          toast.error('Session expired. Please log in again.');
        }
      } else if (status === 403) {
        toast.error('You do not have permission to perform this action.');
      } else if (status >= 500) {
        toast.error('Server error. Please try again later.');
      }
      // Don't toast for 400/404 — let the calling code handle those
    } else if (error.request) {
      toast.error('Network error. Please check your connection.');
    }
    
    return Promise.reject(error);
  }
);

export default api;
```

---

## Step 10.2: API Service Functions

Create service modules that wrap API calls. Each function should handle the request and return typed data.

### File: `frontend/src/services/authService.ts`

```typescript
import api from './api';
import type { AuthResponse, LoginCredentials, RegisterData, User, UserUpdate } from '@/types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials);
    return data;
  },

  async register(userData: RegisterData): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/register', userData);
    return data;
  },

  async getMe(): Promise<User> {
    const { data } = await api.get<User>('/auth/me');
    return data;
  },

  async verifyToken(): Promise<{ valid: boolean; user: User }> {
    const { data } = await api.post('/auth/verify-token');
    return data;
  },

  async updateProfile(updates: UserUpdate): Promise<User> {
    const { data } = await api.put<User>('/users/profile', updates);
    return data;
  },

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await api.put('/users/change-password', { old_password: oldPassword, new_password: newPassword });
  },

  async deleteAccount(password: string): Promise<void> {
    await api.delete('/users/account', { data: { password } });
  },

  async searchUsers(query: string): Promise<User[]> {
    const { data } = await api.get<User[]>('/users/search', { params: { q: query } });
    return data;
  },
};
```

### File: `frontend/src/services/tripService.ts`

```typescript
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
```

### File: `frontend/src/services/activityService.ts`

```typescript
export const activityService = {
  async getActivities(tripId: string, dayNumber?: number): Promise<Activity[]> { ... },
  async getActivity(activityId: string): Promise<Activity> { ... },
  async createActivity(activityData: ActivityCreate): Promise<Activity> { ... },
  async updateActivity(activityId: string, data: ActivityUpdate): Promise<Activity> { ... },
  async deleteActivity(activityId: string): Promise<void> { ... },
  async reorderActivities(tripId: string, dayNumber: number, activityIds: string[]): Promise<Activity[]> { ... },
};
```

### File: `frontend/src/services/expenseService.ts`

```typescript
export const expenseService = {
  async getExpenses(tripId: string, category?: string): Promise<Expense[]> { ... },
  async getExpense(expenseId: string): Promise<Expense> { ... },
  async createExpense(data: ExpenseCreate): Promise<Expense> { ... },
  async updateExpense(expenseId: string, data: ExpenseUpdate): Promise<Expense> { ... },
  async deleteExpense(expenseId: string): Promise<void> { ... },
  async getExpenseSummary(tripId: string): Promise<ExpenseSummary> { ... },
};
```

### File: `frontend/src/services/packingService.ts`

```typescript
export const packingService = {
  async getPackingList(tripId: string): Promise<PackingListResponse> { ... },
  async createItem(data: PackingItemCreate): Promise<PackingItem> { ... },
  async updateItem(itemId: string, data: PackingItemUpdate): Promise<PackingItem> { ... },
  async deleteItem(itemId: string): Promise<void> { ... },
  async togglePacked(itemId: string): Promise<PackingItem> { ... },
  async bulkCreate(tripId: string, items: PackingItemCreate[]): Promise<PackingItem[]> { ... },
};
```

### File: `frontend/src/services/uploadService.ts`

```typescript
export const uploadService = {
  async uploadImage(file: File): Promise<{ url: string; filename: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post('/uploads/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  async deleteImage(filename: string): Promise<void> {
    await api.delete(`/uploads/image/${filename}`);
  },
};
```

---

## Step 10.3: Auth Context (Full Implementation)

### File: `frontend/src/context/AuthContext.tsx`

**Replace the stub from Skill 06** with the full implementation:

```typescript
import { createContext, useContext, useReducer, useEffect, ReactNode, useCallback } from 'react';
import { authService } from '@/services/authService';
import type { User, LoginCredentials, RegisterData, UserUpdate } from '@/types';
import toast from 'react-hot-toast';

// State
interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Actions
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'LOGOUT' };

// Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: true, isLoading: false };
    case 'UPDATE_USER':
      return { ...state, user: state.user ? { ...state.user, ...action.payload } : null };
    case 'LOGOUT':
      return { user: null, isLoading: false, isAuthenticated: false };
    default:
      return state;
  }
}

// Context
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: UserUpdate) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isLoading: true, // Start as loading to check existing token
    isAuthenticated: false,
  });

  // Check for existing token on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('tripforge_token');
      if (token) {
        try {
          const user = await authService.getMe();
          dispatch({ type: 'SET_USER', payload: user });
        } catch {
          localStorage.removeItem('tripforge_token');
          dispatch({ type: 'LOGOUT' });
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    initAuth();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await authService.login(credentials);
      localStorage.setItem('tripforge_token', response.access_token);
      dispatch({ type: 'SET_USER', payload: response.user });
      toast.success(`Welcome back, ${response.user.full_name}!`);
    } catch (error: any) {
      dispatch({ type: 'SET_LOADING', payload: false });
      const message = error.response?.data?.detail || 'Login failed';
      toast.error(message);
      throw error;
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await authService.register(data);
      localStorage.setItem('tripforge_token', response.access_token);
      dispatch({ type: 'SET_USER', payload: response.user });
      toast.success('Account created successfully!');
    } catch (error: any) {
      dispatch({ type: 'SET_LOADING', payload: false });
      const message = error.response?.data?.detail || 'Registration failed';
      toast.error(message);
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('tripforge_token');
    dispatch({ type: 'LOGOUT' });
    toast.success('Logged out successfully');
  }, []);

  const updateProfile = useCallback(async (data: UserUpdate) => {
    try {
      const updatedUser = await authService.updateProfile(data);
      dispatch({ type: 'SET_USER', payload: updatedUser });
      toast.success('Profile updated!');
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Update failed';
      toast.error(message);
      throw error;
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
```

---

## Step 10.4: Custom Hooks

### File: `frontend/src/hooks/useDebounce.ts`
```typescript
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
}
```

### File: `frontend/src/hooks/useTrips.ts`
A custom hook for trip operations:
```typescript
export function useTrips() {
  // State: trips, isLoading, error, pagination
  // Functions: fetchTrips, createTrip, updateTrip, deleteTrip
  // Uses tripService
  // Returns: { trips, isLoading, error, totalPages, page, fetchTrips, createTrip, ... }
}
```

### File: `frontend/src/hooks/useActivities.ts`
```typescript
export function useActivities(tripId: string) {
  // State: activities (grouped by day), isLoading
  // Functions: fetchActivities, createActivity, updateActivity, deleteActivity, reorderActivities
  // Returns: { activitiesByDay, isLoading, createActivity, ... }
}
```

### File: `frontend/src/hooks/useExpenses.ts`
```typescript
export function useExpenses(tripId: string) {
  // State: expenses, summary, isLoading
  // Functions: fetchExpenses, createExpense, updateExpense, deleteExpense, fetchSummary
}
```

### File: `frontend/src/hooks/usePacking.ts`
```typescript
export function usePacking(tripId: string) {
  // State: packingList (with stats), isLoading
  // Functions: fetchList, createItem, updateItem, deleteItem, togglePacked, bulkCreate
}
```

### File: `frontend/src/hooks/useLocalStorage.ts`
```typescript
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // Generic local storage hook
}
```

---

## Step 10.5: Connect Pages to API

Now go through **every page** and connect it to the real API:

### LoginPage.tsx
- Import `useAuth`
- On form submit, call `login(credentials)`
- Handle loading state
- On success, navigate to dashboard (use `useNavigate`)
- Show error toast on failure

### RegisterPage.tsx
- Import `useAuth`
- On form submit, call `register(data)`
- Handle loading state
- On success, navigate to dashboard

### DashboardPage.tsx
- Import `useTrips` hook
- Fetch trips on mount
- Calculate stats from trips data
- Display real data instead of placeholders

### TripsPage.tsx
- Import `useTrips` hook
- Fetch trips with filters and pagination
- Search triggers re-fetch with debounce
- Status filter triggers re-fetch
- Sort triggers re-fetch

### TripDetailPage.tsx
- Fetch trip by ID using `tripService.getTrip(tripId)`
- Fetch activities, expenses, packing data for each tab
- Handle loading and 404 states
- Delete trip with confirmation

### TripCreatePage.tsx
- On form submit, call `tripService.createTrip(data)`
- Navigate to the new trip on success

### TripEditPage.tsx
- Fetch existing trip, populate form
- On submit, call `tripService.updateTrip(tripId, data)`
- Navigate to trip detail on success

### ItineraryPage.tsx
- Import `useActivities` hook
- Fetch activities on mount
- Handle drag-and-drop → call `reorderActivities`
- Add/Edit/Delete activities via modals

### ExpensesPage.tsx
- Import `useExpenses` hook
- Fetch expenses and summary on mount
- Add/Edit/Delete expenses via modals
- Refresh summary after changes

### PackingPage.tsx
- Import `usePacking` hook
- Fetch packing list on mount
- Toggle packed via API
- Add/Edit/Delete items
- Bulk template creation

### ProfilePage.tsx
- Import `useAuth`
- Display current user data
- Update profile via `updateProfile`
- Change password via `authService.changePassword`
- Delete account via `authService.deleteAccount`

---

## Step 10.6: Add Loading and Error States to All Pages

Every page must have:
1. **Loading state**: Show `<Skeleton />` components matching the page layout while data is loading
2. **Error state**: Show an error message with a "Retry" button if the API call fails
3. **Empty state**: Show `<EmptyState />` when lists are empty
4. **Success feedback**: Show toast notifications on successful create/update/delete operations

---

## Step 10.7: Verify Full Integration

```bash
cd frontend && npx tsc --noEmit
cd frontend && npm run dev
```

Start the backend too:
```bash
cd backend && source venv/bin/activate && python -m uvicorn app.main:app --reload
```

If MongoDB is running, test the full flow:
1. Register a new user
2. Login
3. Create a trip
4. Add activities
5. Add expenses
6. Add packing items
7. Edit/delete items
8. Verify dashboard shows data

If MongoDB is NOT running, verify that:
1. The frontend compiles without errors
2. API calls are being made (check Network tab in DevTools)
3. Error handling works (shows proper messages when backend is unreachable)

---

## Step 10.8: Update Progress

1. Update `_progress/checklist.md`:
   - [x] Frontend connected to backend API
   - [x] State management working
   - [x] All CRUD flows functional end-to-end

2. Update `_progress/progress.md` for Skill 10
3. Log decisions about state management approach, error handling strategy

---

## ✅ Completion Criteria for Skill 10

- [ ] Axios client configured with interceptors (auth, error handling)
- [ ] 6 service modules (auth, trip, activity, expense, packing, upload) fully implemented
- [ ] AuthContext fully implemented with useReducer
- [ ] 6 custom hooks created (useDebounce, useTrips, useActivities, useExpenses, usePacking, useLocalStorage)
- [ ] All 12 pages connected to real API calls
- [ ] Loading states on all pages
- [ ] Error handling on all pages
- [ ] Empty states on all list pages
- [ ] Toast notifications for all operations
- [ ] Token management (storage, injection, expiry handling)
- [ ] Frontend compiles without TypeScript errors
- [ ] Progress files updated
