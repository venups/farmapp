import React, { HTMLAttributes } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import Badge from '../common/Badge';
import { Expense, EXPENSE_CATEGORIES } from '@/types';

interface ExpenseCardProps extends HTMLAttributes<HTMLDivElement> {
  expense: Expense;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function ExpenseCard({
  expense,
  onEdit,
  onDelete,
  className = '',
}: ExpenseCardProps) {
  const getCategoryInfo = () => {
    return EXPENSE_CATEGORIES.find((c) => c.value === expense.category);
  };

  const categoryInfo = getCategoryInfo();

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className={`group rounded-xl bg-slate-800/50 border border-slate-700/30 p-4 hover:border-indigo-500/50 transition-all ${className}`}>
      <div className="flex items-start gap-4">
        {categoryInfo ? (
          <div className="w-12 h-12 rounded-lg bg-slate-700/50 flex items-center justify-center text-2xl">
            {categoryInfo.emoji}
          </div>
        ) : (
          <div className="w-12 h-12 rounded-lg bg-slate-700/50 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-slate-600" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-slate-200 truncate mb-1">{expense.title}</h4>
          <div className="flex items-center gap-3 text-sm">
            {categoryInfo && (
              <Badge variant={expense.category as any} size="sm">
                {categoryInfo.label}
              </Badge>
            )}
            <span className="text-slate-400">{formatDate(expense.date)}</span>
            {expense.payment_method && (
              <span className="text-slate-500">via {expense.payment_method}</span>
            )}
          </div>
        </div>
        <div className="text-right">
          <span className="text-lg font-bold text-white">
            {formatCurrency(expense.amount, expense.currency)}
          </span>
        </div>
        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-1.5 text-slate-400 hover:text-indigo-400 rounded hover:bg-indigo-500/10"
              title="Edit expense"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1.5 text-slate-400 hover:text-red-400 rounded hover:bg-red-500/10"
              title="Delete expense"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
