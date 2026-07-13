import React from 'react';

interface ProgressBarProps {
  value: number;
  color?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

export default function ProgressBar({
  value,
  color = 'bg-indigo-500',
  showLabel = true,
  size = 'md',
}: ProgressBarProps) {
  const heights = {
    sm: 'h-1.5',
    md: 'h-3',
  };

  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between mb-2 text-sm font-medium">
          <span className="text-slate-300">Progress</span>
          <span className="text-indigo-400">{clampedValue}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-700 rounded-full overflow-hidden ${heights[size]}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${color}`}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
}
