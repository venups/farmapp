import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTrip } from '../api';

export default function TripForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    destinations: [''],
    start_date: '',
    end_date: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  }

  function handleDestinationChange(index, value) {
    const newDestinations = [...formData.destinations];
    newDestinations[index] = value;
    setFormData(prev => ({ ...prev, destinations: newDestinations }));
  }

  function addDestination() {
    setFormData(prev => ({ 
      ...prev, 
      destinations: [...prev.destinations, ''] 
    }));
  }

  function removeDestination(index) {
    if (formData.destinations.length > 1) {
      const newDestinations = formData.destinations.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, destinations: newDestinations }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Trip name is required';
    if (formData.destinations.some(d => !d.trim())) {
      newErrors.destinations = 'All destinations must be filled';
    }
    if (!formData.start_date) newErrors.start_date = 'Start date is required';
    if (!formData.end_date) newErrors.end_date = 'End date is required';
    
    if (formData.start_date && formData.end_date && new Date(formData.end_date) < new Date(formData.start_date)) {
      newErrors.end_date = 'End date must be after start date';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      const tripData = {
        name: formData.name.trim(),
        destinations: formData.destinations.filter(d => d.trim()),
        start_date: formData.start_date,
        end_date: formData.end_date,
        notes: formData.notes.trim() || null,
      };
      
      const createdTrip = await createTrip(tripData);
      navigate(`/trips/${createdTrip._id}`);
    } catch (err) {
      console.error('Failed to create trip:', err);
      setErrors({ submit: 'Failed to create trip. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="trip-form-page">
      <header className="form-header">
        <a href="/" className="btn btn-secondary">← Back</a>
        <h1>New Trip</h1>
      </header>

      <form onSubmit={handleSubmit} className="trip-form">
        {errors.submit && (
          <div className="error-message">{errors.submit}</div>
        )}

        <div className="form-group">
          <label htmlFor="name">Trip Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Summer Vacation 2026"
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label>Destinations *</label>
          {formData.destinations.map((dest, index) => (
            <div key={index} className="destination-input-row">
              <input
                type="text"
                placeholder={`Destination ${index + 1}`}
                value={dest}
                onChange={(e) => handleDestinationChange(index, e.target.value)}
              />
              {formData.destinations.length > 1 && (
                <button 
                  type="button" 
                  className="btn-icon remove-btn"
                  onClick={() => removeDestination(index)}
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addDestination} className="btn btn-secondary small">
            + Add Destination
          </button>
          {errors.destinations && <span className="field-error">{errors.destinations}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="start_date">Start Date *</label>
            <input
              type="date"
              id="start_date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
            />
            {errors.start_date && <span className="field-error">{errors.start_date}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="end_date">End Date *</label>
            <input
              type="date"
              id="end_date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
            />
            {errors.end_date && <span className="field-error">{errors.end_date}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes (optional)</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Any additional notes about this trip..."
            rows={4}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create Trip'}
          </button>
        </div>
      </form>
    </div>
  );
}
