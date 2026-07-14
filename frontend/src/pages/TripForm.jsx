import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tripService } from '../services/api';
import { ArrowLeft, Save } from 'lucide-react';

const TripForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    destinations: '',
    start_date: '',
    end_date: '',
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { 
        ...formData, 
        destinations: formData.destinations.split(',').map(d => d.trim()).filter(d => d) 
      };
      await tripService.create(data);
      navigate('/');
    } catch (err) {
      alert("Error creating trip. Please check your inputs.");
    }
  };

  return (
    <div className="form-container">
      <button onClick={() => navigate('/')} className="btn-back">
        <ArrowLeft size={20} /> Cancel
      </button>
      <h1>Plan New Trip</h1>
      <form onSubmit={handleSubmit} className="trip-form">
        <div className="form-group">
          <label>Trip Name</label>
          <input 
            required 
            value={formData.name} 
            onChange={e => setFormData({...formData, name: e.target.value})} 
          />
        </div>
        <div className="form-group">
          <label>Destinations (comma separated)</label>
          <input 
            required 
            value={formData.destinations} 
            onChange={e => setFormData({...formData, destinations: e.target.value})} 
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Start Date</label>
            <input 
              type="date" 
              required 
              value={formData.start_date} 
              onChange={e => setFormData({...formData, start_date: e.target.value})} 
            />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input 
              type="date" 
              required 
              value={formData.end_date} 
              onChange={e => setFormData({...formData, end_date: e.target.value})} 
            />
          </div>
        </div>
        <div className="form-group">
          <label>Notes</label>
          <textarea 
            value={formData.notes} 
            onChange={e => setFormData({...formData, notes: e.target.value})} 
          />
        </div>
        <button type="submit" className="btn-primary">
          <Save size={20} /> Create Trip
        </button>
      </form>
    </div>
  );
};

export default TripForm;
