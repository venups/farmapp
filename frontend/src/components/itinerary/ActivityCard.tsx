import React, { HTMLAttributes } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import Badge from '../common/Badge';
import { Activity, ACTIVITY_CATEGORIES } from '@/types';

interface ActivityCardProps extends HTMLAttributes<HTMLDivElement> {
  activity: Activity;
  index: number;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function ActivityCard({
  activity,
  index,
  onEdit,
  onDelete,
  className = '',
}: ActivityCardProps) {
  const getCategoryInfo = () => {
    return ACTIVITY_CATEGORIES.find((c) => c.value === activity.category);
  };

  const categoryInfo = getCategoryInfo();

  const formatTime = (timeString: string | null) => {
    if (!timeString) return '';
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`group relative rounded-lg bg-slate-700/30 p-4 border border-slate-600/30 hover:border-indigo-500/50 transition-all ${className}`}>
      <div className="flex gap-4">
        <div className="flex flex-col items-center pt-1">
          {categoryInfo ? (
            <span className="text-xl">{categoryInfo.emoji}</span>
          ) : (
            <div className="w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center text-xs">
              ?
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          {categoryInfo && (
            <Badge variant={activity.category as any} size="sm" className="mb-1">
              {categoryInfo.label}
            </Badge>
          )}
          <h4 className="font-medium text-slate-200 truncate mb-1">{activity.title}</h4>
          <div className="flex flex-wrap gap-2 text-xs text-slate-400">
            {(activity.start_time || activity.end_time) && (
              <span>
                {formatTime(activity.start_time)} - {formatTime(activity.end_time)}
              </span>
            )}
            {activity.location_name && <span className="truncate max-w-[150px]">{activity.location_name}</span>}
            {activity.estimated_cost && (
              <span>
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: activity.currency }).format(activity.estimated_cost)}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
            className="p-1.5 text-slate-400 hover:text-indigo-400 rounded hover:bg-indigo-500/10"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
            className="p-1.5 text-slate-400 hover:text-red-400 rounded hover:bg-red-500/10"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
