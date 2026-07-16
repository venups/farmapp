import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTrip, deleteTrip, getItineraryDays, createItineraryDay, updateItineraryDay, deleteItineraryDay, getBudgetItems, createBudgetItem, updateBudgetItem, deleteBudgetItem, getChecklistItems, createChecklistItem, updateChecklistItem, deleteChecklistItem } from '../api';

export default function TripDetail() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [itineraryDays, setItineraryDays] = useState([]);
  const [budgetItems, setBudgetItems] = useState([]);
  const [checklistItems, setChecklistItems] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTripData();
  }, [id]);

  async function loadTripData() {
    try {
      const [tripData, itineraryData, budgetData, checklistData] = await Promise.all([
        getTrip(id),
        getItineraryDays(id),
        getBudgetItems(id),
        getChecklistItems(id),
      ]);
      setTrip(tripData);
      setItineraryDays(itineraryData);
      setBudgetItems(budgetData);
      setChecklistItems(checklistData);
    } catch (err) {
      console.error('Failed to load trip data:', err);
    } finally {
      setLoading(false);
    }
  }

  function getStatus() {
    if (!trip) return 'Upcoming';
    const today = new Date();
    const start = new Date(trip.start_date);
    const end = new Date(trip.end_date);
    
    if (today < start) return 'Upcoming';
    if (today > end) return 'Completed';
    return 'Active';
  }

  async function handleDelete() {
    if (confirm('Are you sure you want to delete this trip?')) {
      try {
        await deleteTrip(id);
        window.location.href = '/';
      } catch (err) {
        console.error('Failed to delete trip:', err);
      }
    }
  }

  async function handleChecklistToggle(itemId, currentChecked) {
    try {
      await updateChecklistItem(itemId, { checked: !currentChecked });
      setChecklistItems(items => 
        items.map(item => item._id === itemId ? {...item, checked: !currentChecked} : item)
      );
    } catch (err) {
      console.error('Failed to toggle checklist item:', err);
    }
  }

  async function handleAddChecklistItem(text, type) {
    if (!text.trim()) return;
    try {
      const newItem = await createChecklistItem({ trip_id: id, text: text.trim(), item_type: type, checked: false });
      setChecklistItems(items => [...items, newItem]);
    } catch (err) {
      console.error('Failed to add checklist item:', err);
    }
  }

  async function handleDeleteChecklistItem(itemId) {
    try {
      await deleteChecklistItem(itemId);
      setChecklistItems(items => items.filter(item => item._id !== itemId));
    } catch (err) {
      console.error('Failed to delete checklist item:', err);
    }
  }

  async function handleAddBudgetItem(category, description, plannedAmount) {
    if (!description.trim() || !plannedAmount) return;
    try {
      const newItem = await createBudgetItem({ 
        trip_id: id, 
        category, 
        description: description.trim(), 
        planned_amount: parseFloat(plannedAmount),
        currency: 'USD'
      });
      setBudgetItems(items => [...items, newItem]);
    } catch (err) {
      console.error('Failed to add budget item:', err);
    }
  }

  async function handleAddItineraryDay(date) {
    if (!date) return;
    try {
      const newItem = await createItineraryDay({ 
        trip_id: id, 
        date, 
        activities: []
      });
      setItineraryDays(days => [...days, newItem].sort((a, b) => new Date(a.date) - new Date(b.date)));
    } catch (err) {
      console.error('Failed to add itinerary day:', err);
    }
  }

  if (loading) return <div className="loading">Loading...</div>;
  if (!trip) return <div className="error">Trip not found</div>;

  const packingItems = checklistItems.filter(item => item.item_type === 'packing');
  const prepItems = checklistItems.filter(item => item.item_type === 'prep');
  const packingProgress = packingItems.length > 0 
    ? Math.round((packingItems.filter(i => i.checked).length / packingItems.length) * 100) 
    : 0;

  return (
    <div className="trip-detail">
      <header className="trip-header-actions">
        <Link to="/" className="btn btn-secondary">← Back</Link>
        <button onClick={handleDelete} className="btn btn-danger">Delete Trip</button>
      </header>

      <section className="trip-info-card">
        <div className="trip-title-section">
          <h1>{trip.name}</h1>
          <span className={`status-badge ${getStatus().toLowerCase()}`}>{getStatus()}</span>
        </div>
        
        <div className="trip-meta">
          <div className="meta-item">
            <strong>Dates:</strong> {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
          </div>
          <div className="meta-item">
            <strong>Destinations:</strong> {trip.destinations.join(', ') || 'None'}
          </div>
        </div>

        {trip.notes && (
          <div className="trip-notes">
            <strong>Notes:</strong> {trip.notes}
          </div>
        )}
      </section>

      <nav className="tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'itinerary' ? 'active' : ''}`}
          onClick={() => setActiveTab('itinerary')}
        >
          Itinerary
        </button>
        <button 
          className={`tab ${activeTab === 'budget' ? 'active' : ''}`}
          onClick={() => setActiveTab('budget')}
        >
          Budget
        </button>
        <button 
          className={`tab ${activeTab === 'checklist' ? 'active' : ''}`}
          onClick={() => setActiveTab('checklist')}
        >
          Checklist
        </button>
      </nav>

      {activeTab === 'overview' && (
        <section className="overview-tab">
          <div className="progress-section">
            <h3>Packing Progress</h3>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${packingProgress}%` }}></div>
            </div>
            <span>{packingProgress}% complete ({packingItems.filter(i => i.checked).length}/{packingItems.length})</span>
          </div>
        </section>
      )}

      {activeTab === 'itinerary' && (
        <ItineraryTab 
          days={itineraryDays} 
          onAddDay={handleAddItineraryDay}
        />
      )}

      {activeTab === 'budget' && (
        <BudgetTab 
          items={budgetItems} 
          onAddItem={handleAddBudgetItem}
        />
      )}

      {activeTab === 'checklist' && (
        <ChecklistTab 
          packingItems={packingItems}
          prepItems={prepItems}
          onToggle={handleChecklistToggle}
          onAdd={handleAddChecklistItem}
          onDelete={handleDeleteChecklistItem}
        />
      )}
    </div>
  );
}

function ItineraryTab({ days, onAddDay }) {
  const [newDate, setNewDate] = useState('');

  return (
    <section className="itinerary-tab">
      <h2>Daily Itinerary</h2>
      
      <div className="add-day-form">
        <input 
          type="date" 
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
          placeholder="Select date"
        />
        <button onClick={() => { onAddDay(newDate); setNewDate(''); }} className="btn btn-primary">
          Add Day
        </button>
      </div>

      {days.length === 0 ? (
        <p className="empty-state">No itinerary days added yet.</p>
      ) : (
        <div className="itinerary-days">
          {days.map((day) => (
            <div key={day._id} className="itinerary-day-card">
              <h3>{new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</h3>
              {day.activities.length === 0 ? (
                <p className="empty-state">No activities for this day.</p>
              ) : (
                <ul className="activities-list">
                  {day.activities.map((activity, idx) => (
                    <li key={idx}>
                      {activity.time && <span className="activity-time">{activity.time}</span>}
                      {activity.description}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function BudgetTab({ items, onAddItem }) {
  const [category, setCategory] = useState('other');
  const [description, setDescription] = useState('');
  const [plannedAmount, setPlannedAmount] = useState('');

  const categories = ['lodging', 'food', 'transport', 'activities', 'other'];

  return (
    <section className="budget-tab">
      <h2>Budget</h2>

      <div className="add-budget-form">
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
          ))}
        </select>
        <input 
          type="text" 
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input 
          type="number" 
          placeholder="Planned amount"
          value={plannedAmount}
          onChange={(e) => setPlannedAmount(e.target.value)}
          step="0.01"
        />
        <button onClick={() => { onAddItem(category, description, plannedAmount); setDescription(''); setPlannedAmount(''); }} className="btn btn-primary">
          Add Item
        </button>
      </div>

      {items.length === 0 ? (
        <p className="empty-state">No budget items added yet.</p>
      ) : (
        <table className="budget-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Description</th>
              <th>Planned</th>
              <th>Actual</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td className="category-badge">{item.category}</td>
                <td>{item.description}</td>
                <td>${item.planned_amount.toFixed(2)}</td>
                <td>{item.actual_amount ? `$${item.actual_amount.toFixed(2)}` : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

function ChecklistTab({ packingItems, prepItems, onToggle, onAdd, onDelete }) {
  const [packingText, setPackingText] = useState('');
  const [prepText, setPrepText] = useState('');

  return (
    <section className="checklist-tab">
      <h2>Checklist</h2>

      <div className="checklist-section">
        <h3>Packing List</h3>
        <div className="add-item-form">
          <input 
            type="text" 
            placeholder="Add item..."
            value={packingText}
            onChange={(e) => setPackingText(e.target.value)}
            onKeyPress={(e) => { if (e.key === 'Enter') { onAdd(packingText, 'packing'); setPackingText(''); }}}
          />
          <button onClick={() => { onAdd(packingText, 'packing'); setPackingText(''); }} className="btn btn-secondary">Add</button>
        </div>
        
        {packingItems.length === 0 ? (
          <p className="empty-state">No packing items yet.</p>
        ) : (
          <ul className="checklist-items">
            {packingItems.map((item) => (
              <li key={item._id} className={`checklist-item ${item.checked ? 'checked' : ''}`}>
                <label>
                  <input 
                    type="checkbox" 
                    checked={item.checked}
                    onChange={() => onToggle(item._id, item.checked)}
                  />
                  {item.text}
                </label>
                <button onClick={() => onDelete(item._id)} className="btn-icon">×</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="checklist-section">
        <h3>Preparation / To-Do</h3>
        <div className="add-item-form">
          <input 
            type="text" 
            placeholder="Add task..."
            value={prepText}
            onChange={(e) => setPrepText(e.target.value)}
            onKeyPress={(e) => { if (e.key === 'Enter') { onAdd(prepText, 'prep'); setPrepText(''); }}}
          />
          <button onClick={() => { onAdd(prepText, 'prep'); setPrepText(''); }} className="btn btn-secondary">Add</button>
        </div>

        {prepItems.length === 0 ? (
          <p className="empty-state">No prep tasks yet.</p>
        ) : (
          <ul className="checklist-items">
            {prepItems.map((item) => (
              <li key={item._id} className={`checklist-item ${item.checked ? 'checked' : ''}`}>
                <label>
                  <input 
                    type="checkbox" 
                    checked={item.checked}
                    onChange={() => onToggle(item._id, item.checked)}
                  />
                  {item.text}
                </label>
                <button onClick={() => onDelete(item._id)} className="btn-icon">×</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
