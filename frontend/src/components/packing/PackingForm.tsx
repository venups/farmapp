import { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { TextArea } from '../common/TextArea';
import { Button } from '../common/Button';
import { PACKING_CATEGORIES } from '@/types';
import type { PackingItemUpdate } from '@/types';

interface PackingFormProps {
  tripId: string;
  initialData?: PackingItemUpdate & { category?: string };
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
  isOpen: boolean;
}

export function PackingForm({ tripId, initialData, onSubmit, isLoading, onCancel, isOpen }: PackingFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [quantity, setQuantity] = useState(initialData?.quantity?.toString() || '1');
  const [isEssential, setIsEssential] = useState(initialData?.is_essential || false);
  const [notes, setNotes] = useState(initialData?.notes || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      trip_id: tripId, name, category,
      quantity: parseInt(quantity) || 1,
      is_essential: isEssential,
      notes: notes || undefined,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={initialData ? 'Edit Item' : 'New Packing Item'} size="sm">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Input label="Item Name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g., Toothbrush" />
        <Select label="Category" value={category} onChange={(e) => setCategory(e.target.value)} options={PACKING_CATEGORIES.map((c) => ({ value: c.value, label: `${c.emoji} ${c.label}` }))} placeholder="Select category" required />
        <Input label="Quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} min="1" />
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <input type="checkbox" checked={isEssential} onChange={(e) => setIsEssential(e.target.checked)} style={{ width: 18, height: 18, accentColor: 'var(--color-primary)' }} />
          <span style={{ fontSize: 14 }}>Essential item</span>
        </label>
        <TextArea label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
          <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button type="submit" isLoading={isLoading}>{initialData ? 'Save Changes' : 'Add Item'}</Button>
        </div>
      </form>
    </Modal>
  );
}
