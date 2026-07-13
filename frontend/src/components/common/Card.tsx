import React, { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

export default function Card({
  children,
  className = '',
  hoverable = false,
  padding = 'md',
}: CardProps) {
  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={`rounded-xl bg-[rgba(30,41,59,0.8)] backdrop-blur-lg border border-[rgba(148,163,184,0.1)] transition-all duration-300 ${
        hoverable ? 'hover:translate-y-[-2px] hover:shadow-xl' : ''
      } ${paddings[padding]} ${className}`}
    >
      {children}
    </div>
  );
}
