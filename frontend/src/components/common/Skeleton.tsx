import React from 'react';

interface SkeletonProps {
  variant?: 'text' | 'circle' | 'rect';
  width?: string;
  height?: string;
  count?: number;
}

export default function Skeleton({
  variant = 'text',
  width,
  height,
  count = 1,
}: SkeletonProps) {
  const variants = {
    text: `h-4 ${width || 'w-full'}`,
    circle: `rounded-full ${width || 'w-10'} ${height || 'h-10'}`,
    rect: `rounded-lg ${width || 'w-full'} ${height || 'h-10'}`,
  };

  const renderSkeleton = () => (
    <div
      className={`animate-pulse bg-slate-700 ${variants[variant]}`}
    />
  );

  if (count > 1) {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i}>{renderSkeleton()}</div>
        ))}
      </div>
    );
  }

  return renderSkeleton();
}
