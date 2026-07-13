import React, { forwardRef, useState } from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  rows?: number;
  maxLength?: number;
  showCount?: boolean;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, rows = 4, maxLength, showCount = false, value, onChange, ...props }, ref) => {
    const [text, setText] = useState(String(value || ''));

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setText(e.target.value);
      onChange?.(e);
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-secondary)' }}>
          {label}
        </label>
        <textarea
          ref={ref}
          rows={rows}
          maxLength={maxLength}
          value={text}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '10px 12px',
            backgroundColor: 'var(--color-bg-dark)',
            border: `1px solid ${error ? 'var(--color-error)' : 'var(--color-border)'}`,
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-text-primary)',
            fontSize: 14,
            outline: 'none',
            resize: 'vertical',
            fontFamily: 'inherit',
            transition: 'border-color var(--transition-fast)',
          }}
          onFocus={(e) => { if (!error) e.target.style.borderColor = 'var(--color-primary)'; }}
          onBlur={(e) => { e.target.style.borderColor = error ? 'var(--color-error)' : 'var(--color-border)'; }}
          {...props}
        />
        {error && <span style={{ fontSize: 12, color: 'var(--color-error)' }}>{error}</span>}
        {showCount && maxLength && (
          <span style={{ fontSize: 11, color: 'var(--color-text-secondary)', textAlign: 'right' }}>
            {text.length} / {maxLength}
          </span>
        )}
      </div>
    );
  }
);
