import { format } from 'date-fns';
import { MapPin, Calendar, DollarSign } from 'lucide-react';
import { Card } from '../common/Card';
import { TripStatusBadge } from './TripStatusBadge';
import type { Trip } from '@/types';

interface TripCardProps {
  trip: Trip;
  onClick: () => void;
}

export function TripCard({ trip, onClick }: TripCardProps) {
  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'MMM d');
    } catch {
      return dateStr;
    }
  };

  return (
    <Card hoverable onClick={onClick} style={{ overflow: 'hidden', padding: 0, cursor: 'pointer' }}>
      <div style={{ height: 140, background: trip.cover_image_url ? undefined : 'linear-gradient(135deg, #6366F1, #8B5CF6)', position: 'relative' }}>
        {trip.cover_image_url ? (
          <img src={trip.cover_image_url} alt={trip.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MapPin size={40} style={{ color: 'rgba(255,255,255,0.5)' }} />
          </div>
        )}
        <div style={{ position: 'absolute', top: 12, right: 12 }}>
          <TripStatusBadge status={trip.status} />
        </div>
      </div>
      <div style={{ padding: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{trip.title}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-secondary)', fontSize: 13, marginBottom: 6 }}>
          <MapPin size={14} />
          <span>{trip.destination}{trip.country ? `, ${trip.country}` : ''}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-secondary)', fontSize: 13, marginBottom: 12 }}>
          <Calendar size={14} />
          <span>{formatDate(trip.start_date)} - {formatDate(trip.end_date)} ({trip.duration_days} days)</span>
        </div>
        {trip.budget && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-secondary)', fontSize: 13 }}>
            <DollarSign size={14} />
            <span>{trip.currency} {trip.budget.toLocaleString()}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
