import React, { HTMLAttributes } from 'react';
import { Plus } from 'lucide-react';
import ActivityCard from './ActivityCard';
import Badge from '../common/Badge';
import { Activity } from '@/types';

interface DayColumnProps extends HTMLAttributes<HTMLDivElement> {
  dayNumber: number;
  date: string;
  activities: Activity[];
  onAddActivity: () => void;
  onEditActivity?: (activity: Activity) => void;
  onDeleteActivity?: (id: string) => void;
}

export default function DayColumn({
  dayNumber,
  date,
  activities,
  onAddActivity,
  onEditActivity,
  onDeleteActivity,
  className = '',
}: DayColumnProps) {
  return (
    <div className={`flex flex-col rounded-xl bg-slate-800/50 backdrop-blur-md border border-slate-700 ${className}`}>
      <div className="p-4 border-b border-slate-700/50 bg-gradient-to-r from-indigo-900/20 to-purple-900/20">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-indigo-400">Day {dayNumber}</h3>
          <Badge variant="neutral" size="sm">
            {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </Badge>
        </div>
      </div>

      <div className="flex-1 p-3 space-y-2 min-h-[200px]">
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-slate-500 border-2 border-dashed border-slate-700/50 rounded-lg">
            <p className="text-sm">No activities yet</p>
            <button
              onClick={onAddActivity}
              className="mt-2 text-sm text-indigo-400 hover:text-indigo-300"
            >
              Add activity
            </button>
          </div>
        ) : (
          activities.map((activity, index) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              index={index}
              onEdit={() => onEditActivity?.(activity)}
              onDelete={() => onDeleteActivity?.(activity.id)}
            />
          ))
        )}
      </div>

      <button
        onClick={onAddActivity}
        className="w-full py-3 rounded-b-xl bg-slate-700/50 hover:bg-indigo-600/10 text-slate-300 hover:text-indigo-400 transition-colors flex items-center justify-center gap-2 border-t border-slate-700/50"
      >
        <Plus className="w-4 h-4" />
        Add Activity
      </button>
    </div>
  );
}
