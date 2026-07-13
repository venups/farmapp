import { useState } from 'react';
import { Input } from '../common/Input';
import { TextArea } from '../common/TextArea';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { CURRENCIES } from '@/types';
import type { TripCreate, TripUpdate } from '@/types';

interface TripFormProps {
  initialData?: TripUpdate;
  onSubmit: (data: TripCreate | TripUpdate) => Promise<void>;
  isLoading: boolean;
  submitLabel: string;
}

export function TripForm({ initialData, onSubmit, isLoading, submitLabel }: TripFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [destination, setDestination] = useState(initialData?.destination || '');
  const [country, setCountry] = useState(initialData?.country || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [startDate, setStartDate] = useState(initialData?.start_date || '');
  const [endDate, setEndDate] = useState(initialData?.end_date || '');
  const [budget, setBudget] = useState(initialData?.budget?.toString() || '');
  const [currency, setCurrency] = useState(initialData?.currency || 'USD');
  const [tags, setTags] = useState(initialData?.tags?.join(', ') || '');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [isPublic, setIsPublic] = useState(initialData?.is_public || false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      title, destination, country, description,
      start_date: startDate, end_date: endDate,
      budget: budget ? parseFloat(budget) : undefined,
      currency,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      notes, is_public: isPublic,
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Input label="Trip Title" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g., Summer in Japan" />
      <Input label="Destination" value={destination} onChange={(e) => setDestination(e.target.value)} required placeholder="e.g., Tokyo" />
      <Input label="Country" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="e.g., Japan" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Input label="Start Date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
        <Input label="End Date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Input label="Budget" type="number" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="0" />
        <Select label="Currency" value={currency} onChange={(e) => setCurrency(e.target.value)} options={CURRENCIES.map((c) => ({ value: c, label: c }))} />
      </div>
      <Input label="Tags (comma-separated)" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g., adventure, food, culture" />
      <TextArea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} maxLength={2000} showCount placeholder="Describe your trip..." />
      <TextArea label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Private notes..." />
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
        <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} style={{ width: 18, height: 18, accentColor: 'var(--color-primary)' }} />
        <span style={{ fontSize: 14 }}>Make this trip public</span>
      </label>
      <Button type="submit" isLoading={isLoading} fullWidth>{submitLabel}</Button>
    </form>
  );
}
