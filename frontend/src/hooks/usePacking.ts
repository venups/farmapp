import { useState, useCallback } from 'react';
import { packingService } from '@/services/packingService';
import type { PackingItem, PackingItemCreate, PackingItemUpdate, PackingListResponse } from '@/types';
import toast from 'react-hot-toast';

export function usePacking(tripId: string) {
  const [packingList, setPackingList] = useState<PackingListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchList = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await packingService.getPackingList(tripId);
      setPackingList(data);
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to fetch packing list');
    } finally {
      setIsLoading(false);
    }
  }, [tripId]);

  const createItem = useCallback(async (data: PackingItemCreate) => {
    try {
      await packingService.createItem(data);
      toast.success('Item added!');
      await fetchList();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to add item');
      throw error;
    }
  }, [fetchList]);

  const updateItem = useCallback(async (itemId: string, data: PackingItemUpdate) => {
    try {
      await packingService.updateItem(itemId, data);
      toast.success('Item updated!');
      await fetchList();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to update item');
      throw error;
    }
  }, [fetchList]);

  const deleteItem = useCallback(async (itemId: string) => {
    try {
      await packingService.deleteItem(itemId);
      toast.success('Item deleted');
      await fetchList();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to delete item');
      throw error;
    }
  }, [fetchList]);

  const togglePacked = useCallback(async (itemId: string) => {
    try {
      await packingService.togglePacked(itemId);
      await fetchList();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to toggle item');
    }
  }, [fetchList]);

  const bulkCreate = useCallback(async (items: PackingItemCreate[]) => {
    try {
      await packingService.bulkCreate(tripId, items);
      toast.success(`${items.length} items added!`);
      await fetchList();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to add items');
      throw error;
    }
  }, [tripId, fetchList]);

  return { packingList, isLoading, fetchList, createItem, updateItem, deleteItem, togglePacked, bulkCreate };
}
