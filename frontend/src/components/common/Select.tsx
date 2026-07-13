import React, { forwardRef } from 'react';

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'prefix'> {
  label: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  prefix?: React.ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, prefix, style, ...props }, ref) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
        <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-secondary)' }}>
          {label}
        </label>
        <div style={{ position: 'relative' }}>
          {prefix && (
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)', display: 'flex', pointerEvents: 'none', zIndex: 1 }}>
              {prefix}
            </span>
          )}
          <select
            ref={ref}
            style={{
              width: '100%',
              padding: prefix ? '10px 12px 10px 40px' : '10px 12px',
              backgroundColor: 'var(--color-bg-dark)',
              border: `1px solid ${error ? 'var(--color-error)' : 'var(--color-border)'}`,
              borderRadius: 'var(--radius-md)',
              color: props.value ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
              fontSize: 14,
              outline: 'none',
              appearance: 'none',
              cursor: 'pointer',
            }}
            {...props}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--color-text-secondary)' }}>
            ▾
          </span>
        </div>
        {error && <span style={{ fontSize: 12, color: 'var(--color-error)' }}>{error}</span>}
      </div>
    );
  }
);
