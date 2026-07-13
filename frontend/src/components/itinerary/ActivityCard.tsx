import { ACTIVITY_CATEGORIES, type Activity } from '@/types';
import { Card } from '../common/Card';
import { MapPin, Clock, DollarSign } from 'lucide-react';

interface ActivityCardProps {
  activity: Activity;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}

const categoryColors: Record<string, string> = {
  food: '#F59E0B',
  attraction: '#6366F1',
  transport: '#10B981',
  accommodation: '#EC4899',
  shopping: '#8B5CF6',
  entertainment: '#F43F5E',
  nature: '#22C55E',
  culture: '#A855F7',
  other: '#94A3B8',
};

export function ActivityCard({ activity, onEdit, onDelete }: ActivityCardProps) {
  const catInfo = ACTIVITY_CATEGORIES.find((c) => c.value === activity.category);
  const color = categoryColors[activity.category] || '#94A3B8';

  return (
    <Card padding="sm" style={{ borderLeft: `3px solid ${color}`, marginBottom: 12, position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <span>{catInfo?.emoji}</span>
            <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{catInfo?.label}</span>
          </div>
          <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{activity.title}</h4>
          {activity.start_time && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>
              <Clock size={12} />
              {activity.start_time}{activity.end_time ? ` - ${activity.end_time}` : ''}
            </div>
          )}
          {activity.location_name && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>
              <MapPin size={12} />
              {activity.location_name}
            </div>
          )}
          {activity.estimated_cost && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--color-text-secondary)' }}>
              <DollarSign size={12} />
              {activity.currency} {activity.estimated_cost}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button onClick={onEdit} style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', padding: 4 }} title="Edit">✏️</button>
          <button onClick={onDelete} style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', padding: 4 }} title="Delete">🗑️</button>
        </div>
      </div>
    </Card>
  );
}
