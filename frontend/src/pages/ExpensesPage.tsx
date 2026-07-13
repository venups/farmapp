import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { ExpenseCard } from '@/components/expenses/ExpenseCard';
import { ExpenseForm } from '@/components/expenses/ExpenseForm';
import { ExpenseChart } from '@/components/expenses/ExpenseChart';
import { BudgetProgress } from '@/components/expenses/BudgetProgress';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Select } from '@/components/common/Select';
import { EXPENSE_CATEGORIES } from '@/types';
import type { Expense, ExpenseSummary, Trip } from '@/types';
import toast from 'react-hot-toast';

export function ExpensesPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [summary, setSummary] = useState<ExpenseSummary | null>(null);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [showDelete, setShowDelete] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('tripforge_token');
        const [expRes, sumRes, tripRes] = await Promise.all([
          fetch(`/api/expenses/trip/${tripId}`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`/api/expenses/trip/${tripId}/summary`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`/api/trips/${tripId}`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        if (expRes.ok) setExpenses(await expRes.json());
        if (sumRes.ok) setSummary(await sumRes.json());
        if (tripRes.ok) setTrip(await tripRes.json());
      } catch {
        // API not available
      }
    };
    fetchData();
  }, [tripId]);

  const filteredExpenses = categoryFilter
    ? expenses.filter((e) => e.category === categoryFilter)
    : expenses;

  const handleCreateExpense = async (data: any) => {
    try {
      const token = localStorage.getItem('tripforge_token');
      const res = await fetch('/api/expenses/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const newExpense = await res.json();
        setExpenses((prev) => [newExpense, ...prev]);
        setShowForm(false);
        toast.success('Expense added!');
      }
    } catch {
      toast.error('Failed to add expense');
    }
  };

  const handleUpdateExpense = async (data: any) => {
    try {
      const token = localStorage.getItem('tripforge_token');
      const res = await fetch(`/api/expenses/${editingExpense?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const updated = await res.json();
        setExpenses((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
        setEditingExpense(null);
        setShowForm(false);
        toast.success('Expense updated!');
      }
    } catch {
      toast.error('Failed to update expense');
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      const token = localStorage.getItem('tripforge_token');
      await fetch(`/api/expenses/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses((prev) => prev.filter((e) => e.id !== id));
      setShowDelete(null);
      toast.success('Expense deleted');
    } catch {
      toast.error('Failed to delete expense');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>Expenses</h1>
        <Button onClick={() => { setEditingExpense(null); setShowForm(true); }} icon={<Plus size={16} />}>Add Expense</Button>
      </div>

      {trip?.budget && summary && (
        <BudgetProgress spent={summary.total_amount} budget={trip.budget} currency={trip.currency} />
      )}

      {summary && summary.expense_count > 0 && <ExpenseChart summary={summary} />}

      <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
        <div style={{ maxWidth: 200 }}>
          <Select label="Filter by Category" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} options={[{ value: '', label: 'All Categories' }, ...EXPENSE_CATEGORIES.map((c) => ({ value: c.value, label: `${c.emoji} ${c.label}` }))]} />
        </div>
      </div>

      <div>
        {filteredExpenses.map((expense) => (
          <ExpenseCard
            key={expense.id}
            expense={expense}
            onEdit={() => { setEditingExpense(expense); setShowForm(true); }}
            onDelete={() => setShowDelete(expense.id)}
          />
        ))}
        {filteredExpenses.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--color-text-secondary)' }}>
            No expenses{categoryFilter ? ' in this category' : ''} yet.
          </div>
        )}
      </div>

      <ExpenseForm
        tripId={tripId!}
        initialData={editingExpense ? { title: editingExpense.title, amount: editingExpense.amount, category: editingExpense.category, currency: editingExpense.currency, date: editingExpense.date, notes: editingExpense.notes ?? undefined, payment_method: editingExpense.payment_method ?? undefined } : undefined}
        onSubmit={editingExpense ? handleUpdateExpense : handleCreateExpense}
        isLoading={false}
        onCancel={() => { setShowForm(false); setEditingExpense(null); }}
        isOpen={showForm}
      />

      <ConfirmDialog
        isOpen={showDelete !== null}
        onClose={() => setShowDelete(null)}
        onConfirm={() => showDelete && handleDeleteExpense(showDelete)}
        title="Delete Expense"
        message="Are you sure you want to delete this expense?"
        confirmText="Delete"
        confirmVariant="danger"
      />
    </div>
  );
}
