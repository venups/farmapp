
export function TripsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  
  const navigate = useNavigate();
  const { fetchTrips, trips, isLoading, pagination } = useTrips();

  useEffect(() => {
    fetchTrips({ 
      page: currentPage, 
      per_page: pagination.per_page,
      status: statusFilter === 'all' ? undefined : statusFilter,
      sort_by: sortBy === 'newest' ? 'created_at' : sortBy,
      sort_order: sortBy === 'newest' ? 'desc' : 'asc'
    });
  }, [fetchTrips, currentPage, statusFilter, sortBy]);

  const filteredTrips = trips.filter((trip: any) => {
    if (statusFilter !== 'all') {
      return trip.status === statusFilter;
    }
    return true;
  }).filter((trip: any) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      trip.title.toLowerCase().includes(query) ||
      (trip.destination && trip.destination.toLowerCase().includes(query)) ||
      (trip.country && trip.country.toLowerCase().includes(query))
    );
  });

  const sortedTrips = [...filteredTrips].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    if (sortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    if (sortBy === 'departure') return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
    if (sortBy === 'name') return a.title.localeCompare(b.title);
    return 0;
  });

  const totalPages = Math.ceil(sortedTrips.length / pagination.per_page) || 1;
  
  const getStatusInfo = (status: string) => {
    return TRIP_STATUSES.find((s) => s.value === status) || TRIP_STATUSES[0];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">My Trips</h1>
          <p className="text-slate-400 mt-1">{sortedTrips.length} trip(s) found</p>
        </div>
        <Button icon={<Plus size={18} />} onClick={() => navigate('/trips/new')}>
          New Trip
        </Button>
      </div>

      {/* Filter Bar */}
      <Card padding="sm">
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Search trips..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Select
            label=""
            placeholder="Status"
            options={[
              { value: 'all', label: 'All Statuses' },
              ...TRIP_STATUSES.map((s) => ({ value: s.value, label: s.label })),
            ]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
          <Select
            label=""
            placeholder="Sort by"
            options={[
              { value: 'newest', label: 'Newest' },
              { value: 'oldest', label: 'Oldest' },
              { value: 'departure', label: 'Departure Date' },
              { value: 'name', label: 'Name' },
            ]}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          />
        </div>
      </Card>

      {/* Trip Grid */}
      {sortedTrips.length === 0 ? (
        <EmptyState
          icon={<MapPin size={48} className="text-slate-500" />}
          title="No trips found"
          description={`No trips match your filters. Try adjusting your search or create a new trip.`}
          action={
            <Button onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}>
              Clear Filters
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedTrips.map((trip) => (
            <Card
              key={trip.id}
              hoverable
              onClick={() => navigate(`/trips/${trip.id}`)}
              className="cursor-pointer group"
            >
              <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                {trip.cover_image_url ? (
                  <img src={trip.cover_image_url} alt={trip.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-purple-800"></div>
                )}
                <span className="absolute top-3 right-3">
                  <Badge variant={getStatusInfo(trip.status).color as any} size="sm">
                    {getStatusInfo(trip.status).label}
                  </Badge>
                </span>
              </div>
              <h3 className="text-xl font-semibold text-white group-hover:text-indigo-400 transition-colors mb-2">
                {trip.title}
              </h3>
              <div className="space-y-1 text-sm text-slate-400">
                {trip.destination && (
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-slate-500" />
                    <span>
                      {trip.destination}
                      {trip.country && `, ${trip.country}`}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-slate-500" />
                  <span>
                    {new Date(trip.start_date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                    {' - '}
                    {new Date(trip.end_date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-8">
          <span className="text-sm text-slate-400">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i + 1 ? 'primary' : 'secondary'}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
            </div>
            <Button
                  variant="secondary"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                Next
              </Button>
          </div>
        </div>
      )}
    </div>
  );
}


import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import EmptyState from '@/components/common/EmptyState';
import { TRIP_STATUSES } from '@/types';
import { useTrips } from '@/context/TripsContext';
import { Plus, Calendar, MapPin } from 'lucide-react';