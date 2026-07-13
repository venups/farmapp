import { createContext, useContext, useReducer, ReactNode, useCallback } from 'react';
import toast from 'react-hot-toast';
import { expenseService } from '@/services/expenseService';
import type { Expense, ExpenseCreate, ExpenseUpdate, ExpenseSummary } from '@/types';

interface ExpensesState {
  expenses: Expense[];
  expenseSummary: ExpenseSummary | null;
  isLoading: boolean;
  error: string | null;
}

type ExpensesAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_EXPENSES'; payload: Expense[] }
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'UPDATE_EXPENSE'; payload: Expense }
  | { type: 'DELETE_EXPENSE'; payload: string }
  | { type: 'SET_SUMMARY'; payload: ExpenseSummary }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: ExpensesState = {
  expenses: [],
  expenseSummary: null,
  isLoading: false,
  error: null,
};

function expensesReducer(state: ExpensesState, action: ExpensesAction): ExpensesState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_EXPENSES':
      return { ...state, expenses: action.payload };
    case 'ADD_EXPENSE':
      return { ...state, expenses: [action.payload, ...state.expenses] };
    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map((e) => (e.id === action.payload.id ? action.payload : e)),
      };
    case 'DELETE_EXPENSE':
      return { ...state, expenses: state.expenses.filter((e) => e.id !== action.payload) };
    case 'SET_SUMMARY':
      return { ...state, expenseSummary: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

interface ExpensesContextType extends ExpensesState {
  fetchExpenses: (tripId: string, category?: string) => Promise<void>;
  createExpense: (data: ExpenseCreate) => Promise<Expense | null>;
  updateExpense: (expenseId: string, data: ExpenseUpdate) => Promise<Expense | null>;
  deleteExpense: (expenseId: string) => Promise<void>;
  fetchSummary: (tripId: string) => Promise<void>;
}

const ExpensesContext = createContext<ExpensesContextType | undefined>(undefined);

export function ExpensesProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(expensesReducer, initialState);

  const fetchExpenses = useCallback(async (tripId: string, category?: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const expenses = await expenseService.getExpenses(tripId, category);
      dispatch({ type: 'SET_EXPENSES', payload: expenses });
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to fetch expenses');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const createExpense = useCallback(async (data: ExpenseCreate) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const expense = await expenseService.createExpense(data);
      dispatch({ type: 'ADD_EXPENSE', payload: expense });
      toast.success('Expense added');
      return expense;
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Failed to create expense';
      toast.error(message);
      return null;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const updateExpense = useCallback(async (expenseId: string, data: ExpenseUpdate) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const expense = await expenseService.updateExpense(expenseId, data);
      dispatch({ type: 'UPDATE_EXPENSE', payload: expense });
      toast.success('Expense updated');
      return expense;
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Failed to update expense';
      toast.error(message);
      return null;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const deleteExpense = useCallback(async (expenseId: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await expenseService.deleteExpense(expenseId);
      dispatch({ type: 'DELETE_EXPENSE', payload: expenseId });
      toast.success('Expense deleted');
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Failed to delete expense';
      toast.error(message);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const fetchSummary = useCallback(async (tripId: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const summary = await expenseService.getExpenseSummary(tripId);
      dispatch({ type: 'SET_SUMMARY', payload: summary });
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to fetch expense summary');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  return (
    <ExpensesContext.Provider
      value={{
        ...state,
        fetchExpenses,
        createExpense,
        updateExpense,
        deleteExpense,
        fetchSummary,
      }}
    >
      {children}
    </ExpensesContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpensesContext);
  if (!context) throw new Error('useExpenses must be used within ExpensesProvider');
  return context;
}
