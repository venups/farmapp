import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import DayColumn from '@/components/itinerary/DayColumn';
import ActivityForm from '@/components/itinerary/ActivityForm';

interface Activity {
  id: string;
  trip_id: string;
  day_number: number;
  title: string;
  description: string | null;
  category: string;
  start_time: string | null;
  end_time: string | null;
  location_name: string | null;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  estimated_cost: number | null;
  currency: string;
  booking_url: string | null;
  notes: string | null;
  order_index: number;
  is_booked: boolean;
  rating: number | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export function ItineraryPage({ tripId, totalDays }: { tripId: string; totalDays: number }) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  useEffect(() => {
    fetchActivities();
  }, [tripId]);

  const fetchActivities = async () => {
    setIsLoading(true);
    console.log('Fetching activities for trip:', tripId);
    
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const mockActivities: Activity[] = [
      {
        id: '1',
        trip_id: tripId,
        day_number: 1,
        title: 'Explore Tokyo Tower',
        description: 'Visit the iconic Tokyo Tower for panoramic views of the city.',
        category: 'attraction',
        start_time: '09:00',
        end_time: '12:00',
        location_name: 'Tokyo Tower',
        latitude: 35.658581,
        longitude: 139.745438,
        address: 'Chiyoda, Tokyo',
        estimated_cost: 2100,
        currency: 'JPY',
        booking_url: null,
        notes: 'Buy tickets online to skip the line.',
        order_index: 0,
        is_booked: false,
        rating: null,
        image_url: null,
        created_at: '2025-08-15T00:00:00Z',
        updated_at: '2025-08-15T00:00:00Z',
      },
      {
        id: '2',
        trip_id: tripId,
        day_number: 1,
        title: 'Lunch at Tsukiji Market',
        description: 'Try fresh sushi at the famous market.',
        category: 'food',
        start_time: '12:30',
        end_time: '14:00',
        location_name: 'Tsukiji Outer Market',
        latitude: 35.667242,
        longitude: 139.772305,
        address: 'Chuo, Tokyo',
        estimated_cost: 1500,
        currency: 'JPY',
        booking_url: null,
        notes: 'Arrive early for the best selection.',
        order_index: 1,
        is_booked: false,
        rating: null,
        image_url: null,
        created_at: '2025-08-15T00:00:00Z',
        updated_at: '2025-08-15T00:00:00Z',
      },
    ];
    
    setActivities(mockActivities);
    setIsLoading(false);
  };

  const handleAddActivity = (dayNumber: number) => {
    setSelectedDay(dayNumber);
    setShowActivityForm(true);
  };

  const handleEditActivity = (activity: Activity) => {
    console.log('Edit activity:', activity.id);
  };

  const handleDeleteActivity = async (id: string) => {
    console.log('Deleting activity:', id);
    toast.success('Activity deleted');
  };

  const handleActivitySubmit = async (data: any) => {
    console.log('Activity submitted:', data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success('Activity added successfully!');
    setShowActivityForm(false);
    fetchActivities();
  };

  const groupedByDay: Record<number, any[]> = {};
  activities.forEach((activity) => {
    if (!groupedByDay[activity.day_number]) {
      groupedByDay[activity.day_number] = [];
    }
    groupedByDay[activity.day_number].push(activity);
  });

  const calculateDate = (dayNumber: number) => {
    const startDate = new Date('2025-08-15');
    startDate.setDate(startDate.getDate() + dayNumber - 1);
    return startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card padding="lg" className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Itinerary</h1>
          <p className="text-slate-400 mt-1">Plan your activities day by day</p>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-x-auto pb-4">
        {Array.from({ length: totalDays }, (_, i) => (
          <DayColumn
            key={i + 1}
            dayNumber={i + 1}
            date={calculateDate(i + 1)}
            activities={groupedByDay[i + 1] || []}
            onAddActivity={() => handleAddActivity(i + 1)}
            onEditActivity={handleEditActivity}
            onDeleteActivity={handleDeleteActivity}
          />
        ))}
      </div>

      <ActivityForm
        tripId={tripId}
        dayNumber={selectedDay || 1}
        totalDays={totalDays}
        onSubmit={handleActivitySubmit}
      />
    </div>
  );
}

export default ItineraryPage;
