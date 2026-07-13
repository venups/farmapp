import React from 'react';
import { useForm } from 'react-hook-form';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import TextArea from '../common/TextArea';
import { ExpenseCreate, EXPENSE_CATEGORIES } from '@/types';

interface ExpenseFormProps {
  tripId: string;
  initialData?: Partial<ExpenseCreate>;
  onSubmit: (data: ExpenseCreate) => Promise<void>;
  isLoading?: boolean;
  onCancel?: () => void;
}

interface ExpenseFormData {
  title: string;
  amount: number;
  currency: string;
  category: string;
  date: string;
  notes?: string;
  payment_method?: string;
}

const CURRENCY_OPTIONS = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD'];

export default function ExpenseForm({
  tripId,
  initialData,
  onSubmit,
  isLoading = false,
  onCancel,
}: ExpenseFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<ExpenseFormData>({
    defaultValues: {
      title: initialData?.title || '',
      amount: initialData?.amount || 0,
      currency: initialData?.currency || 'USD',
      category: initialData?.category || 'food',
      date: initialData?.date || new Date().toISOString().split('T')[0],
      notes: initialData?.notes || '',
      payment_method: initialData?.payment_method || '',
    },
  });

  const handleSubmitData = (data: ExpenseFormData) => {
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
        label="Title"
        placeholder="Expense description"
        error={errors.title?.message}
        required
        {...register('title', {
          required: 'Title is required',
          minLength: { value: 3, message: 'Title must be at least 3 characters' },
        })}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Amount"
          type="number"
          step="0.01"
          placeholder="0.00"
          error={errors.amount?.message}
          required
          {...register('amount', {
            required: 'Amount is required',
            min: { value: 0, message: 'Amount must be positive' },
            valueAsNumber: true,
          })}
        />
        <Select
          label="Currency"
          options={CURRENCY_OPTIONS.map((c) => ({ value: c, label: c }))}
          {...register('currency')}
        />
      </div>

      <Select
        label="Category"
        options={EXPENSE_CATEGORIES.map((c) => ({ value: c.value, label: `${c.emoji} ${c.label}` }))}
        {...register('category', { required: 'Category is required' })}
        error={errors.category?.message}
      />

      <Input
        label="Date"
        type="date"
        error={errors.date?.message}
        required
        {...register('date', { required: 'Date is required' })}
      />

      <Select
        label="Payment Method"
        options={[
          { value: 'credit_card', label: 'Credit Card' },
          { value: 'debit_card', label: 'Debit Card' },
          { value: 'cash', label: 'Cash' },
          { value: 'digital_wallet', label: 'Digital Wallet' },
          { value: 'bank_transfer', label: 'Bank Transfer' },
        ]}
        {...register('payment_method')}
      />

      <TextArea
        label="Notes"
        placeholder="Additional information..."
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
          Save Expense
        </Button>
      </div>
    </form>
  );
}
