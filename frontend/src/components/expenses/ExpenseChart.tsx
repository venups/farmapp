import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card } from '../common/Card';
import type { ExpenseSummary } from '@/types';

const COLORS = ['#6366F1', '#EC4899', '#10B981', '#F59E0B', '#8B5CF6', '#F43F5E', '#22C55E', '#06B6D4', '#94A3B8'];

interface ExpenseChartProps {
  summary: ExpenseSummary;
}

export function ExpenseChart({ summary }: ExpenseChartProps) {
  const pieData = Object.entries(summary.by_category).map(([name, value]) => ({ name, value }));
  const barData = summary.by_date.map((d) => ({ date: d.date, amount: d.amount }));

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <Card>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>By Category</h3>
        {pieData.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {pieData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--color-text-secondary)' }}>No data</div>
        )}
      </Card>
      <Card>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>By Date</h3>
        {barData.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData}>
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']} />
              <Bar dataKey="amount" fill="#6366F1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--color-text-secondary)' }}>No data</div>
        )}
      </Card>
    </div>
  );
}
