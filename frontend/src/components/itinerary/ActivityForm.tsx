import React from 'react';
import { useForm } from 'react-hook-form';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import TextArea from '../common/TextArea';
import { ActivityCreate, ACTIVITY_CATEGORIES } from '@/types';

interface ActivityFormProps {
  tripId: string;
  dayNumber: number;
  totalDays: number;
  initialData?: Partial<ActivityCreate>;
  onSubmit: (data: ActivityCreate) => Promise<void>;
  isLoading?: boolean;
  onCancel?: () => void;
}

interface ActivityFormData {
  title: string;
  category: string;
  description?: string;
  start_time?: string;
  end_time?: string;
  location_name?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  estimated_cost?: number;
  currency: string;
  booking_url?: string;
  notes?: string;
}

const CURRENCY_OPTIONS = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD'];

export default function ActivityForm({
  tripId,
  dayNumber,
  totalDays,
  initialData,
  onSubmit,
  isLoading = false,
  onCancel,
}: ActivityFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<ActivityFormData>({
    defaultValues: {
      title: initialData?.title || '',
      category: initialData?.category || 'attraction',
      description: initialData?.description || '',
      start_time: initialData?.start_time || '',
      end_time: initialData?.end_time || '',
      location_name: initialData?.location_name || '',
      address: initialData?.address || '',
      latitude: initialData?.latitude || undefined,
      longitude: initialData?.longitude || undefined,
      estimated_cost: initialData?.estimated_cost || 0,
      currency: initialData?.currency || 'USD',
      booking_url: initialData?.booking_url || '',
      notes: initialData?.notes || '',
    },
  });

  const handleSubmitData = (data: ActivityFormData) => {
    onSubmit({ 
      ...data, 
      trip_id: tripId, 
      day_number: dayNumber,
      category: data.category as any
    } as any);
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitData)} className="space-y-4">
      <div className="mb-6 bg-indigo-500/10 rounded-lg p-4">
        <p className="text-sm text-indigo-300">
          Trip: {tripId} • Day {dayNumber} of {totalDays}
        </p>
      </div>

      <Input
        label="Title"
        placeholder="Activity name"
        error={errors.title?.message}
        required
        {...register('title', {
          required: 'Activity title is required',
          minLength: { value: 3, message: 'Title must be at least 3 characters' },
        })}
      />

      <Select
        label="Category"
        options={ACTIVITY_CATEGORIES.map((c) => ({ value: c.value, label: `${c.emoji} ${c.label}` }))}
        {...register('category', { required: 'Category is required' })}
        error={errors.category?.message}
      />

      <TextArea
        label="Description"
        placeholder="Details about this activity..."
        rows={3}
        {...register('description')}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Start Time"
          type="time"
          {...register('start_time')}
        />
        <Input
          label="End Time"
          type="time"
          {...register('end_time')}
        />
      </div>

      <Input
        label="Location Name"
        placeholder="Where is this activity?"
        {...register('location_name')}
      />

      <Input
        label="Address"
        placeholder="Full address (optional)"
        {...register('address')}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Latitude"
          type="number"
          step="0.00001"
          placeholder="e.g., 48.8566"
          {...register('latitude', { valueAsNumber: true })}
        />
        <Input
          label="Longitude"
          type="number"
          step="0.00001"
          placeholder="e.g., 2.3522"
          {...register('longitude', { valueAsNumber: true })}
        />
      </div>

      <Input
        label="Estimated Cost"
        type="number"
        step="0.01"
        placeholder="0.00"
        {...register('estimated_cost', { valueAsNumber: true })}
      />

      <Select
        label="Currency"
        options={CURRENCY_OPTIONS.map((c) => ({ value: c, label: c }))}
        {...register('currency')}
      />

      <Input
        label="Booking URL"
        placeholder="https://..."
        {...register('booking_url')}
      />

      <TextArea
        label="Notes"
        placeholder="Any additional information..."
        rows={2}
        {...register('notes')}
      />

      <div className="flex justify-end gap-3 mt-6">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" isLoading={isLoading} disabled={isLoading}>
          Save Activity
        </Button>
      </div>
    </form>
  );
}
