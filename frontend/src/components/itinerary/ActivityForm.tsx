import { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { TextArea } from '../common/TextArea';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { ACTIVITY_CATEGORIES } from '@/types';
import type { ActivityUpdate } from '@/types';

interface ActivityFormProps {
  tripId: string;
  dayNumber: number;
  totalDays: number;
  initialData?: ActivityUpdate & { category?: string; day_number?: number };
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
  isOpen: boolean;
}

export function ActivityForm({ tripId, dayNumber, totalDays, initialData, onSubmit, isLoading, onCancel, isOpen }: ActivityFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [startTime, setStartTime] = useState(initialData?.start_time || '');
  const [endTime, setEndTime] = useState(initialData?.end_time || '');
  const [locationName, setLocationName] = useState(initialData?.location_name || '');
  const [address, setAddress] = useState(initialData?.address || '');
  const [estimatedCost, setEstimatedCost] = useState(initialData?.estimated_cost?.toString() || '');
  const [bookingUrl, setBookingUrl] = useState(initialData?.booking_url || '');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [dayNum, setDayNum] = useState(initialData?.day_number || dayNumber);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      trip_id: tripId,
      day_number: dayNum,
      title, category, description,
      start_time: startTime || undefined,
      end_time: endTime || undefined,
      location_name: locationName || undefined,
      address: address || undefined,
      estimated_cost: estimatedCost ? parseFloat(estimatedCost) : undefined,
      booking_url: bookingUrl || undefined,
      notes: notes || undefined,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={initialData ? 'Edit Activity' : 'New Activity'} size="lg">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Activity name" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Select label="Category" value={category} onChange={(e) => setCategory(e.target.value)} options={ACTIVITY_CATEGORIES.map((c) => ({ value: c.value, label: `${c.emoji} ${c.label}` }))} placeholder="Select category" required />
          <Select label="Day" value={String(dayNum)} onChange={(e) => setDayNum(parseInt(e.target.value))} options={Array.from({ length: totalDays }, (_, i) => ({ value: String(i + 1), label: `Day ${i + 1}` }))} required />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Input label="Start Time" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          <Input label="End Time" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
        </div>
        <Input label="Location Name" value={locationName} onChange={(e) => setLocationName(e.target.value)} placeholder="Place name" />
        <Input label="Address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street address" />
        <Input label="Estimated Cost" type="number" value={estimatedCost} onChange={(e) => setEstimatedCost(e.target.value)} placeholder="0" />
        <Input label="Booking URL" value={bookingUrl} onChange={(e) => setBookingUrl(e.target.value)} placeholder="https://..." />
        <TextArea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
        <TextArea label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
          <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button type="submit" isLoading={isLoading}>{initialData ? 'Save Changes' : 'Add Activity'}</Button>
        </div>
      </form>
    </Modal>
  );
}
