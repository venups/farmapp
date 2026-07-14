import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import apiClient from '../api'

function TripDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [trip, setTrip] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    loadTrip()
  }, [id])

  const loadTrip = async () => {
    try {
      setLoading(true)
      const res = await apiClient.trips.get(id)
      setTrip(res.data)
    } catch (err) {
      setError('Failed to load trip')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this trip? This cannot be undone.')) return
    try {
      await apiClient.trips.delete(id)
      navigate('/trips')
    } catch (err) {
      setError('Failed to delete trip')
    }
  }

  if (loading) return <div className="loading">Loading trip...</div>
  if (!trip) return <div className="empty-state"><p>Trip not found</p></div>

  const checklistProgress = trip.checklist?.length > 0
    ? Math.round((trip.checklist.filter(i => i.completed).length / trip.checklist.length) * 100)
    : 0
  const budgetTotal = trip.budget?.reduce((sum, i) => sum + i.amount, 0) || 0

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'checklist', label: `Checklist (${trip.checklist?.length || 0})` },
    { key: 'budget', label: `Budget ($${budgetTotal.toFixed(0)})` },
    { key: 'itinerary', label: `Itinerary (${trip.itinerary?.length || 0})` },
  ]

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <Link to="/trips" style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem' }}>
              ← Back to Trips
            </Link>
          </div>
          <h2 style={{ fontSize: '2rem' }}>{trip.title}</h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', marginTop: 4 }}>
            {trip.destination} · {trip.start_date} → {trip.end_date}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to={`/trips/${id}/edit`} className="btn btn-secondary">Edit</Link>
          <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
        </div>
      </div>

      {trip.description && (
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24, fontSize: '0.95rem', lineHeight: 1.7 }}>
          {trip.description}
        </p>
      )}

      <div style={{ display: 'flex', gap: 20, marginBottom: 28 }}>
        <div className="card" style={{ flex: 1, padding: '16px 20px' }}>
          <span className={`badge badge-${trip.status}`}>{trip.status.replace('_', ' ')}</span>
        </div>
        <div className="card" style={{ flex: 1, padding: '16px 20px' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Prep Progress
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6 }}>
            <div style={{ flex: 1, height: 6, background: 'var(--color-border)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{
                width: `${checklistProgress}%`, height: '100%',
                background: checklistProgress === 100 ? 'var(--color-success)' : 'var(--color-primary)',
                borderRadius: 3, transition: 'width 0.3s ease'
              }} />
            </div>
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{checklistProgress}%</span>
          </div>
        </div>
        <div className="card" style={{ flex: 1, padding: '16px 20px' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Total Budget
          </p>
          <p style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: 6, fontFamily: "'Playfair Display', serif" }}>
            ${budgetTotal.toFixed(2)}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid var(--color-border)', paddingBottom: 0 }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '10px 18px',
              background: 'none',
              borderBottom: activeTab === tab.key ? '2px solid var(--color-primary)' : '2px solid transparent',
              color: activeTab === tab.key ? 'var(--color-primary)' : 'var(--color-text-muted)',
              fontWeight: activeTab === tab.key ? 600 : 400,
              fontSize: '0.88rem',
              transition: 'all 150ms ease',
              marginBottom: -1,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && <OverviewTab trip={trip} />}
      {activeTab === 'checklist' && <ChecklistTab tripId={id} trip={trip} onUpdate={loadTrip} />}
      {activeTab === 'budget' && <BudgetTab tripId={id} trip={trip} onUpdate={loadTrip} />}
      {activeTab === 'itinerary' && <ItineraryTab tripId={id} trip={trip} onUpdate={loadTrip} />}
    </div>
  )
}

