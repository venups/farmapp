# Skill 06: Frontend React + TypeScript Setup

> **Goal**: Set up the React frontend with TypeScript, configure routing, create the base layout structure, and define all TypeScript types.

---

## Step 6.1: Configure Vite

### File: `frontend/vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
});
```

### File: `frontend/tsconfig.json`

Ensure it has path aliases:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

## Step 6.2: Define TypeScript Types

### File: `frontend/src/types/index.ts`

Define ALL TypeScript interfaces/types that mirror the backend schemas. These must be complete — no `any` types allowed.

```typescript
// ============ User Types ============
export interface User {
  id: string;
  email: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  trip_count: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  full_name: string;
}

export interface UserUpdate {
  full_name?: string;
  bio?: string;
  avatar_url?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

// ============ Trip Types ============
export type TripStatus = 'planning' | 'ongoing' | 'completed' | 'cancelled';

export interface Trip {
  id: string;
  title: string;
  description: string | null;
  destination: string;
  country: string | null;
  cover_image_url: string | null;
  start_date: string;
  end_date: string;
  owner_id: string;
  collaborator_ids: string[];
  status: TripStatus;
  budget: number | null;
  currency: string;
  tags: string[];
  is_public: boolean;
  notes: string | null;
  duration_days: number;
  created_at: string;
  updated_at: string;
}

export interface TripCreate {
  title: string;
  description?: string;
  destination: string;
  country?: string;
  start_date: string;
  end_date: string;
  budget?: number;
  currency?: string;
  tags?: string[];
  is_public?: boolean;
  notes?: string;
}

export interface TripUpdate {
  title?: string;
  description?: string;
  destination?: string;
  country?: string;
  start_date?: string;
  end_date?: string;
  status?: TripStatus;
  budget?: number;
  currency?: string;
  tags?: string[];
  is_public?: boolean;
  notes?: string;
  cover_image_url?: string;
}

export interface TripListResponse {
  trips: Trip[];
  total: number;
  page: number;
  per_page: number;
}

// ============ Activity Types ============
export type ActivityCategory = 'food' | 'attraction' | 'transport' | 'accommodation' | 'shopping' | 'entertainment' | 'nature' | 'culture' | 'other';

export interface Activity {
  id: string;
  trip_id: string;
  day_number: number;
  title: string;
  description: string | null;
  category: ActivityCategory;
  start_time: string | null;
  end_time: string | null;
  location_name: string | null;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  estimated_cost: number | null;
  currency: string;
  booking_url: string | null;
  notes: string | null;
  order_index: number;
  is_booked: boolean;
  rating: number | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ActivityCreate {
  trip_id: string;
  day_number: number;
  title: string;
  category: ActivityCategory;
  description?: string;
  start_time?: string;
  end_time?: string;
  location_name?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  estimated_cost?: number;
  currency?: string;
  booking_url?: string;
  notes?: string;
  image_url?: string;
}

export interface ActivityUpdate {
  title?: string;
  description?: string;
  category?: ActivityCategory;
  start_time?: string;
  end_time?: string;
  location_name?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  estimated_cost?: number;
  booking_url?: string;
  notes?: string;
  order_index?: number;
  is_booked?: boolean;
  rating?: number;
  image_url?: string;
}

// ============ Expense Types ============
export type ExpenseCategory = 'food' | 'transport' | 'accommodation' | 'activities' | 'shopping' | 'insurance' | 'visa' | 'tips' | 'other';

export interface Expense {
  id: string;
  trip_id: string;
  title: string;
  amount: number;
  currency: string;
  category: ExpenseCategory;
  date: string;
  paid_by: string | null;
  split_between: string[];
  notes: string | null;
  receipt_url: string | null;
  is_paid: boolean;
  payment_method: string | null;
  created_at: string;
  updated_at: string;
}

export interface ExpenseCreate {
  trip_id: string;
  title: string;
  amount: number;
  currency?: string;
  category: ExpenseCategory;
  date: string;
  notes?: string;
  payment_method?: string;
}

export interface ExpenseUpdate {
  title?: string;
  amount?: number;
  category?: ExpenseCategory;
  date?: string;
  notes?: string;
  is_paid?: boolean;
  payment_method?: string;
}

export interface ExpenseSummary {
  total_amount: number;
  currency: string;
  by_category: Record<string, number>;
  by_date: Array<{ date: string; amount: number }>;
  budget: number | null;
  remaining_budget: number | null;
  expense_count: number;
}

// ============ Packing Types ============
export type PackingCategory = 'clothing' | 'toiletries' | 'electronics' | 'documents' | 'medicine' | 'accessories' | 'gear' | 'other';

export interface PackingItem {
  id: string;
  trip_id: string;
  name: string;
  category: PackingCategory;
  quantity: number;
  is_packed: boolean;
  is_essential: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PackingItemCreate {
  trip_id: string;
  name: string;
  category: PackingCategory;
  quantity?: number;
  is_essential?: boolean;
  notes?: string;
}

export interface PackingItemUpdate {
  name?: string;
  category?: PackingCategory;
  quantity?: number;
  is_essential?: boolean;
  notes?: string;
}

export interface PackingListResponse {
  items: PackingItem[];
  total_items: number;
  packed_items: number;
  progress_percent: number;
  by_category: Record<string, PackingItem[]>;
}

// ============ Common Types ============
export interface ApiError {
  error: boolean;
  status_code: number;
  detail: string;
  timestamp: string;
}

export interface PaginationParams {
  page: number;
  per_page: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// Category options with labels and icons for the UI
export const ACTIVITY_CATEGORIES: Array<{ value: ActivityCategory; label: string; emoji: string }> = [
  { value: 'food', label: 'Food & Dining', emoji: '🍽️' },
  { value: 'attraction', label: 'Attraction', emoji: '🏛️' },
  { value: 'transport', label: 'Transport', emoji: '🚗' },
  { value: 'accommodation', label: 'Accommodation', emoji: '🏨' },
  { value: 'shopping', label: 'Shopping', emoji: '🛍️' },
  { value: 'entertainment', label: 'Entertainment', emoji: '🎭' },
  { value: 'nature', label: 'Nature', emoji: '🌿' },
  { value: 'culture', label: 'Culture', emoji: '🎨' },
  { value: 'other', label: 'Other', emoji: '📌' },
];

export const EXPENSE_CATEGORIES: Array<{ value: ExpenseCategory; label: string; emoji: string }> = [
  { value: 'food', label: 'Food & Dining', emoji: '🍽️' },
  { value: 'transport', label: 'Transport', emoji: '🚗' },
  { value: 'accommodation', label: 'Accommodation', emoji: '🏨' },
  { value: 'activities', label: 'Activities', emoji: '🎯' },
  { value: 'shopping', label: 'Shopping', emoji: '🛍️' },
  { value: 'insurance', label: 'Insurance', emoji: '🛡️' },
  { value: 'visa', label: 'Visa & Fees', emoji: '📋' },
  { value: 'tips', label: 'Tips', emoji: '💰' },
  { value: 'other', label: 'Other', emoji: '📌' },
];

export const PACKING_CATEGORIES: Array<{ value: PackingCategory; label: string; emoji: string }> = [
  { value: 'clothing', label: 'Clothing', emoji: '👕' },
  { value: 'toiletries', label: 'Toiletries', emoji: '🧴' },
  { value: 'electronics', label: 'Electronics', emoji: '📱' },
  { value: 'documents', label: 'Documents', emoji: '📄' },
  { value: 'medicine', label: 'Medicine', emoji: '💊' },
  { value: 'accessories', label: 'Accessories', emoji: '👜' },
  { value: 'gear', label: 'Gear', emoji: '🎒' },
  { value: 'other', label: 'Other', emoji: '📦' },
];

export const TRIP_STATUSES: Array<{ value: TripStatus; label: string; color: string }> = [
  { value: 'planning', label: 'Planning', color: '#6366F1' },
  { value: 'ongoing', label: 'Ongoing', color: '#10B981' },
  { value: 'completed', label: 'Completed', color: '#94A3B8' },
  { value: 'cancelled', label: 'Cancelled', color: '#EF4444' },
];

export const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR', 'KRW', 'MXN', 'BRL', 'THB', 'VND', 'PHP'];
```

---

## Step 6.3: Set Up Routing

### File: `frontend/src/App.tsx`

```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Layout } from '@/components/layout/Layout';

// Pages (will be created in Skill 08)
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { TripsPage } from '@/pages/TripsPage';
import { TripDetailPage } from '@/pages/TripDetailPage';
import { TripCreatePage } from '@/pages/TripCreatePage';
import { TripEditPage } from '@/pages/TripEditPage';
import { ItineraryPage } from '@/pages/ItineraryPage';
import { ExpensesPage } from '@/pages/ExpensesPage';
import { PackingPage } from '@/pages/PackingPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { NotFoundPage } from '@/pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{
          style: { background: '#1E293B', color: '#F8FAFC', border: '1px solid #334155' },
          success: { iconTheme: { primary: '#10B981', secondary: '#F8FAFC' } },
          error: { iconTheme: { primary: '#EF4444', secondary: '#F8FAFC' } },
        }} />
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected routes - wrapped in Layout */}
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/trips" element={<TripsPage />} />
            <Route path="/trips/new" element={<TripCreatePage />} />
            <Route path="/trips/:tripId" element={<TripDetailPage />} />
            <Route path="/trips/:tripId/edit" element={<TripEditPage />} />
            <Route path="/trips/:tripId/itinerary" element={<ItineraryPage />} />
            <Route path="/trips/:tripId/expenses" element={<ExpensesPage />} />
            <Route path="/trips/:tripId/packing" element={<PackingPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
          
          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
```

---

## Step 6.4: Create Placeholder Pages

Create placeholder page components so the app compiles. Each file should be a minimal React component that renders the page name. They will be fully implemented in Skill 08.

Create these files in `frontend/src/pages/`:

1. `LoginPage.tsx` — export function `LoginPage`
2. `RegisterPage.tsx` — export function `RegisterPage`
3. `DashboardPage.tsx` — export function `DashboardPage`
4. `TripsPage.tsx` — export function `TripsPage`
5. `TripDetailPage.tsx` — export function `TripDetailPage`
6. `TripCreatePage.tsx` — export function `TripCreatePage`
7. `TripEditPage.tsx` — export function `TripEditPage`
8. `ItineraryPage.tsx` — export function `ItineraryPage`
9. `ExpensesPage.tsx` — export function `ExpensesPage`
10. `PackingPage.tsx` — export function `PackingPage`
11. `ProfilePage.tsx` — export function `ProfilePage`
12. `NotFoundPage.tsx` — export function `NotFoundPage`

Each placeholder should render:
```tsx
export function DashboardPage() {
  return <div><h1>Dashboard</h1><p>Loading...</p></div>;
}
```

---

## Step 6.5: Create Protected Route Component

### File: `frontend/src/components/common/ProtectedRoute.tsx`

```typescript
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner fullPage />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
```

### File: `frontend/src/components/common/LoadingSpinner.tsx`

Create a beautiful CSS-animated loading spinner component:
- Accept props: `size?: 'sm' | 'md' | 'lg'`, `fullPage?: boolean`
- When `fullPage` is true, center the spinner on the full viewport with the dark background
- Use CSS animations (not a library) — create a smooth rotating ring with the primary indigo color
- Include inline styles or import from the styles directory

---

## Step 6.6: Create Base Layout Component

### File: `frontend/src/components/layout/Layout.tsx`

Create the main app layout with:
1. A **sidebar** navigation (collapsible on mobile)
2. A **header** bar with user avatar, app title, and logout button
3. A **main content** area that renders child routes via `<Outlet />`

The sidebar should have navigation links to:
- Dashboard (icon: LayoutDashboard from lucide-react)
- My Trips (icon: Map)
- New Trip (icon: Plus)
- Profile (icon: User)

Use `<NavLink>` from react-router-dom for active state highlighting.

The layout should have:
- A mobile hamburger menu toggle
- Responsive: sidebar hidden on mobile, visible on desktop (>= 768px)
- Smooth slide-in animation for mobile sidebar
- Active link highlighted with the primary color
- User avatar and name in the sidebar footer

```typescript
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { LayoutDashboard, Map, Plus, User, LogOut, Menu, X, Compass } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
```

Render `<Outlet />` in the main content area — this is where page content appears.

---

## Step 6.7: Create Entry Point

### File: `frontend/src/main.tsx`

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### File: `frontend/index.html`

Ensure it has:
- `<title>TripForge — Plan Your Perfect Journey</title>`
- `<meta name="description" content="...">`
- Google Fonts link for Inter font: `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">`
- Leaflet CSS: `<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />`
- Proper viewport meta tag
- A favicon (use an emoji SVG favicon: `<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🗺️</text></svg>">`)

---

## Step 6.8: Create Minimal CSS for Compilation

### File: `frontend/src/styles/index.css`

Create a minimal CSS reset and variable definitions (full styling in Skill 09):

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

:root {
  --color-primary: #6366F1;
  --color-secondary: #EC4899;
  --color-accent: #10B981;
  --color-bg-dark: #0F172A;
  --color-bg-card: #1E293B;
  --color-text-primary: #F8FAFC;
  --color-text-secondary: #94A3B8;
  --color-border: #334155;
  --color-error: #EF4444;
  --color-warning: #F59E0B;
  --color-success: #10B981;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --font-family: 'Inter', system-ui, -apple-system, sans-serif;
  --transition-fast: 150ms ease;
  --transition-normal: 250ms ease;
  --transition-slow: 350ms ease;
}

*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-family);
  background-color: var(--color-bg-dark);
  color: var(--color-text-primary);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a {
  color: var(--color-primary);
  text-decoration: none;
}

button {
  cursor: pointer;
  font-family: inherit;
}

input, textarea, select {
  font-family: inherit;
}

img {
  max-width: 100%;
  display: block;
}

#root {
  min-height: 100vh;
}
```

---

## Step 6.9: Create Stub AuthContext

### File: `frontend/src/context/AuthContext.tsx`

Create a temporary stub (full implementation in Skill 10):

```typescript
import { createContext, useContext, useState, ReactNode } from 'react';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    // Will be implemented in Skill 10
    console.log('Login:', email);
  };

  const register = async (data: any) => {
    // Will be implemented in Skill 10
    console.log('Register:', data);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
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

## Step 6.10: Verify Frontend Compiles

```bash
cd frontend && npm run dev
```

The app should start on `http://localhost:5173` without compilation errors. It's OK if the pages are just placeholders. Verify:
1. No TypeScript errors
2. No console errors
3. Routing works (navigate to /login, /register, /dashboard)

**Stop the dev server after verification.**

---

## Step 6.11: Update Progress

1. Update `_progress/checklist.md`:
   - [x] React project with TypeScript configured
   - [x] Routing set up (React Router)
   - [x] Responsive navigation (base layout)

2. Update `_progress/progress.md` for Skill 06
3. Log decisions about routing structure, path aliases, etc.

---

## ✅ Completion Criteria for Skill 06

- [ ] Vite configured with path aliases and proxy
- [ ] All TypeScript types defined (no `any` types)
- [ ] React Router configured with all routes
- [ ] 12 placeholder page components exist
- [ ] ProtectedRoute component works
- [ ] LoadingSpinner component created
- [ ] Layout component with sidebar navigation
- [ ] Base CSS with design tokens
- [ ] AuthContext stub created
- [ ] Frontend compiles and starts without errors
- [ ] Progress files updated
