"""
Trip list page component.
"""
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { tripsApi } from "../api/client";
import styles from "./TripListPage.module.css";

function TripListPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const data = await tripsApi.getAll();
        setTrips(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this trip?")) return;
    
    try {
      await tripsApi.delete(id);
      setTrips(trips.filter(trip => trip.id !== id));
    } catch (err) {
      alert(`Failed to delete trip: ${err.message}`);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading trips...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>My Trips</h2>
      
      {trips.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No trips yet — plan your first one!</p>
          <Link to="/trips/create" className={styles.createButton}>Create Trip</Link>
        </div>
      ) : (
        <>
          <Link to="/trips/create" className={styles.createButton}>+ New Trip</Link>
          
          <div className={styles.tripsGrid}>
            {trips.map(trip => (
              <div key={trip.id} className={styles.tripCard}>
                <h3>{trip.name}</h3>
                <p className={styles.destinations}>{trip.destinations.join(", ")}</p>
                <p className={styles.dates}>{
                  `${new Date(trip.start_date).toLocaleDateString()} - ${new Date(trip.end_date).toLocaleDateString()}`
                }</p>
                <p className={styles.status} style={{ color: getStatusColor(trip.status) }}>{trip.status}</p>
                
                <div className={styles.actions}>
                  <Link to={`/trips/${trip.id}`} className={styles.viewButton}>View</Link>
                  <button onClick={() => handleDelete(trip.id)} className={styles.deleteButton}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  function getStatusColor(status) {
    switch (status) {
      case "upcoming": return "#3498db";
      case "active": return "#e74c3c";
      case "completed": return "#2ecc71";
      default: return "#95a5a6";
    }
  }
}

export default TripListPage;
