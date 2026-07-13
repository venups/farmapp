import { ProgressBar } from '../common/ProgressBar';

interface BudgetProgressProps {
  spent: number;
  budget: number;
  currency: string;
}

export function BudgetProgress({ spent, budget, currency }: BudgetProgressProps) {
  const percentage = (spent / budget) * 100;
  const color = percentage > 90 ? 'var(--color-error)' : percentage > 75 ? 'var(--color-warning)' : 'var(--color-success)';

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Spent</p>
          <p style={{ fontSize: 20, fontWeight: 700 }}>{currency} {spent.toFixed(2)}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Budget</p>
          <p style={{ fontSize: 20, fontWeight: 700 }}>{currency} {budget.toFixed(2)}</p>
        </div>
      </div>
      <ProgressBar value={percentage} color={color} showLabel size="md" />
      <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 8, textAlign: 'right' }}>
        {currency} {Math.max(0, budget - spent).toFixed(2)} remaining
      </p>
    </div>
  );
}
