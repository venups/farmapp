import { TRIP_STATUSES } from '@/types';
import { Badge } from '../common/Badge';
import type { TripStatus } from '@/types';

interface TripStatusBadgeProps {
  status: TripStatus;
}

const variantMap: Record<string, 'primary' | 'success' | 'neutral' | 'danger'> = {
  planning: 'primary',
  ongoing: 'success',
  completed: 'neutral',
  cancelled: 'danger',
};

export function TripStatusBadge({ status }: TripStatusBadgeProps) {
  const info = TRIP_STATUSES.find((s) => s.value === status);
  return (
    <Badge variant={variantMap[status] || 'neutral'}>
      {info?.label || status}
    </Badge>
  );
}
