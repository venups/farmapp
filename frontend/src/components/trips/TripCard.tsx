import React, { HTMLAttributes } from 'react';
import { Calendar, MapPin, Wallet } from 'lucide-react';
import Badge from '../common/Badge';
import { TRIP_STATUSES } from '@/types';

interface TripCardProps extends HTMLAttributes<HTMLDivElement> {
  trip: {
    id: string;
    title: string;
    destination: string;
    country?: string | null;
    cover_image_url?: string | null;
    start_date: string;
    end_date: string;
    status: string;
    budget?: number | null;
    currency?: string;
    duration_days?: number;
  };
  onClick: () => void;
}

export default function TripCard({ trip, onClick, className = '', ...props }: TripCardProps) {
  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatDateWithYear = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getStatusInfo = (status: string) => {
    return TRIP_STATUSES.find((s) => s.value === status) || TRIP_STATUSES[0];
  };

  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-xl bg-slate-800 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/10 cursor-pointer ${className}`}
      {...props}
    >
      <div className="relative h-48">
        {trip.cover_image_url ? (
          <img
            src={trip.cover_image_url}
            alt={trip.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-violet-700" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
        <div className="absolute top-3 right-3">
          <Badge variant={getStatusInfo(trip.status).color as any} size="sm">
            {getStatusInfo(trip.status).label}
          </Badge>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-xl font-semibold text-white mb-2 line-clamp-1 group-hover:text-indigo-400 transition-colors">
          {trip.title}
        </h3>
        <div className="space-y-2 text-sm text-slate-400">
          {trip.destination && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-500" />
              <span>
                {trip.destination}
                {trip.country && `, ${trip.country}`}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-500" />
                <span>
                  {formatDate(trip.start_date)} - {formatDate(trip.end_date)}, {new Date(trip.end_date).getFullYear()}
                </span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-center gap-6 text-sm">
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="text-slate-500">{trip.duration_days || 0}d</span>
          </div>
          {trip.budget && (
            <div className="flex items-center gap-1.5 text-slate-400">
              <Wallet className="w-4 h-4" />
              <span>{formatCurrency(trip.budget, trip.currency)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
