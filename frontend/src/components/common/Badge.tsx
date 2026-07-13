interface BadgeProps {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

const variants: Record<string, { bg: string; color: string }> = {
  primary: { bg: 'rgba(99, 102, 241, 0.2)', color: '#818CF8' },
  success: { bg: 'rgba(16, 185, 129, 0.2)', color: '#34D399' },
  warning: { bg: 'rgba(245, 158, 11, 0.2)', color: '#FBBF24' },
  danger: { bg: 'rgba(239, 68, 68, 0.2)', color: '#F87171' },
  info: { bg: 'rgba(59, 130, 246, 0.2)', color: '#60A5FA' },
  neutral: { bg: 'rgba(148, 163, 184, 0.2)', color: '#94A3B8' },
};

export function Badge({ variant = 'neutral', size = 'sm', children }: BadgeProps) {
  const v = variants[variant];
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center',
        padding: size === 'sm' ? '3px 10px' : '5px 14px',
        backgroundColor: v.bg, color: v.color,
        borderRadius: 9999, fontSize: size === 'sm' ? 11 : 12,
        fontWeight: 600, whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}
