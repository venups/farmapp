import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchTrips } from '../api';

export default function Dashboard() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrips();
  }, []);

  async function loadTrips() {
    try {
      const data = await fetchTrips();
      setTrips(data);
    } catch (err) {
      console.error('Failed to load trips:', err);
    } finally {
      setLoading(false);
    }
  }

  function getStatus(trip) {
    const today = new Date();
    const start = new Date(trip.start_date);
    const end = new Date(trip.end_date);
    
    if (today < start) return 'Upcoming';
    if (today > end) return 'Completed';
    return 'Active';
  }

  function getChecklistCompletion(trip) {
    // Placeholder - will be implemented when we have checklist data
    return 0;
  }

  const statusCounts = trips.reduce((acc, trip) => {
    const status = getStatus(trip);
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Travel Planner</h1>
        <Link to="/trips/new" className="btn btn-primary">
          + New Trip
        </Link>
      </header>

      <section className="status-summary">
        <div className="status-card upcoming">
          <span className="status-label">Upcoming</span>
          <span className="status-count">{statusCounts.Upcoming || 0}</span>
        </div>
        <div className="status-card active">
          <span className="status-label">Active</span>
          <span className="status-count">{statusCounts.Active || 0}</span>
        </div>
        <div className="status-card completed">
          <span className="status-label">Completed</span>
          <span className="status-count">{statusCounts.Completed || 0}</span>
        </div>
      </section>

      {trips.length === 0 ? (
        <div className="empty-state">
          <p>No trips yet — plan your first one!</p>
          <Link to="/trips/new" className="btn btn-primary">
            Create Your First Trip
          </Link>
        </div>
      ) : (
        <section className="trip-list">
          {trips.map((trip) => (
            <Link key={trip._id} to={`/trips/${trip._id}`} className="trip-card">
              <div className="trip-header">
                <h2>{trip.name}</h2>
                <span className={`status-badge ${getStatus(trip).toLowerCase()}`}>
                  {getStatus(trip)}
                </span>
              </div>
              <div className="trip-destinations">
                {trip.destinations.join(', ')}
              </div>
              <div className="trip-dates">
                {new Date(trip.start_date).toLocaleDateString()} -{' '}
                {new Date(trip.end_date).toLocaleDateString()}
              </div>
            </Link>
          ))}
        </section>
      )}
    </div>
  );
}
