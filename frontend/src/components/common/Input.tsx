import React, { forwardRef } from 'react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label: string;
  error?: string;
  helperText?: string;
  prefix?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, prefix, style, ...props }, ref) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
        <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-secondary)' }}>
          {label}
        </label>
        <div style={{ position: 'relative' }}>
          {prefix && (
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center' }}>
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            style={{
              width: '100%',
              padding: prefix ? '10px 12px 10px 40px' : '10px 12px',
              backgroundColor: 'var(--color-bg-dark)',
              border: `1px solid ${error ? 'var(--color-error)' : 'var(--color-border)'}`,
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-text-primary)',
              fontSize: 14,
              outline: 'none',
              transition: 'border-color var(--transition-fast)',
            }}
            onFocus={(e) => {
              if (!error) e.target.style.borderColor = 'var(--color-primary)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = error ? 'var(--color-error)' : 'var(--color-border)';
            }}
            {...props}
          />
        </div>
        {error && <span style={{ fontSize: 12, color: 'var(--color-error)' }}>{error}</span>}
        {helperText && !error && <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{helperText}</span>}
      </div>
    );
  }
);
