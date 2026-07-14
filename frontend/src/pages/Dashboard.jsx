import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tripService } from '../services/api';
import { Plus, Plane, CheckCircle2, Circle } from 'lucide-react';

const Dashboard = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tripService.getAll()
      .then(res => setTrips(res.data))
      .catch(err => console.error("Error fetching trips:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading your adventures...</div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>My Travels</h1>
        <Link to="/trips/new" className="btn-primary">
          <Plus size={20} /> Plan New Trip
        </Link>
      </header>

      {trips.length === 0 ? (
        <div className="empty-state">
          <Plane size={64} />
          <p>No trips yet — plan your first one!</p>
        </div>
      ) : (
        <div className="trips-grid">
          {trips.map(trip => (
            <Link to={`/trips/${trip.id}`} key={trip.id} className="boarding-pass-card">
              <div className="pass-main">
                <div className="pass-info">
                  <h3>{trip.name}</h3>
                  <p className="destinations">{trip.destinations.join(', ')}</p>
                  <div className="dates">
                    <span>{trip.start_date}</span>
                    <span className="arrow">→</span>
                    <span>{trip.end_date}</span>
                  </div>
                </div>
                <div className="pass-stub">
                  <Plane size={24} />
                  <span>VIEW</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
