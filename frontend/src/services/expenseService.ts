import api from './api';
import type { Expense, ExpenseCreate, ExpenseUpdate, ExpenseSummary } from '@/types';

export const expenseService = {
  async getExpenses(tripId: string, category?: string): Promise<Expense[]> {
    const { data } = await api.get<Expense[]>(`/expenses/trip/${tripId}`, { params: { category } });
    return data;
  },

  async getExpense(expenseId: string): Promise<Expense> {
    const { data } = await api.get<Expense>(`/expenses/${expenseId}`);
    return data;
  },

  async createExpense(data: ExpenseCreate): Promise<Expense> {
    const { data } = await api.post<Expense>('/expenses', data);
    return data;
  },

  async updateExpense(expenseId: string, data: ExpenseUpdate): Promise<Expense> {
    const { data } = await api.put<Expense>(`/expenses/${expenseId}`, data);
    return data;
  },

  async deleteExpense(expenseId: string): Promise<void> {
    await api.delete(`/expenses/${expenseId}`);
  },

  async getExpenseSummary(tripId: string): Promise<ExpenseSummary> {
    const { data } = await api.get<ExpenseSummary>(`/expenses/trip/${tripId}/summary`);
    return data;
  },
};
