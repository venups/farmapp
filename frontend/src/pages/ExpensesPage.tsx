
interface Expense {
  id: string;
  trip_id: string;
  title: string;
  amount: number;
  currency: string;
  category: string;
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

interface ExpenseSummary {
  total_amount: number;
  currency: string;
  by_category: Record<string, number>;
  by_date: Array<{ date: string; amount: number }>;
  budget: number | null;
  remaining_budget: number | null;
  expense_count: number;
}

export function ExpensesPage({ tripId, budget = 0, currency = 'USD' }: { tripId: string; budget?: number; currency?: string }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [summary, setSummary] = useState<ExpenseSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, [tripId]);

  const fetchExpenses = async () => {
    setIsLoading(true);
    console.log('Fetching expenses for trip:', tripId);
    
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const mockExpenses: Expense[] = [
      {
        id: '1',
        trip_id: tripId,
        title: 'Hotel accommodation',
        amount: 300,
        currency: 'USD',
        category: 'accommodation',
        date: '2025-08-16',
        paid_by: null,
        split_between: [],
        notes: null,
        receipt_url: null,
        is_paid: true,
        payment_method: 'cash' as any,
        created_at: '2025-08-16T00:00:00Z',
        updated_at: '2025-08-16T00:00:00Z',
      },
      {
        id: '2',
        trip_id: tripId,
        title: 'Sushi dinner',
        amount: 150,
        currency: 'USD',
        category: 'food',
        date: '2025-08-16',
        paid_by: null,
        split_between: [],
        notes: null,
        receipt_url: null,
        is_paid: true,
        payment_method: 'cash' as any,
        created_at: '2025-08-16T00:00:00Z',
        updated_at: '2025-08-16T00:00:00Z',
      },
      {
        id: '3',
        trip_id: tripId,
        title: 'Train ticket',
        amount: 50,
        currency: 'USD',
        category: 'transport',
        date: '2025-08-17',
        paid_by: null,
        split_between: [],
        notes: null,
        receipt_url: null,
        is_paid: true,
        payment_method: 'cash' as any,
        created_at: '2025-08-17T00:00:00Z',
        updated_at: '2025-08-17T00:00:00Z',
      },
    ];

    const mockSummary: ExpenseSummary = {
      total_amount: 500,
      currency: currency,
      by_category: { accommodation: 300, food: 150, transport: 50 },
      by_date: [{ date: '2025-08-16', amount: 450 }, { date: '2025-08-17', amount: 50 }],
      budget: budget,
      remaining_budget: budget > 0 ? budget - 500 : null,
      expense_count: 3,
    };

    setExpenses(mockExpenses);
    setSummary(mockSummary);
    setIsLoading(false);
  };

  const handleExpenseSubmit = async (data: any) => {
    console.log('Expense submitted:', data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Expense created successfully!');
    setShowExpenseForm(false);
    fetchExpenses();
  };

  const handleDeleteExpense = async (id: string) => {
    console.log(' Deleting expense:', id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card padding="lg" className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Expenses</h1>
          <p className="text-slate-400 mt-1">Track your spending</p>
        </div>
        <Button icon={<Plus size={18} />} onClick={() => setShowExpenseForm(true)}>
          Add Expense
        </Button>
      </Card>

      {summary && (
        <div className="space-y-6">
          {/* Summary Section */}
          <BudgetProgress
            spent={summary.total_amount}
            budget={budget}
            currency={currency}
          />

          <ExpenseChart summary={summary} />

          {/* Total Spent */}
          <Card padding="lg">
            <div className="text-center py-6">
              <p className="text-sm text-slate-400 mb-2">Total Spent</p>
              <p className="text-4xl font-bold text-indigo-400">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: summary.currency,
                }).format(summary.total_amount)}
              </p>
            </div>
          </Card>
        </div>
      )}

      <Card padding="lg" className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Expense List</h2>

        {expenses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500">No expenses yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {expenses.map((expense) => (
              <ExpenseCard
                key={expense.id}
                expense={{
                  ...expense,
                  paid_by: null,
                  split_between: [] as string[],
                  notes: null,
                  receipt_url: null,
                  is_paid: expense.amount > 0,
                  payment_method: 'cash' as const,
                } as any}
                onDelete={() => handleDeleteExpense(expense.id)}
              />
            ))}
          </div>
        )}
      </Card>

      <ExpenseForm
        tripId={tripId}
        onSubmit={handleExpenseSubmit}
      />
    </div>
  );
}


export default ExpensesPage;

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import BudgetProgress from '@/components/expenses/BudgetProgress';
import ExpenseChart from '@/components/expenses/ExpenseChart';
import ExpenseForm from '@/components/expenses/ExpenseForm';
import ExpenseCard from '@/components/expenses/ExpenseCard';
import { Plus } from 'lucide-react';