"""
Trip detail page component.
"""
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { tripsApi, itineraryApi, budgetApi, checklistApi } from "../api/client";
import styles from "./TripDetailPage.module.css";

function TripDetailPage() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [itineraryDays, setItineraryDays] = useState([]);
  const [budgetItems, setBudgetItems] = useState([]);
  const [checklistItems, setChecklistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        const tripData = await tripsApi.getById(tripId);
        const days = await itineraryApi.getByTripId(tripId);
        const budget = await budgetApi.getByTripId(tripId);
        const checklist = await checklistApi.getByTripId(tripId);

        setTrip(tripData);
        setItineraryDays(days);
        setBudgetItems(budget);
        setChecklistItems(checklist);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (tripId) fetchTripData();
  }, [tripId]);

  const handleChecklistToggle = async (itemId, currentChecked) => {
    try {
      await checklistApi.update(itemId, { ...checklistItems.find(i => i.id === itemId), checked: !currentChecked });
      setChecklistItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, checked: !currentChecked } : item
      ));
    } catch (err) {
      alert(`Failed to update checklist item: ${err.message}`);
    }
  };

  const addChecklistItem = async () => {
    try {
      const newItem = await checklistApi.create({
        tripId: tripId,
        text: "New item",
        type: "packing",
        checked: false
      });
      setChecklistItems(prev => [...prev, newItem]);
    } catch (err) {
      alert(`Failed to add checklist item: ${err.message}`);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading trip details...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  if (!trip) {
    return <div className={styles.error}>Trip not found</div>;
  }

  const packingItems = checklistItems.filter(item => item.type === "packing");
  const prepItems = checklistItems.filter(item => item.type === "prep");

  return (
    <div className={styles.container}>
      <div className={styles.tripHeader}>
        <h2>{trip.name}</h2>
        <p className={styles.dates}>{
          `${new Date(trip.start_date).toLocaleDateString()} - ${new Date(trip.end_date).toLocaleDateString()}`
        }</p>
        <p className={styles.destinations}>{trip.destinations.join(", ")}</p>
        {trip.notes && <p className={styles.notes}>{trip.notes}</p>}
      </div>

      <div className={styles.sections}>
        <section className={styles.section}>
          <h3>Itinerary</h3>
          {itineraryDays.length === 0 ? (
            <p>No itinerary days yet. Add activities for each day of your trip.</p>
          ) : (
            <div className={styles.itineraryList}>
              {itineraryDays.map(day => (
                <div key={day.id} className={styles.dayCard}>
                  <h4>{new Date(day.date).toLocaleDateString()}</h4>
                  {day.activities.length > 0 ? (
                    <ul>
                      {day.activities.map((activity, index) => (
                        <li key={index}>{activity}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No activities planned for this day</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className={styles.section}>
          <h3>Budget</h3>
          {budgetItems.length === 0 ? (
            <p>No budget items yet. Add your estimated expenses.</p>
          ) : (
            <div className={styles.budgetList}>
              {budgetItems.map(item => (
                <div key={item.id} className={styles.budgetItem}>
                  <div>
                    <h4>{item.description}</h4>
                    <p>{item.category}</p>
                  </div>
                  <div className={styles.amounts}>
                    <span>Planned: {item.currency} {item.planned_amount.toFixed(2)}</span>
                    {item.actual_amount && <span>Actual: {item.currency} {item.actual_amount.toFixed(2)}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className={styles.section}>
          <h3>Checklists</h3>
          
          <div className={styles.checklistSection}>
            <h4>Packing List</h4>
            {packingItems.length === 0 ? (
              <p>No packing items yet. Add things you need to pack.</p>
            ) : (
              <ul className={styles.checklist}>
                {packingItems.map(item => (
                  <li key={item.id} className={styles.checklistItem}>
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => handleChecklistToggle(item.id, item.checked)}
                    />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={styles.checklistSection}>
            <h4>Preparation To-Dos</h4>
            {prepItems.length === 0 ? (
              <p>No prep items yet. Add tasks to complete before your trip.</p>
            ) : (
              <ul className={styles.checklist}>
                {prepItems.map(item => (
                  <li key={item.id} className={styles.checklistItem}>
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => handleChecklistToggle(item.id, item.checked)}
                    />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button onClick={addChecklistItem} className={styles.addButton}>+ Add Checklist Item</button>
        </section>
      </div>

      <Link to="/trips" className={styles.backButton}>← Back to All Trips</Link>
    </div>
  );
}

export default TripDetailPage;
