import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Map, Calendar, Globe, DollarSign, Plus, LayoutDashboard, Compass, CreditCard, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { TripCard } from '@/components/trips/TripCard';
import { EmptyState } from '@/components/common/EmptyState';
import { Skeleton } from '@/components/common/Skeleton';
import { format } from 'date-fns';
import type { Trip } from '@/types';

const QUICK_ACTIONS = [
  { label: 'New Trip', icon: <Plus size={20} />, path: '/trips/new' },
  { label: 'Browse Trips', icon: <Compass size={20} />, path: '/trips' },
  { label: 'View Expenses', icon: <CreditCard size={20} />, path: '/trips' },
  { label: 'Edit Profile', icon: <User size={20} />, path: '/profile' },
];

export function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/trips/?per_page=5', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setTrips(data.trips || []);
        }
      } catch {
        // API not available
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrips();
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const upcomingTrips = trips.filter((t) => t.status === 'planning' || t.status === 'ongoing');

  const stats = [
    { label: 'Total Trips', value: trips.length, icon: <Map size={20} />, color: '#6366F1' },
    { label: 'Upcoming', value: upcomingTrips.length, icon: <Calendar size={20} />, color: '#10B981' },
    { label: 'Countries', value: new Set(trips.map((t) => t.country).filter(Boolean)).size, icon: <Globe size={20} />, color: '#EC4899' },
    { label: 'Total Spent', value: '$0', icon: <DollarSign size={20} />, color: '#F59E0B' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>{greeting}, {user?.full_name?.split(' ')[0] || 'Traveler'}!</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
        </div>
        <Button onClick={() => navigate('/trips/new')} icon={<Plus size={16} />}>Plan a New Trip</Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {stats.map((stat, i) => (
          <Card key={i} hoverable>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: 24, fontWeight: 700 }}>{stat.value}</p>
                <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{stat.label}</p>
              </div>
              <div style={{ padding: 8, borderRadius: 8, backgroundColor: `${stat.color}20`, color: stat.color }}>
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600 }}>Upcoming Adventures</h2>
          <Link to="/trips" style={{ color: 'var(--color-primary)', fontSize: 14 }}>View All</Link>
        </div>
        {isLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[1, 2, 3].map((i) => <Skeleton key={i} variant="rect" height={250} />)}
          </div>
        ) : upcomingTrips.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {upcomingTrips.slice(0, 5).map((trip) => (
              <TripCard key={trip.id} trip={trip} onClick={() => navigate(`/trips/${trip.id}`)} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No upcoming trips"
            description="Time to plan your next adventure!"
            action={<Button onClick={() => navigate('/trips/new')} icon={<Plus size={16} />}>Create a Trip</Button>}
          />
        )}
      </div>

      <div>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {QUICK_ACTIONS.map((action, i) => (
            <Card key={i} hoverable onClick={() => navigate(action.path)} style={{ textAlign: 'center', padding: 24, cursor: 'pointer' }}>
              <div style={{ marginBottom: 12, color: 'var(--color-primary)', display: 'flex', justifyContent: 'center' }}>{action.icon}</div>
              <p style={{ fontSize: 14, fontWeight: 600 }}>{action.label}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
