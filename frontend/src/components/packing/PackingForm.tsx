import React from 'react';
import { useForm } from 'react-hook-form';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import TextArea from '../common/TextArea';
import { PackingItemCreate, PACKING_CATEGORIES } from '@/types';

interface PackingFormProps {
  tripId: string;
  initialData?: Partial<PackingItemCreate>;
  onSubmit: (data: PackingItemCreate) => Promise<void>;
  isLoading?: boolean;
  onCancel?: () => void;
}

interface PackingFormData {
  name: string;
  category: string;
  quantity: number;
  is_essential: boolean;
  notes?: string;
}

const QUANTITY_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

export default function PackingForm({
  tripId,
  initialData,
  onSubmit,
  isLoading = false,
  onCancel,
}: PackingFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<PackingFormData>({
    defaultValues: {
      name: initialData?.name || '',
      category: initialData?.category || 'clothing',
      quantity: initialData?.quantity || 1,
      is_essential: initialData?.is_essential ?? false,
      notes: initialData?.notes || '',
    },
  });

  const handleSubmitData = (data: PackingFormData) => {
    onSubmit({ 
      ...data, 
      trip_id: tripId,
      category: data.category as any
    } as any);
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitData)} className="space-y-4">
      <div className="mb-6 bg-indigo-500/10 rounded-lg p-4">
        <p className="text-sm text-indigo-300">Trip ID: {tripId}</p>
      </div>

      <Input
        label="Item Name"
        placeholder="What to pack?"
        error={errors.name?.message}
        required
        {...register('name', {
          required: 'Item name is required',
          minLength: { value: 2, message: 'Name must be at least 2 characters' },
        })}
      />

      <Select
        label="Category"
        options={PACKING_CATEGORIES.map((c) => ({ value: c.value, label: `${c.emoji} ${c.label}` }))}
        {...register('category', { required: 'Category is required' })}
        error={errors.category?.message}
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Quantity
          </label>
          <select
            className="w-full rounded-lg border bg-slate-900 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 py-2 px-3 border-slate-600"
            {...register('quantity', {
              valueAsNumber: true,
              min: { value: 1, message: 'Quantity must be at least 1' },
            })}
          >
            {QUANTITY_OPTIONS.map((q) => (
              <option key={q} value={q}>
                {q}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              className="rounded border-slate-600 bg-slate-800 text-indigo-500 focus:ring-indigo-500 w-4 h-4"
              {...register('is_essential')}
            />
            Essential item
          </label>
        </div>
      </div>

      <TextArea
        label="Notes"
        placeholder="Any details about this item..."
        rows={3}
        {...register('notes')}
      />

      <div className="flex justify-end gap-3 mt-6">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" isLoading={isLoading} disabled={isLoading}>
          Save Item
        </Button>
      </div>
    </form>
  );
}
