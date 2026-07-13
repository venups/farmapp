import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import TextArea from '@/components/common/TextArea';
import { TRIP_STATUSES, CURRENCIES } from '@/types';
import { useTrips } from '@/context/TripsContext';

export function TripCreatePage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    destination: '',
    country: '',
    startDate: '',
    endDate: '',
    budget: '',
    currency: 'USD',
    status: 'planning',
  });
  
  const navigate = useNavigate();
  const { createTrip, isLoading } = useTrips();

  const handleChange = (field: keyof typeof formData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const tripData = {
        title: formData.title,
        description: formData.description || undefined,
        destination: formData.destination,
        country: formData.country || undefined,
        start_date: formData.startDate,
        end_date: formData.endDate,
        budget: formData.budget ? Number(formData.budget) : undefined,
        currency: formData.currency,
        status: formData.status as any,
        is_public: false,
      };
      
      const result = await createTrip(tripData);
      if (result) {
        navigate(`/trips/${result.id}`);
      }
    } catch (error) {
      console.error('Error creating trip:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Create New Trip</h1>
        <Button variant="secondary" onClick={() => navigate('/trips')}>
          Cancel
        </Button>
      </div>

      <Card padding="lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Trip Title
            </label>
            <Input
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="e.g., Tokyo Adventure"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Destination
            </label>
            <Input
              value={formData.destination}
              onChange={(e) => handleChange('destination', e.target.value)}
              placeholder="e.g., Tokyo"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Country
            </label>
            <Input
              value={formData.country}
              onChange={(e) => handleChange('country', e.target.value)}
              placeholder="e.g., Japan"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Description
            </label>
            <TextArea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Brief description of your trip..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 border-slate-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                End Date
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 border-slate-600"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Budget
              </label>
              <Input
                type="number"
                value={formData.budget}
                onChange={(e) => handleChange('budget', e.target.value)}
                placeholder="e.g., 2500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Currency
              </label>
              <Select
                value={formData.currency}
                onChange={(e) => handleChange('currency', e.target.value)}
                options={CURRENCIES.map((c) => ({ value: c, label: c }))}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Create Trip
          </Button>
        </form>
      </Card>
    </div>
  );
}
