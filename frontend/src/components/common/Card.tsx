interface CardProps {
  children: React.ReactNode;
  hoverable?: boolean;
  onClick?: () => void;
  padding?: 'sm' | 'md' | 'lg';
  style?: React.CSSProperties;
}

export function Card({ children, hoverable = false, onClick, padding = 'md', style }: CardProps) {
  const paddings = { sm: 16, md: 24, lg: 32 };

  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: 'rgba(30, 41, 59, 0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(148, 163, 184, 0.1)',
        borderRadius: 'var(--radius-lg)',
        padding: paddings[padding],
        cursor: onClick ? 'pointer' : undefined,
        transition: 'all var(--transition-normal)',
        transform: hoverable ? undefined : undefined,
        ...style,
      }}
      onMouseEnter={(e) => {
        if (hoverable) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
        }
      }}
      onMouseLeave={(e) => {
        if (hoverable) {
          e.currentTarget.style.transform = '';
          e.currentTarget.style.boxShadow = '';
        }
      }}
    >
      {children}
    </div>
  );
}
