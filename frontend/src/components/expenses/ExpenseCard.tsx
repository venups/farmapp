import { EXPENSE_CATEGORIES, type Expense } from '@/types';
import { Card } from '../common/Card';
import { format } from 'date-fns';

interface ExpenseCardProps {
  expense: Expense;
  onEdit: () => void;
  onDelete: () => void;
}

export function ExpenseCard({ expense, onEdit, onDelete }: ExpenseCardProps) {
  const catInfo = EXPENSE_CATEGORIES.find((c) => c.value === expense.category);

  return (
    <Card padding="sm" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
      <div style={{ fontSize: 24 }}>{catInfo?.emoji || '📌'}</div>
      <div style={{ flex: 1 }}>
        <h4 style={{ fontSize: 14, fontWeight: 600 }}>{expense.title}</h4>
        <p style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
          {catInfo?.label} · {format(new Date(expense.date), 'MMM d, yyyy')}
          {expense.payment_method ? ` · ${expense.payment_method}` : ''}
        </p>
      </div>
      <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)' }}>
        {expense.currency} {expense.amount.toFixed(2)}
      </div>
      <div style={{ display: 'flex', gap: 4 }}>
        <button onClick={onEdit} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }} title="Edit">✏️</button>
        <button onClick={onDelete} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }} title="Delete">🗑️</button>
      </div>
    </Card>
  );
}
