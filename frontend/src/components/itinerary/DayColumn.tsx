import { useState } from 'react';
import { format, addDays, parseISO } from 'date-fns';
import { Plus } from 'lucide-react';
import { ActivityCard } from './ActivityCard';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import type { Activity } from '@/types';

interface DayColumnProps {
  dayNumber: number;
  date: string;
  activities: Activity[];
  onAddActivity: () => void;
  onEditActivity: (activity: Activity) => void;
  onDeleteActivity: (id: string) => void;
}

export function DayColumn({ dayNumber, date, activities, onAddActivity, onEditActivity, onDeleteActivity }: DayColumnProps) {
  const formattedDate = () => {
    try {
      return format(parseISO(date), 'EEE, MMM d');
    } catch {
      return `Day ${dayNumber}`;
    }
  };

  return (
    <div style={{ minWidth: 280, flex: 1, backgroundColor: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)', background: 'rgba(99,102,241,0.1)' }}>
        <h3 style={{ fontSize: 14, fontWeight: 700 }}>Day {dayNumber}</h3>
        <p style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{formattedDate()}</p>
      </div>
      <div style={{ padding: 16, minHeight: 200 }}>
        {activities.map((activity, index) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            index={index}
            onEdit={() => onEditActivity(activity)}
            onDelete={() => onDeleteActivity(activity.id)}
          />
        ))}
        {activities.length === 0 && (
          <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--color-text-secondary)', fontSize: 13 }}>
            No activities yet
          </div>
        )}
        <Button variant="ghost" size="sm" fullWidth onClick={onAddActivity} icon={<Plus size={16} />}>
          Add Activity
        </Button>
      </div>
    </div>
  );
}
