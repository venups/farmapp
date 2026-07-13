import api from './api';
import type { Expense, ExpenseCreate, ExpenseUpdate, ExpenseSummary } from '@/types';

export const expenseService = {
  async getExpenses(tripId: string, category?: string): Promise<Expense[]> {
    const params = category ? { category } : {};
    const { data } = await api.get<Expense[]>(`/trips/${tripId}/expenses`, { params });
    return data;
  },

  async getExpense(expenseId: string): Promise<Expense> {
    const { data } = await api.get<Expense>(`/expenses/${expenseId}`);
    return data;
  },

  async createExpense(data: ExpenseCreate): Promise<Expense> {
    const { data: created } = await api.post<Expense>('/expenses', data);
    return created;
  },

  async updateExpense(expenseId: string, data: ExpenseUpdate): Promise<Expense> {
    const { data: updated } = await api.put<Expense>(`/expenses/${expenseId}`, data);
    return updated;
  },

  async deleteExpense(expenseId: string): Promise<void> {
    await api.delete(`/expenses/${expenseId}`);
  },

  async getExpenseSummary(tripId: string): Promise<ExpenseSummary> {
    const { data } = await api.get<ExpenseSummary>(`/trips/${tripId}/expenses/summary`);
    return data;
  },
};
