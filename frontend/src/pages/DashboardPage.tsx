import { useState, useEffect } from 'react';
import { Calendar, MapPin, Wallet, Plane, Activity, Settings, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import { TRIP_STATUSES } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useTrips } from '@/context/TripsContext';

export function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { fetchTrips, trips, pagination } = useTrips();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await fetchTrips({ page: 1, per_page: 3 });
      setIsLoading(false);
    };
    loadData();
  }, [fetchTrips]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const totalTrips = trips.length;
  const upcomingTrips = trips.filter((t: any) => t.status !== 'completed');
  const countries = new Set(trips.map((t: any) => t.country).filter(Boolean)).size;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          {getGreeting()}, {user?.full_name}!
        </h1>
        <p className="text-slate-400">
          {formatDate(new Date().toISOString())}
        </p>
        <div className="mt-4">
          <Button icon={<Plus size={18} />} onClick={() => navigate('/trips/new')}>
            Plan a New Trip
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card hoverable className="relative overflow-hidden group">
          <div className="absolute top-4 right-4 text-sm font-medium text-indigo-400 opacity-80">
            Total
          </div>
          <div className="mt-4 flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 rounded-xl">
              <MapPin className="text-indigo-400" size={28} />
            </div>
            <div>
              <p className="text-4xl font-bold text-white">{totalTrips}</p>
              <p className="text-sm text-slate-400 mt-1">Total Trips</p>
            </div>
          </div>
        </Card>

        <Card hoverable className="relative overflow-hidden group">
          <div className="absolute top-4 right-4 text-sm font-medium text-emerald-400 opacity-80">
            Upcoming
          </div>
          <div className="mt-4 flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl">
              <Calendar className="text-emerald-400" size={28} />
            </div>
            <div>
              <p className="text-4xl font-bold text-white">{upcomingTrips.length}</p>
              <p className="text-sm text-slate-400 mt-1">Upcoming</p>
            </div>
          </div>
        </Card>

        <Card hoverable className="relative overflow-hidden group">
          <div className="absolute top-4 right-4 text-sm font-medium text-blue-400 opacity-80">
            Visited
          </div>
          <div className="mt-4 flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <Plane className="text-blue-400" size={28} />
            </div>
            <div>
              <p className="text-4xl font-bold text-white">{countries}</p>
              <p className="text-sm text-slate-400 mt-1">Countries</p>
            </div>
          </div>
        </Card>

        <Card hoverable className="relative overflow-hidden group">
          <div className="absolute top-4 right-4 text-sm font-medium text-emerald-400 opacity-80">
            Spent
          </div>
          <div className="mt-4 flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl">
              <Wallet className="text-emerald-400" size={28} />
            </div>
            <div>
              <p className="text-4xl font-bold text-white">$2,850</p>
              <p className="text-sm text-slate-400 mt-1">Total Spent</p>
            </div>
          </div>
        </Card>
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Upcoming Adventures</h2>
          <a href="/trips" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
            View All
          </a>
        </div>

        {trips.length === 0 ? (
          <Card className="text-center py-16">
            <div className="mb-4 p-4 rounded-full bg-slate-800 inline-flex">
              <Calendar className="text-slate-400" size={32} />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No Upcoming Trips</h3>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              You haven't planned any trips yet. It's time to start creating your next adventure!
            </p>
            <Button onClick={() => navigate('/trips/new')} icon={<Plus size={18} />}>
              Create Your First Trip
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip: any) => (
              <Card
                key={trip.id}
                hoverable
                onClick={() => navigate(`/trips/${trip.id}`)}
                className="cursor-pointer group"
              >
                <div className="relative h-32 mb-4 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-purple-800"></div>
                  <span className="absolute top-3 right-3">
                    <Badge variant="primary" size="sm">
                      {TRIP_STATUSES.find((s) => s.value === trip.status)?.label || 'Planning'}
                    </Badge>
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors mb-2">
                  {trip.title}
                </h3>
                <div className="flex items-center gap-2 text-slate-400">
                  <MapPin size={16} className="text-slate-500" />
                  <span>
                    {trip.destination}
                    {trip.country && `, ${trip.country}`}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Card id="activity-feed">
        <h2 className="text-xl font-semibold text-white mb-6">Recent Activity</h2>
        {trips.length > 0 ? (
          <div className="space-y-6">
            <div key="1" className="flex items-start gap-4">
              <div className="mt-1">
                <Activity size={20} className="text-indigo-400" />
              </div>
              <div>
                <p className="text-slate-300">You have {trips.length} trip(s) planned</p>
                <span className="text-xs text-slate-500">Just now</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-500">Your activity will appear here</p>
          </div>
        )}
      </Card>

      <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            icon: <Plus size={20} />,
            label: 'New Trip',
            onClick: () => navigate('/trips/new'),
          },
          {
            icon: <MapPin size={20} />,
            label: 'Browse Trips',
            onClick: () => navigate('/trips'),
          },
          {
            icon: <Wallet size={20} />,
            label: 'View Expenses',
            onClick: () => console.log('Navigate to expenses'),
          },
          {
            icon: <Settings size={20} />,
            label: 'Edit Profile',
            onClick: () => navigate('/profile'),
          },
        ].map((action, index) => (
          <Card
            key={index}
            hoverable
            onClick={action.onClick}
            className="cursor-pointer group"
          >
            <div className="p-4 bg-slate-800/50 rounded-xl w-fit mb-3 group-hover:bg-indigo-600 transition-colors">
              <div className="text-white group-hover:text-white">{action.icon}</div>
            </div>
            <p className="font-medium text-slate-300 group-hover:text-white transition-colors">
              {action.label}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
