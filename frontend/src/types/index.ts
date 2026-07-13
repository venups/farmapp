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

// Category options with labels and emojis for the UI
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
