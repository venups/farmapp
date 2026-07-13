import api from './api';
import type { PackingItem, PackingItemCreate, PackingItemUpdate, PackingListResponse } from '@/types';

export const packingService = {
  async getPackingList(tripId: string): Promise<PackingListResponse> {
    const { data } = await api.get<PackingListResponse>(`/trips/${tripId}/packing`);
    return data;
  },

  async createItem(data: PackingItemCreate): Promise<PackingItem> {
    const { data: created } = await api.post<PackingItem>('/packing', data);
    return created;
  },

  async updateItem(itemId: string, data: PackingItemUpdate): Promise<PackingItem> {
    const { data: updated } = await api.put<PackingItem>(`/packing/${itemId}`, data);
    return updated;
  },

  async deleteItem(itemId: string): Promise<void> {
    await api.delete(`/packing/${itemId}`);
  },

  async togglePacked(itemId: string): Promise<PackingItem> {
    const { data } = await api.post<PackingItem>(`/packing/${itemId}/toggle`);
    return data;
  },

  async bulkCreate(tripId: string, items: PackingItemCreate[]): Promise<PackingItem[]> {
    const { data } = await api.post<PackingItem[]>(`/trips/${tripId}/packing/bulk`, { items });
    return data;
  },
};
