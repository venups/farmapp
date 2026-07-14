import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { tripService, itineraryService, budgetService, checklistService } from '../services/api';
import { ArrowLeft, Plus, Trash2, CheckCircle, Circle } from 'lucide-react';

const TripDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [itinerary, setItinerary] = useState([]);
  const [budget, setBudget] = useState([]);
  const [checklist, setChecklist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      tripService.getOne(id),
      itineraryService.getByTrip(id),
      budgetService.getByTrip(id),
      checklistService.getByTrip(id)
    ])
    .then(([tRes, iRes, bRes, cRes]) => {
      setTrip(tRes.data);
      setItinerary(iRes.data);
      setBudget(bRes.data);
      setChecklist(cRes.data);
    })
    .catch(err => console.error("Error loading trip details:", err))
    .finally(() => setLoading(false));
  }, [id]);

  const handleToggleChecklist = async (item) => {
    await checklistService.update(item.id, { ...item, checked: !item.checked });
    setChecklist(checklist.map(i => i.id === item.id ? { ...i, checked: !i.checked } : i));
  };

  if (loading) return <div className="loading">Loading trip...</div>;
  if (!trip) return <div>Trip not found.</div>;

  return (
    <div className="trip-detail-container">
      <header className="trip-header">
        <button onClick={() => navigate('/')} className="btn-back">
          <ArrowLeft size={20} /> Back to Dashboard
        </button>
        <h1>{trip.name}</h1>
      </header>

      <div className="trip-grid">
        {/* General Info & Budget */}
        <section className="trip-section info-budget">
          <h2>Trip Overview</h2>
          <div className="info-card">
            <p><strong>Destinations:</strong> {trip.destinations.join(', ')}</p>
            <p><strong>Dates:</strong> {trip.start_date} to {trip.end_date}</p>
            <p><strong>Notes:</strong> {trip.notes || 'No notes'}</p>
          </div>

          <h3>Budget</h3>
          <div className="budget-list">
            {budget.map(item => (
              <div key={item.id} className="budget-item">
                <span>{item.description} ({item.category})</span>
                <span>${item.planned_amount} / ${item.actual_amount || 0}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Itinerary */}
        <section className="trip-section itinerary">
          <h2>Itinerary</h2>
          <div className="itinerary-timeline">
            {itinerary.map(day => (
              <div key={day.id} className="timeline-day">
                <h4>{day.date}</h4>
                <ul>
                  {day.activities.map((act, idx) => <li key={idx}>{act}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Checklist */}
        <section className="trip-section checklist">
          <h2>Checklist</h2>
          <div className="checklist-groups">
            {['packing', 'prep'].map(type => (
              <div key={type} className="checklist-group">
                <h3>{type === 'packing' ? 'Packing List' : 'Preparation'}</h3>
                <ul>
                  {checklist.filter(i => i.type === type).map(item => (
                    <li key={item.id} onClick={() => handleToggleChecklist(item)} className="checklist-item">
                      {item.checked ? <CheckCircle size={18} /> : <Circle size={18} />}
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default TripDetail;
