import React from 'react';
import {
  Pie,
  Bar,
  PieChart as RechartsPieChart,
  BarChart as RechartsBarChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ExpenseSummary } from '@/types';

const COLORS = ['#6366F1', '#EC4899', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6', '#14B8A6'];

interface ExpenseChartProps {
  summary: ExpenseSummary;
}

export default function ExpenseChart({ summary }: ExpenseChartProps) {
  const { by_category, by_date, budget, currency } = summary;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  };

  const categoryData = Object.entries(by_category).map(([name, value]) => ({
    name,
    value,
  }));

  const dateData = by_date.map((item) => ({
    name: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    amount: item.amount,
  }));

  const formatPercentage = (value: number) => {
    if (!summary.budget || summary.budget === 0) return 'N/A';
    const percentage = (value / summary.budget) * 100;
    return `${percentage.toFixed(1)}%`;
  };

  const getBudgetColor = () => {
    if (!summary.budget) return '#10B981';
    const spent = summary.total_amount;
    if (spent > summary.budget * 0.9) return '#EF4444';
    if (spent > summary.budget * 0.75) return '#F59E0B';
    return '#10B981';
  };

  return (
    <div className="space-y-6">
      {summary.budget && summary.budget > 0 && (
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Budget Overview</h3>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-slate-400">Spent</span>
            <span className={`font-bold ${getBudgetColor()}`}>
              {formatCurrency(summary.total_amount)}
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3 mb-2">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, (summary.total_amount / summary.budget) * 100)}%`,
                backgroundColor: getBudgetColor(),
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-400">
            <span>Spent: {formatCurrency(summary.total_amount)}</span>
            <span>
              Remaining: {formatCurrency((summary.remaining_budget ?? 0))}
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Pie Chart */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Expenses by Category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <RechartsPieChart>
              < Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => formatCurrency(Number(value))}
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>

        {/* Date Bar Chart */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Expenses by Date</h3>
          <ResponsiveContainer width="100%" height={250}>
            <RechartsBarChart data={dateData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94A3B8" />
              <YAxis stroke="#94A3B8" />
              <Tooltip
                formatter={(value) => formatCurrency(Number(value))}
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
              />
              <Legend />
              <Bar dataKey="amount" fill="#6366F1" name="Spent" radius={[4, 4, 0, 0]} />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
