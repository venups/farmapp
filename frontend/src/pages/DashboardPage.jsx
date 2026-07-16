"""
Dashboard page component.
"""
import { useState, useEffect } from "react";
import { tripsApi, checklistApi } from "../api/client";
import styles from "./DashboardPage.module.css";

function DashboardPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await tripsApi.getAll();
        setTrips(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateChecklistCompletion = async (tripId) => {
    try {
      const items = await checklistApi.getByTripId(tripId);
      if (items.length === 0) return 0;
      const completed = items.filter(item => item.checked).length;
      return Math.round((completed / items.length) * 100);
    } catch (err) {
      console.error("Error calculating checklist completion:", err);
      return 0;
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading dashboard...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  const upcomingTrips = trips.filter(trip => trip.status === "upcoming");
  const activeTrips = trips.filter(trip => trip.status === "active");
  const completedTrips = trips.filter(trip => trip.status === "completed");

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Dashboard</h2>
      
      {trips.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No trips yet — plan your first one!</p>
          <button className={styles.createButton} onClick={() => window.location.href = "/trips/create"}>Create Trip</button>
        </div>
      ) : (
        <>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <h3>Upcoming</h3>
              <p className={styles.statValue}>{upcomingTrips.length}</p>
            </div>
            <div className={styles.statCard}>
              <h3>Active</h3>
              <p className={styles.statValue}>{activeTrips.length}</p>
            </div>
            <div className={styles.statCard}>
              <h3>Completed</h3>
              <p className={styles.statValue}>{completedTrips.length}</p>
            </div>
          </div>

          <div className={styles.tripsList}>
            <h3>Your Trips</h3>
            {trips.map(trip => (
              <div key={trip.id} className={styles.tripCard}>
                <h4>{trip.name}</h4>
                <p className={styles.dates}>{new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}</p>
                <p className={styles.statusBadge} style={{ backgroundColor: getStatusColor(trip.status) }}>{trip.status}</p>
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

export default DashboardPage;
