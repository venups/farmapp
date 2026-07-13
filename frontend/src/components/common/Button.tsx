import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading,
  icon,
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantsBg = {
    primary: 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500',
    secondary: 'bg-slate-700 hover:bg-slate-600',
    danger: 'bg-red-600 hover:bg-red-500',
    ghost: 'bg-transparent hover:bg-slate-800',
    outline: 'bg-transparent border-2 border-slate-600 hover:border-indigo-500',
  };
  
  const variantsText = {
    primary: 'text-white',
    secondary: 'text-white',
    danger: 'text-white',
    ghost: 'text-slate-300 hover:text-white',
    outline: 'text-slate-300 hover:text-white',
  };
  
  const variantsRing = {
    primary: 'focus:ring-indigo-500',
    secondary: 'focus:ring-slate-500',
    danger: 'focus:ring-red-500',
    ghost: 'focus:ring-slate-500',
    outline: 'focus:ring-indigo-500',
  };
  
  const variantsBorder = {
    primary: 'border-transparent shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30',
    secondary: 'border-transparent',
    danger: 'border-transparent shadow-lg shadow-red-500/20 hover:shadow-red-500/30',
    ghost: 'border-transparent',
    outline: 'border-2',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-2.5',
  };
  
  return (
    <button
      className={`${baseStyles} ${variantsBg[variant]} ${variantsText[variant]} ${sizes[size]} hover:scale-[1.02] active:scale-[0.98] ${variantsRing[variant]} ${variantsBorder[variant]} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="animate-spin" size={size === 'sm' ? 14 : size === 'md' ? 16 : 20} />
      ) : (
        icon
      )}
      <span>{children}</span>
    </button>
  );
}
