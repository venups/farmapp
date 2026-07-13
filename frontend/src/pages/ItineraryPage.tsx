import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { addDays, parseISO, format } from 'date-fns';
import { DayColumn } from '@/components/itinerary/DayColumn';
import { ActivityForm } from '@/components/itinerary/ActivityForm';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import type { Activity, Trip } from '@/types';
import toast from 'react-hot-toast';

export function ItineraryPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [selectedDay, setSelectedDay] = useState(1);
  const [showDelete, setShowDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [tripRes, actRes] = await Promise.all([
          fetch(`/api/trips/${tripId}`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`/api/activities/trip/${tripId}`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        if (tripRes.ok) setTrip(await tripRes.json());
        if (actRes.ok) setActivities(await actRes.json());
      } catch {
        // API not available
      }
    };
    fetchData();
  }, [tripId]);

  const totalDays = trip?.duration_days || 7;

  const handleCreateActivity = async (data: any) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/activities/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const newActivity = await res.json();
        setActivities((prev) => [...prev, newActivity]);
        setShowForm(false);
        toast.success('Activity added!');
      }
    } catch {
      toast.error('Failed to add activity');
    }
  };

  const handleUpdateActivity = async (data: any) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/activities/${editingActivity?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const updated = await res.json();
        setActivities((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
        setEditingActivity(null);
        setShowForm(false);
        toast.success('Activity updated!');
      }
    } catch {
      toast.error('Failed to update activity');
    }
  };

  const handleDeleteActivity = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/activities/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setActivities((prev) => prev.filter((a) => a.id !== id));
      setShowDelete(null);
      toast.success('Activity deleted');
    } catch {
      toast.error('Failed to delete activity');
    }
  };

  const openAddForm = (day: number) => {
    setSelectedDay(day);
    setEditingActivity(null);
    setShowForm(true);
  };

  const openEditForm = (activity: Activity) => {
    setEditingActivity(activity);
    setSelectedDay(activity.day_number);
    setShowForm(true);
  };

  const days = Array.from({ length: totalDays }, (_, i) => {
    const startDate = trip ? addDays(parseISO(trip.start_date), i) : new Date();
    return {
      number: i + 1,
      date: format(startDate, 'yyyy-MM-dd'),
      activities: activities.filter((a) => a.day_number === i + 1),
    };
  });

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>Itinerary</h1>
      <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 16 }}>
        {days.map((day) => (
          <DayColumn
            key={day.number}
            dayNumber={day.number}
            date={day.date}
            activities={day.activities}
            onAddActivity={() => openAddForm(day.number)}
            onEditActivity={openEditForm}
            onDeleteActivity={(id) => setShowDelete(id)}
          />
        ))}
      </div>

      <ActivityForm
        tripId={tripId!}
        dayNumber={selectedDay}
        totalDays={totalDays}
        initialData={editingActivity ? { ...editingActivity, category: editingActivity.category, day_number: editingActivity.day_number } : undefined}
        onSubmit={editingActivity ? handleUpdateActivity : handleCreateActivity}
        isLoading={false}
        onCancel={() => { setShowForm(false); setEditingActivity(null); }}
        isOpen={showForm}
      />

      <ConfirmDialog
        isOpen={showDelete !== null}
        onClose={() => setShowDelete(null)}
        onConfirm={() => showDelete && handleDeleteActivity(showDelete)}
        title="Delete Activity"
        message="Are you sure you want to delete this activity?"
        confirmText="Delete"
        confirmVariant="danger"
      />
    </div>
  );
}
