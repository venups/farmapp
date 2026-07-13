import React from 'react';
import Badge from '../common/Badge';
import { TripStatus } from '@/types';

interface TripStatusBadgeProps {
  status: TripStatus;
}

export default function TripStatusBadge({ status }: TripStatusBadgeProps) {
  const getStatusInfo = () => {
    switch (status) {
      case 'planning':
        return { variant: 'primary', label: 'Planning' };
      case 'ongoing':
        return { variant: 'success', label: 'Ongoing' };
      case 'completed':
        return { variant: 'neutral', label: 'Completed' };
      case 'cancelled':
        return { variant: 'danger', label: 'Cancelled' };
      default:
        return { variant: 'neutral', label: status };
    }
  };

  const { variant, label } = getStatusInfo();

  return <Badge variant={variant as any}>{label}</Badge>;
}
