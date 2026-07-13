import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, DollarSign, Edit, Trash2, Users, Tag } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Tabs } from '@/components/common/Tabs';
import { Badge } from '@/components/common/Badge';
import { Card } from '@/components/common/Card';
import { TripStatusBadge } from '@/components/trips/TripStatusBadge';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Avatar } from '@/components/common/Avatar';
import { TripMap } from '@/components/maps/TripMap';
import { PhotoGallery } from '@/components/photos/PhotoGallery';
import { format } from 'date-fns';
import type { Trip, Activity } from '@/types';
import toast from 'react-hot-toast';

export function TripDetailPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('tripforge_token');
        const [tripRes, actRes] = await Promise.all([
          fetch(`/api/trips/${tripId}`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`/api/activities/trip/${tripId}`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        if (tripRes.ok) setTrip(await tripRes.json());
        if (actRes.ok) setActivities(await actRes.json());
      } catch {
        // API not available
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [tripId]);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('tripforge_token');
      await fetch(`/api/trips/${tripId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/trips');
      toast.success('Trip deleted');
    } catch {
      toast.error('Failed to delete trip');
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'itinerary', label: 'Itinerary' },
    { id: 'expenses', label: 'Expenses' },
    { id: 'packing', label: 'Packing' },
    { id: 'map', label: 'Map' },
    { id: 'photos', label: 'Photos' },
  ];

  if (!trip && !isLoading) {
    return <div style={{ textAlign: 'center', padding: 60 }}><h2>Trip not found</h2><Button onClick={() => navigate('/trips')}>Back to Trips</Button></div>;
  }

  return (
    <div>
      <div style={{ height: 240, borderRadius: 'var(--radius-lg)', background: trip?.cover_image_url ? undefined : 'linear-gradient(135deg, #6366F1, #8B5CF6)', position: 'relative', overflow: 'hidden', marginBottom: 24 }}>
        {trip?.cover_image_url && <img src={trip.cover_image_url} alt={trip.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 24, background: 'linear-gradient(transparent, rgba(0,0,0,0.7))' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>{trip?.title}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, color: 'rgba(255,255,255,0.9)', fontSize: 14 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={14} />{trip?.destination}{trip?.country ? `, ${trip.country}` : ''}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={14} />{trip && format(new Date(trip.start_date), 'MMM d')} - {trip && format(new Date(trip.end_date), 'MMM d, yyyy')}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button variant="secondary" size="sm" onClick={() => navigate(`/trips/${tripId}/edit`)} icon={<Edit size={14} />}>Edit</Button>
              <Button variant="danger" size="sm" onClick={() => setShowDeleteDialog(true)} icon={<Trash2 size={14} />}>Delete</Button>
            </div>
          </div>
        </div>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'overview' && trip && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
          <div>
            {trip.description && <Card style={{ marginBottom: 24 }}><p style={{ lineHeight: 1.7, color: 'var(--color-text-secondary)' }}>{trip.description}</p></Card>}
            {trip.tags.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                <Tag size={16} style={{ color: 'var(--color-text-secondary)' }} />
                {trip.tags.map((tag, i) => <Badge key={i}>{tag}</Badge>)}
              </div>
            )}
            {trip.notes && <Card><h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Notes</h3><p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>{trip.notes}</p></Card>}
          </div>
          <div>
            <Card style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Trip Details</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}>Status</span>
                  <TripStatusBadge status={trip.status} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}>Duration</span>
                  <span style={{ fontSize: 13 }}>{trip.duration_days} days</span>
                </div>
                {trip.budget && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}>Budget</span>
                    <span style={{ fontSize: 13 }}>{trip.currency} {trip.budget.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </Card>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Users size={16} style={{ color: 'var(--color-text-secondary)' }} />
                <h3 style={{ fontSize: 14, fontWeight: 600 }}>Collaborators</h3>
              </div>
              <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>No collaborators added yet</p>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'itinerary' && <ItineraryContent tripId={tripId!} activities={activities} />}
      {activeTab === 'map' && <TripMap activities={activities} />}
      {activeTab === 'photos' && <PhotoGallery tripId={tripId!} photos={[]} onUpload={() => {}} onDelete={() => {}} />}
      {activeTab === 'expenses' && <p style={{ color: 'var(--color-text-secondary)' }}>Expense details for this trip</p>}
      {activeTab === 'packing' && <p style={{ color: 'var(--color-text-secondary)' }}>Packing list for this trip</p>}

      <ConfirmDialog isOpen={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} onConfirm={handleDelete} title="Delete Trip" message="Are you sure? This will delete the trip and all associated activities, expenses, and packing items." confirmText="Delete" confirmVariant="danger" />
    </div>
  );
}

function ItineraryContent({ tripId, activities }: { tripId: string; activities: Activity[] }) {
  return (
    <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 16 }}>
      {activities.length > 0 ? (
        Object.entries(
          activities.reduce((acc, act) => {
            const day = act.day_number;
            if (!acc[day]) acc[day] = [];
            acc[day].push(act);
            return acc;
          }, {} as Record<number, Activity[]>)
        ).sort(([a], [b]) => Number(a) - Number(b)).map(([day, dayActivities]) => (
          <div key={day} style={{ minWidth: 280, flex: 1, backgroundColor: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Day {day}</h3>
            {dayActivities.map((act) => (
              <div key={act.id} style={{ padding: '8px 12px', backgroundColor: 'var(--color-bg-dark)', borderRadius: 'var(--radius-md)', marginBottom: 8, fontSize: 13 }}>
                <strong>{act.title}</strong>
                {act.start_time && <span style={{ color: 'var(--color-text-secondary)', marginLeft: 8 }}>{act.start_time}</span>}
              </div>
            ))}
          </div>
        ))
      ) : (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--color-text-secondary)' }}>No activities yet. Start building your itinerary!</div>
      )}
    </div>
  );
}

import { ItineraryPage } from './ItineraryPage';
import { ExpensesPage } from './ExpensesPage';
import { PackingPage } from './PackingPage';
