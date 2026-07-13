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
