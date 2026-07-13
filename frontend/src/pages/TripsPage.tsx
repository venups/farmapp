import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { TripCard } from '@/components/trips/TripCard';
import { Tabs } from '@/components/common/Tabs';
import { SearchInput } from '@/components/common/SearchInput';
import { EmptyState } from '@/components/common/EmptyState';
import { Skeleton } from '@/components/common/Skeleton';
import { TRIP_STATUSES } from '@/types';
import type { Trip } from '@/types';

export function TripsPage() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const token = localStorage.getItem('tripforge_token');
        const res = await fetch('/api/trips/?per_page=50', {
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

  useEffect(() => {
    let result = [...trips];
    if (statusFilter !== 'all') {
      result = result.filter((t) => t.status === statusFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((t) => t.title.toLowerCase().includes(q) || t.destination.toLowerCase().includes(q));
    }
    setFilteredTrips(result);
  }, [trips, statusFilter, searchQuery]);

  const tabItems = [
    { id: 'all', label: 'All' },
    ...TRIP_STATUSES.map((s) => ({ id: s.value, label: s.label })),
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>My Trips</h1>
        <Button onClick={() => navigate('/trips/new')} icon={<Plus size={16} />}>New Trip</Button>
      </div>

      <div style={{ maxWidth: 400, marginBottom: 20 }}>
        <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Search trips..." />
      </div>

      <Tabs tabs={tabItems} activeTab={statusFilter} onTabChange={setStatusFilter} />

      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[1, 2, 3].map((i) => <Skeleton key={i} variant="rect" height={280} />)}
        </div>
      ) : filteredTrips.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {filteredTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} onClick={() => navigate(`/trips/${trip.id}`)} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={searchQuery ? 'No trips found' : 'No trips yet'}
          description={searchQuery ? 'Try a different search term' : 'Create your first trip to get started!'}
          action={!searchQuery && <Button onClick={() => navigate('/trips/new')} icon={<Plus size={16} />}>Create a Trip</Button>}
        />
      )}
    </div>
  );
}
