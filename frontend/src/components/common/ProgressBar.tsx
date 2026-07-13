interface ProgressBarProps {
  value: number;
  color?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

export function ProgressBar({ value, color = 'var(--color-primary)', showLabel = false, size = 'md' }: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));
  const heights = { sm: 6, md: 10 };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: showLabel ? 6 : 0 }}>
        {showLabel && <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{Math.round(clampedValue)}%</span>}
      </div>
      <div
        style={{
          width: '100%', height: heights[size],
          backgroundColor: 'var(--color-bg-dark)',
          borderRadius: heights[size], overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${clampedValue}%`, height: '100%',
            background: color,
            borderRadius: heights[size],
            transition: 'width 0.5s ease',
          }}
        />
      </div>
    </div>
  );
}
