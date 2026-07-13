interface SkeletonProps {
  variant?: 'text' | 'circle' | 'rect';
  width?: string | number;
  height?: string | number;
  count?: number;
}

export function Skeleton({ variant = 'text', width, height, count = 1 }: SkeletonProps) {
  const skeleton = (
    <div
      style={{
        width, height,
        backgroundColor: 'var(--color-bg-hover)',
        borderRadius: variant === 'circle' ? '50%' : variant === 'rect' ? 'var(--radius-sm)' : 'var(--radius-md)',
        position: 'relative', overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)',
          animation: 'pulse 1.5s ease-in-out infinite',
        }}
      />
    </div>
  );

  if (count <= 1) return skeleton;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>{skeleton}</div>
      ))}
    </div>
  );
}
