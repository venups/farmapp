import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import TripForm from '@/components/trips/TripForm';

export function TripEditPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const [trip, setTrip] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrip();
  }, [tripId]);

  const fetchTrip = async () => {
    setIsLoading(true);
    console.log('Fetching trip for edit:', tripId);
    
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const mockTrip = {
      id: tripId || '1',
      title: 'Tokyo Adventure 2025',
      description: 'Experience the best of Japan.',
      destination: 'Tokyo',
      country: 'Japan',
      start_date: '2025-08-15',
      end_date: '2025-08-25',
      budget: 2500,
      currency: 'USD',
      tags: ['city', 'food'],
      notes: 'Bring comfortable shoes!',
    };
    
    setTrip(mockTrip);
    setIsLoading(false);
  };

  const handleSubmit = async (data: any) => {
    setIsUpdating(true);
    console.log('Updating trip:', tripId, data);
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      console.log('Trip updated successfully!');
      toast.success('Trip updated successfully!');
      navigate(`/trips/${tripId}`);
    } catch (error) {
      console.error('Error updating trip:', error);
      toast.error('Failed to update trip');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!trip) {
    return (
      <Card className="text-center py-16">
        <h2 className="text-xl font-semibold text-white">Trip not found</h2>
        <Button variant="secondary" className="mt-4" onClick={() => navigate('/trips')}>
          Back to Trips
        </Button>
      </Card>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card padding="lg" className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Edit Trip</h1>
          <p className="text-slate-400">Update your trip details</p>
        </div>

        <TripForm
          initialData={trip}
          onSubmit={handleSubmit}
          isLoading={isUpdating}
          submitLabel="Save Changes"
        />
      </Card>
    </div>
  );
}
