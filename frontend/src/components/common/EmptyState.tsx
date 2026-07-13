import { Compass } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
      <div style={{ marginBottom: 16, color: 'var(--color-text-secondary)', opacity: 0.5 }}>
        <Compass size={48} />
      </div>
      <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{title}</h3>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24, maxWidth: 400, margin: '0 auto 24px' }}>
        {description}
      </p>
      {action}
    </div>
  );
}
