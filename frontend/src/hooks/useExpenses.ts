import { useState, useCallback } from 'react';
import { expenseService } from '@/services/expenseService';
import type { Expense, ExpenseCreate, ExpenseUpdate, ExpenseSummary } from '@/types';
import toast from 'react-hot-toast';

export function useExpenses(tripId: string) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [summary, setSummary] = useState<ExpenseSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchExpenses = useCallback(async (category?: string) => {
    setIsLoading(true);
    try {
      const [data, summaryData] = await Promise.all([
        expenseService.getExpenses(tripId, category),
        expenseService.getExpenseSummary(tripId),
      ]);
      setExpenses(data);
      setSummary(summaryData);
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to fetch expenses');
    } finally {
      setIsLoading(false);
    }
  }, [tripId]);

  const createExpense = useCallback(async (data: ExpenseCreate) => {
    try {
      const newExpense = await expenseService.createExpense(data);
      setExpenses((prev) => [newExpense, ...prev]);
      toast.success('Expense added!');
      return newExpense;
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to add expense');
      throw error;
    }
  }, []);

  const updateExpense = useCallback(async (expenseId: string, data: ExpenseUpdate) => {
    try {
      const updated = await expenseService.updateExpense(expenseId, data);
      setExpenses((prev) => prev.map((e) => (e.id === expenseId ? updated : e)));
      toast.success('Expense updated!');
      return updated;
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to update expense');
      throw error;
    }
  }, []);

  const deleteExpense = useCallback(async (expenseId: string) => {
    try {
      await expenseService.deleteExpense(expenseId);
      setExpenses((prev) => prev.filter((e) => e.id !== expenseId));
      toast.success('Expense deleted');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to delete expense');
      throw error;
    }
  }, []);

  return { expenses, summary, isLoading, fetchExpenses, createExpense, updateExpense, deleteExpense };
}