function OverviewTab({ trip }) {
  return (
    <div className="card">
      <h3 style={{ fontSize: '1.15rem', marginBottom: 16, fontFamily: "'Playfair Display', serif" }}>Trip Summary</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div>
          <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Destination</p>
          <p style={{ fontWeight: 500 }}>{trip.destination}</p>
        </div>
        <div>
          <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Duration</p>
          <p style={{ fontWeight: 500 }}>{trip.start_date} → {trip.end_date}</p>
        </div>
        <div>
          <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Checklist Items</p>
          <p style={{ fontWeight: 500 }}>{trip.checklist?.length || 0} items ({trip.checklist?.filter(i => i.completed).length || 0} done)</p>
        </div>
        <div>
          <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Budget Items</p>
          <p style={{ fontWeight: 500 }}>{trip.budget?.length || 0} items</p>
        </div>
        <div>
          <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Itinerary Days</p>
          <p style={{ fontWeight: 500 }}>{trip.itinerary?.length || 0} days planned</p>
        </div>
        <div>
          <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Created</p>
          <p style={{ fontWeight: 500 }}>{trip.created_at ? new Date(trip.created_at).toLocaleDateString() : 'N/A'}</p>
        </div>
      </div>
    </div>
  )
}

function ChecklistTab({ tripId, trip, onUpdate }) {
  const [newItem, setNewItem] = useState('')
  const [category, setCategory] = useState('general')
  const [adding, setAdding] = useState(false)

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!newItem.trim()) return
    try {
      setAdding(true)
      await apiClient.checklist.add(tripId, { text: newItem, completed: false, category })
      setNewItem('')
      onUpdate()
    } catch (err) {
      alert('Failed to add checklist item')
    } finally {
      setAdding(false)
    }
  }

  const handleToggle = async (itemId) => {
    try {
      await apiClient.checklist.toggle(tripId, itemId)
      onUpdate()
    } catch (err) {
      alert('Failed to toggle item')
    }
  }

  const handleDelete = async (itemId) => {
    try {
      await apiClient.checklist.delete(tripId, itemId)
      onUpdate()
    } catch (err) {
      alert('Failed to delete item')
    }
  }

  const categories = ['general', 'documents', 'clothing', 'electronics', 'health', 'other']

  return (
    <div>
      <form onSubmit={handleAdd} style={{
        display: 'flex', gap: 10, marginBottom: 20,
      }}>
        <input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add a checklist item..."
          style={{ flex: 1 }}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: 140 }}>
          {categories.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
        </select>
        <button type="submit" className="btn btn-primary" disabled={adding}>
          {adding ? 'Adding...' : 'Add'}
        </button>
      </form>

      {trip.checklist?.length === 0 ? (
        <div className="empty-state" style={{ padding: '40px 20px' }}>
          <h3>No checklist items</h3>
          <p>Add items you need to prepare for your trip.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 8 }}>
          {trip.checklist.map((item) => (
            <div key={item.id || item._id} className="card" style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px',
              opacity: item.completed ? 0.6 : 1,
            }}>
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => handleToggle(item.id || item._id)}
                style={{ width: 18, height: 18, cursor: 'pointer', accentColor: 'var(--color-primary)' }}
              />
              <div style={{ flex: 1 }}>
                <p style={{
                  textDecoration: item.completed ? 'line-through' : 'none',
                  fontWeight: 500,
                  fontSize: '0.92rem',
                }}>
                  {item.text}
                </p>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {item.category}
                </span>
              </div>
              <button
                onClick={() => handleDelete(item.id || item._id)}
                style={{
                  background: 'none', color: 'var(--color-text-muted)', fontSize: '1.1rem',
                  padding: '4px 8px', borderRadius: 4, transition: 'color 150ms',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-danger)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function BudgetTab({ tripId, trip, onUpdate }) {
  const [newItem, setNewItem] = useState({ category: '', amount: '', description: '' })
  const [adding, setAdding] = useState(false)

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!newItem.category || !newItem.amount) return
    try {
      setAdding(true)
      await apiClient.budget.add(tripId, {
        category: newItem.category,
        amount: parseFloat(newItem.amount),
        description: newItem.description,
      })
      setNewItem({ category: '', amount: '', description: '' })
      onUpdate()
    } catch (err) {
      alert('Failed to add budget item')
    } finally {
      setAdding(false)
    }
  }

  const handleDelete = async (itemId) => {
    try {
      await apiClient.budget.delete(tripId, itemId)
      onUpdate()
    } catch (err) {
      alert('Failed to delete budget item')
    }
  }

  const total = trip.budget?.reduce((sum, i) => sum + i.amount, 0) || 0

  return (
    <div>
      <div className="card" style={{ marginBottom: 20, padding: '18px 24px' }}>
        <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Total Budget
        </p>
        <p style={{ fontSize: '2rem', fontWeight: 700, fontFamily: "'Playfair Display', serif", marginTop: 4 }}>
          ${total.toFixed(2)}
        </p>
      </div>

      <form onSubmit={handleAdd} className="card" style={{ marginBottom: 20 }}>
        <h4 style={{ fontSize: '0.95rem', marginBottom: 14, fontFamily: "'Playfair Display', serif" }}>Add Budget Item</h4>
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            value={newItem.category}
            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
            placeholder="Category (e.g. Flight)"
            style={{ flex: 1 }}
          />
          <input
            type="number"
            step="0.01"
            value={newItem.amount}
            onChange={(e) => setNewItem({ ...newItem, amount: e.target.value })}
            placeholder="Amount"
            style={{ width: 120 }}
          />
          <input
            value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            placeholder="Description (optional)"
            style={{ flex: 1.5 }}
          />
          <button type="submit" className="btn btn-primary" disabled={adding}>
            {adding ? 'Adding...' : 'Add'}
          </button>
        </div>
      </form>

      {trip.budget?.length === 0 ? (
        <div className="empty-state" style={{ padding: '40px 20px' }}>
          <h3>No budget items</h3>
          <p>Track your estimated expenses for this trip.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 8 }}>
          {trip.budget.map((item) => (
            <div key={item.id || item._id} className="card" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px',
            }}>
              <div>
                <p style={{ fontWeight: 500 }}>{item.category}</p>
                {item.description && (
                  <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>{item.description}</p>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontWeight: 600, fontSize: '1rem' }}>${item.amount.toFixed(2)}</span>
                <button
                  onClick={() => handleDelete(item.id || item._id)}
                  style={{
                    background: 'none', color: 'var(--color-text-muted)', fontSize: '1.1rem',
                    padding: '4px 8px', borderRadius: 4, transition: 'color 150ms',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-danger)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ItineraryTab({ tripId, trip, onUpdate }) {
  const [newDay, setNewDay] = useState({ day_number: '', date: '', title: '' })
  const [adding, setAdding] = useState(false)
  const [expandedDay, setExpandedDay] = useState(null)
  const [newActivity, setNewActivity] = useState({ title: '', description: '', time: '', location: '' })
  const [activityDayIndex, setActivityDayIndex] = useState(null)

  const handleAddDay = async (e) => {
    e.preventDefault()
    if (!newDay.day_number) return
    try {
      setAdding(true)
      const dayData = {
        day_number: parseInt(newDay.day_number),
        date: newDay.date || '',
        activities: newDay.title ? [{ title: newDay.title, description: '', time: '', location: '', cost: 0 }] : [],
      }
      await apiClient.itinerary.addDay(tripId, dayData)
      setNewDay({ day_number: '', date: '', title: '' })
      onUpdate()
    } catch (err) {
      alert('Failed to add itinerary day')
    } finally {
      setAdding(false)
    }
  }

  const handleAddActivity = async (e) => {
    e.preventDefault()
    if (!newActivity.title || activityDayIndex === null) return
    try {
      await apiClient.itinerary.addActivity(tripId, activityDayIndex, {
        title: newActivity.title,
        description: newActivity.description,
        time: newActivity.time,
        location: newActivity.location,
        cost: 0,
      })
      setNewActivity({ title: '', description: '', time: '', location: '' })
      onUpdate()
    } catch (err) {
      alert('Failed to add activity')
    }
  }

  return (
    <div>
      <form onSubmit={handleAddDay} className="card" style={{ marginBottom: 20 }}>
        <h4 style={{ fontSize: '0.95rem', marginBottom: 14, fontFamily: "'Playfair Display', serif" }}>Add Day</h4>
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            type="number"
            value={newDay.day_number}
            onChange={(e) => setNewDay({ ...newDay, day_number: e.target.value })}
            placeholder="Day #"
            style={{ width: 80 }}
          />
          <input
            type="date"
            value={newDay.date}
            onChange={(e) => setNewDay({ ...newDay, date: e.target.value })}
            style={{ flex: 0.7 }}
          />
          <input
            value={newDay.title}
            onChange={(e) => setNewDay({ ...newDay, title: e.target.value })}
            placeholder="First activity title (optional)"
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn btn-primary" disabled={adding}>
            {adding ? 'Adding...' : 'Add Day'}
          </button>
        </div>
      </form>

      {trip.itinerary?.length === 0 ? (
        <div className="empty-state" style={{ padding: '40px 20px' }}>
          <h3>No itinerary days</h3>
          <p>Plan your day-by-day activities for this trip.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {trip.itinerary.map((day, index) => (
            <div key={day.id || index} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div
                onClick={() => setExpandedDay(expandedDay === index ? null : index)}
                style={{
                  padding: '16px 20px', cursor: 'pointer',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: expandedDay === index ? 'var(--color-surface-hover)' : 'transparent',
                  transition: 'background 150ms ease',
                }}
              >
                <div>
                  <h4 style={{ fontSize: '1rem', marginBottom: 2 }}>
                    Day {day.day_number} {day.date && <span style={{ fontWeight: 400, color: 'var(--color-text-muted)' }}>— {day.date}</span>}
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                    {(day.activities?.length || 0)} activit{(day.activities?.length || 0) !== 1 ? 'ies' : 'y'}
                  </p>
                </div>
                <span style={{ color: 'var(--color-text-muted)', transition: 'transform 200ms', transform: expandedDay === index ? 'rotate(180deg)' : 'rotate(0)' }}>
                  ▾
                </span>
              </div>

              {expandedDay === index && (
                <div style={{ padding: '0 20px 16px', borderTop: '1px solid var(--color-border-light)' }}>
                  {(day.activities || []).map((act, actIdx) => (
                    <div key={act.id || actIdx} style={{
                      padding: '10px 0',
                      borderBottom: actIdx < (day.activities?.length || 0) - 1 ? '1px solid var(--color-border-light)' : 'none',
                    }}>
                      <p style={{ fontWeight: 500, fontSize: '0.92rem' }}>{act.title}</p>
                      <div style={{ display: 'flex', gap: 16, fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
                        {act.time && <span>🕐 {act.time}</span>}
                        {act.location && <span>📍 {act.location}</span>}
                        {act.cost > 0 && <span>💰 ${act.cost.toFixed(2)}</span>}
                      </div>
                      {act.description && <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: 4 }}>{act.description}</p>}
                    </div>
                  ))}

                  <form onSubmit={handleAddActivity} style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                    <input
                      value={newActivity.title}
                      onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                      placeholder="Activity title"
                      onClick={() => setActivityDayIndex(index)}
                      style={{ flex: 1 }}
                    />
                    <input
                      type="time"
                      value={newActivity.time}
                      onChange={(e) => setNewActivity({ ...newActivity, time: e.target.value })}
                      style={{ width: 120 }}
                    />
                    <button type="submit" className="btn btn-secondary btn-sm">
                      + Activity
                    </button>
                  </form>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TripDetail
