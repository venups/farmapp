import api from './api';
import type { PackingItem, PackingItemCreate, PackingItemUpdate, PackingListResponse } from '@/types';

export const packingService = {
  async getPackingList(tripId: string): Promise<PackingListResponse> {
    const { data } = await api.get<PackingListResponse>(`/packing/trip/${tripId}`);
    return data;
  },

  async createItem(data: PackingItemCreate): Promise<PackingItem> {
    const { data } = await api.post<PackingItem>('/packing', data);
    return data;
  },

  async updateItem(itemId: string, data: PackingItemUpdate): Promise<PackingItem> {
    const { data } = await api.put<PackingItem>(`/packing/${itemId}`, data);
    return data;
  },

  async deleteItem(itemId: string): Promise<void> {
    await api.delete(`/packing/${itemId}`);
  },

  async togglePacked(itemId: string): Promise<PackingItem> {
    const { data } = await api.patch<PackingItem>(`/packing/${itemId}/toggle`);
    return data;
  },

  async bulkCreate(tripId: string, items: PackingItemCreate[]): Promise<PackingItem[]> {
    const { data } = await api.post<PackingItem[]>(`/packing/trip/${tripId}/bulk`, { items });
    return data;
  },
};
