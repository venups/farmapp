import React from 'react';
import { useForm } from 'react-hook-form';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import TextArea from '../common/TextArea';
import Modal from '../common/Modal';
import { TripCreate, TRIP_STATUSES, CURRENCIES } from '@/types';

interface TripFormProps {
  initialData?: Partial<TripCreate>;
  onSubmit: (data: TripCreate) => Promise<void>;
  isLoading?: boolean;
  cancelLabel?: string;
  submitLabel?: string;
}

interface TripFormData {
  title: string;
  description?: string;
  destination: string;
  country?: string;
  start_date: string;
  end_date: string;
  budget?: number;
  currency: string;
  tags?: string[];
  is_public: boolean;
  notes?: string;
}

export default function TripForm({
  initialData,
  onSubmit,
  isLoading = false,
  cancelLabel = 'Cancel',
  submitLabel = 'Save Trip',
}: TripFormProps) {
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<TripFormData>({
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      destination: initialData?.destination || '',
      country: initialData?.country || '',
      start_date: initialData?.start_date || new Date().toISOString().split('T')[0],
      end_date: initialData?.end_date || '',
      budget: initialData?.budget || undefined,
      currency: initialData?.currency || 'USD',
      is_public: initialData?.is_public ?? false,
      notes: initialData?.notes || '',
    },
  });

  const tagsWatch = watch('tags', []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        label="Title"
        placeholder="Enter trip title"
        error={errors.title?.message}
        required
        {...register('title', { required: 'Trip title is required', minLength: { value: 3, message: 'Title must be at least 3 characters' } })}
      />

      <Input
        label="Destination"
        placeholder="Where are you going?"
        error={errors.destination?.message}
        required
        {...register('destination', { required: 'Destination is required' })}
      />

      <Input
        label="Country"
        placeholder="Country (optional)"
        {...register('country')}
      />

      <TextArea
        label="Description"
        placeholder="Describe your trip..."
        rows={4}
        {...register('description')}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Start Date"
          type="date"
          error={errors.start_date?.message}
          required
          {...register('start_date', { required: 'Start date is required' })}
        />
        <Input
          label="End Date"
          type="date"
          error={errors.end_date?.message}
          required
          {...register('end_date', { required: 'End date is required' })}
        />
      </div>

      <Input
        label="Budget"
        type="number"
        placeholder="0.00"
        {...register('budget', { valueAsNumber: true })}
      />

      <Select
        label="Currency"
        options={CURRENCIES.map((c) => ({ value: c, label: c }))}
        {...register('currency')}
      />

      <TextArea
        label="Tags (comma-separated)"
        placeholder="beach, mountains, culture..."
        {...register('tags', { 
          setValueAs: (v) => v ? v.split(',').map((t) => t.trim()) : [] 
        })}
      />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_public"
          {...register('is_public')}
          className="rounded border-slate-600 bg-slate-800 text-indigo-500 focus:ring-indigo-500"
        />
        <label htmlFor="is_public" className="text-sm text-slate-300">
          Make trip public
        </label>
      </div>

      <TextArea
        label="Notes"
        placeholder="Any additional information..."
        rows={3}
        {...register('notes')}
      />

      <div className="flex justify-end gap-3 mt-6">
        <Button type="button" variant="ghost" onClick={(e) => {
          e.preventDefault();
          window.history.back();
        }}>
          {cancelLabel}
        </Button>
        <Button type="submit" isLoading={isLoading} disabled={isLoading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
