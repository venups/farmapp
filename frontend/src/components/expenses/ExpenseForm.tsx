import { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { TextArea } from '../common/TextArea';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { EXPENSE_CATEGORIES, CURRENCIES } from '@/types';
import type { ExpenseUpdate } from '@/types';

interface ExpenseFormProps {
  tripId: string;
  initialData?: ExpenseUpdate & { category?: string; currency?: string };
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
  isOpen: boolean;
}

export function ExpenseForm({ tripId, initialData, onSubmit, isLoading, onCancel, isOpen }: ExpenseFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [amount, setAmount] = useState(initialData?.amount?.toString() || '');
  const [currency, setCurrency] = useState(initialData?.currency || 'USD');
  const [category, setCategory] = useState(initialData?.category || '');
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [paymentMethod, setPaymentMethod] = useState(initialData?.payment_method || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      trip_id: tripId, title,
      amount: parseFloat(amount), currency, category, date,
      notes: notes || undefined,
      payment_method: paymentMethod || undefined,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={initialData ? 'Edit Expense' : 'New Expense'} size="sm">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="What was this for?" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Input label="Amount" type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required placeholder="0.00" />
          <Select label="Currency" value={currency} onChange={(e) => setCurrency(e.target.value)} options={CURRENCIES.map((c) => ({ value: c, label: c }))} />
        </div>
        <Select label="Category" value={category} onChange={(e) => setCategory(e.target.value)} options={EXPENSE_CATEGORIES.map((c) => ({ value: c.value, label: `${c.emoji} ${c.label}` }))} placeholder="Select category" required />
        <Input label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <Select label="Payment Method" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} options={[{ value: '', label: 'Select...' }, { value: 'cash', label: '💵 Cash' }, { value: 'card', label: '💳 Card' }, { value: 'digital', label: '📱 Digital' }]} placeholder="Select method" />
        <TextArea label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
          <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button type="submit" isLoading={isLoading}>{initialData ? 'Save Changes' : 'Add Expense'}</Button>
        </div>
      </form>
    </Modal>
  );
}
