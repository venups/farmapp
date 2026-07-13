import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { TripForm } from '@/components/trips/TripForm';
import toast from 'react-hot-toast';
import type { TripUpdate } from '@/types';

export function TripEditPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [initialData, setInitialData] = useState<TripUpdate | undefined>(undefined);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const token = localStorage.getItem('tripforge_token');
        const res = await fetch(`/api/trips/${tripId}`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) {
          const trip = await res.json();
          setInitialData({
            title: trip.title, description: trip.description, destination: trip.destination,
            country: trip.country, start_date: trip.start_date, end_date: trip.end_date,
            budget: trip.budget, currency: trip.currency, tags: trip.tags,
            is_public: trip.is_public, notes: trip.notes, cover_image_url: trip.cover_image_url,
          });
        }
      } catch {
        // API not available
      } finally {
        setFetching(false);
      }
    };
    fetchTrip();
  }, [tripId]);

  const handleSubmit = async (data: TripUpdate) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('tripforge_token');
      const res = await fetch(`/api/trips/${tripId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        navigate(`/trips/${tripId}`);
        toast.success('Trip updated!');
      } else {
        const err = await res.json();
        toast.error(err.detail || 'Failed to update trip');
      }
    } catch {
      toast.error('Failed to update trip');
    } finally {
      setIsLoading(false);
    }
  };

  if (fetching) return <div style={{ textAlign: 'center', padding: 60 }}><p style={{ color: 'var(--color-text-secondary)' }}>Loading...</p></div>;

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} icon={<ArrowLeft size={16} />} style={{ marginBottom: 20 }}>
        Back
      </Button>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>Edit Trip</h1>
      <TripForm initialData={initialData} onSubmit={handleSubmit} isLoading={isLoading} submitLabel="Save Changes" />
    </div>
  );
}
