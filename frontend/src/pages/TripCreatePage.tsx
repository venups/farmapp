import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { TripForm } from '@/components/trips/TripForm';
import toast from 'react-hot-toast';
import type { TripCreate } from '@/types';

export function TripCreatePage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: TripCreate) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/trips/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const newTrip = await res.json();
        navigate(`/trips/${newTrip.id}`);
        toast.success('Trip created!');
      } else {
        const err = await res.json();
        toast.error(err.detail || 'Failed to create trip');
      }
    } catch {
      toast.error('Failed to create trip');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} icon={<ArrowLeft size={16} />} style={{ marginBottom: 20 }}>
        Back
      </Button>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>Plan a New Trip</h1>
      <TripForm onSubmit={handleSubmit as any} isLoading={isLoading} submitLabel="Create Trip" />
    </div>
  );
}

import { useState } from 'react';
