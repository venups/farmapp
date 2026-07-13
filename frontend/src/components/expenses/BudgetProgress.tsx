import React from 'react';

interface BudgetProgressProps {
  spent: number;
  budget: number;
  currency: string;
}

export default function BudgetProgress({ spent, budget, currency }: BudgetProgressProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  };

  const getPercentage = () => {
    if (!budget || budget === 0) return 100;
    return Math.min(100, (spent / budget) * 100);
  };

  const getBarColor = () => {
    if (!budget || budget === 0) return 'bg-slate-600';
    const percentage = (spent / budget) * 100;
    if (percentage > 90) return 'bg-red-500';
    if (percentage > 75) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getAlert = () => {
    if (!budget || budget === 0) return null;
    const percentage = (spent / budget) * 100;
    if (percentage > 90) return { message: 'Budget exceeded!', color: 'text-red-500' };
    if (percentage > 75) return { message: 'Approaching budget limit!', color: 'text-amber-500' };
    return { message: 'Budget OK', color: 'text-emerald-500' };
  };

  const alert = getAlert();
  const remainingBudget = (budget || 0) - spent;

  return (
    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Budget Progress</h3>
        {alert && (
          <span className={`text-sm font-medium ${alert.color}`}>
            {alert.message}
          </span>
        )}
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-400">Spent</span>
          <span className="font-medium text-white">{formatCurrency(spent)}</span>
        </div>
        {budget && budget > 0 && (
          <>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-400">Budget</span>
              <span className="font-medium text-white">{formatCurrency(budget)}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-400">Remaining</span>
              <span className={`font-medium ${remainingBudget >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                {formatCurrency(remainingBudget)}
              </span>
            </div>
          </>
        )}
      </div>

      {budget && budget > 0 ? (
        <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${getBarColor()}`}
            style={{ width: `${Math.min(100, (spent / budget) * 100)}%` }}
          />
        </div>
      ) : (
        <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
          <div className="h-full bg-slate-600 rounded-full w-full animate-pulse" />
        </div>
      )}

      {budget && budget > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-700 flex justify-between text-sm">
          <span className="text-slate-400">Percentage</span>
          <span className="font-medium text-indigo-400">
            {Math.min(100, (spent / budget) * 100).toFixed(1)}%
          </span>
        </div>
      )}
    </div>
  );
}
