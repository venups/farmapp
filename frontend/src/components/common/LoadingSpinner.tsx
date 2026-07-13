import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  fullPage?: boolean;
}

export function LoadingSpinner({ size = 'md', fullPage = false }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
  };

  const containerClass = fullPage
    ? 'fixed inset-0 flex items-center justify-center bg-slate-900 bg-opacity-80 z-50'
    : 'flex items-center justify-center';

  return (
    <div className={containerClass}>
      <div
        className={`${sizeClasses[size]} border-indigo-500 border-t-transparent rounded-full animate-spin`}
      />
    </div>
  );
}
