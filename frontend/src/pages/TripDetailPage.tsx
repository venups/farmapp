import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import Tabs from '@/components/common/Tabs';
import BudgetProgress from '@/components/expenses/BudgetProgress';
import ExpenseChart from '@/components/expenses/ExpenseChart';
import PackingCategory from '@/components/packing/PackingCategory';
import TripMap from '@/components/maps/TripMap';
import PhotoGallery from '@/components/photos/PhotoGallery';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { TRIP_STATUSES } from '@/types';
import { Plane, Calendar, MapPin, Wallet, Package, Image } from 'lucide-react';
import { useTrips } from '@/context/TripsContext';

export function TripDetailPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { fetchTripById, currentTrip, deleteTrip } = useTrips();

  useEffect(() => {
    fetchTripById(tripId || '');
  }, [tripId]);

  const handleDelete = async () => {
    await deleteTrip(tripId || '');
    navigate('/trips');
  };

  const getStatusInfo = (status: string) => {
    return TRIP_STATUSES.find((s) => s.value === status) || TRIP_STATUSES[0];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!currentTrip) {
    return (
      <Card className="text-center py-16">
        <h2 className="text-xl font-semibold text-white">Trip not found</h2>
        <Button variant="secondary" className="mt-4" onClick={() => navigate('/trips')}>
          Back to Trips
        </Button>
      </Card>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'itinerary', label: 'Itinerary', icon: <Calendar size={16} /> },
    { id: 'expenses', label: 'Expenses', icon: <Wallet size={16} /> },
    { id: 'packing', label: 'Packing', icon: <Package size={16} /> },
    { id: 'map', label: 'Map', icon: <MapPin size={16} /> },
    { id: 'photos', label: 'Photos', icon: <Image size={16} /> },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card className="relative overflow-hidden" padding="lg">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-violet-800">
          <div className="absolute inset-0 bg-opacity-50"></div>
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="flex-1">
            <Badge variant={getStatusInfo(currentTrip.status).color as any} size="md">
              { getStatusInfo(currentTrip.status).label }
            </Badge>
            
            <h1 className="text-4xl font-bold text-white mt-4 mb-2">{currentTrip.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-slate-200">
              <div className="flex items-center gap-2">
                <MapPin size={18} />
                <span>{currentTrip.destination}{currentTrip.country && `, ${currentTrip.country}`}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>{formatDate(currentTrip.start_date)} - {formatDate(currentTrip.end_date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>{currentTrip.duration_days} days</span>
              </div>
            </div>

            {currentTrip.budget && (
              <div className="mt-4 flex items-center gap-2">
                <Wallet size={18} />
                <span>Budget: ${currentTrip.budget.toLocaleString()} {currentTrip.currency}</span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => navigate(`/trips/${currentTrip.id}/edit`)}
              variant="secondary"
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-3.536l3.536 3.536m-10.864-10.864l-3.536-3.536m-3.536 3.536l3.536 3.536m-10.864-10.864l-2.828-2.828" /></svg>}
            >
              Edit
            </Button>
            <Button
              onClick={() => setShowDeleteConfirm(true)}
              variant="danger"
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>}
            >
              Delete
            </Button>
          </div>
        </div>

        {currentTrip.description && (
          <p className="mt-6 text-slate-300">{currentTrip.description}</p>
        )}
      </Card>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Trip"
        message="Are you sure you want to delete this trip? This action cannot be undone."
        onConfirm={handleDelete}
        onClose={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}

// Import missing icons
import { Plane as PlaneIcon } from 'lucide-react';
