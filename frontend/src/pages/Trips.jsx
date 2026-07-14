import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import apiClient from '../api'

function Trips() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadTrips()
  }, [])

  const loadTrips = async () => {
    try {
      setLoading(true)
      const res = await apiClient.trips.list()
      setTrips(res.data)
    } catch (err) {
      setError('Failed to load trips')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this trip?')) return
    try {
      await apiClient.trips.delete(id)
      setTrips(trips.filter(t => t.id !== id))
    } catch (err) {
      setError('Failed to delete trip')
    }
  }

  if (loading) return <div className="loading">Loading trips...</div>

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h2 style={{ fontSize: '2rem', marginBottom: 4 }}>My Trips</h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
            Manage your travel plans
          </p>
        </div>
        <Link to="/trips/create" className="btn btn-primary">
          + New Trip
        </Link>
      </div>

      {error && (
        <div style={{
          padding: '12px 16px',
          background: 'var(--color-danger-light)',
          color: 'var(--color-danger)',
          borderRadius: 'var(--radius-md)',
          marginBottom: 20,
          fontSize: '0.9rem',
        }}>
          {error}
        </div>
      )}

      {trips.length === 0 ? (
        <div className="empty-state">
          <h3>No trips planned yet</h3>
          <p>Start planning your next adventure by creating a new trip.</p>
          <Link to="/trips/create" className="btn btn-primary">Create Your First Trip</Link>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: 20,
        }}>
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}

function TripCard({ trip, onDelete }) {
  const daysCount = trip.itinerary?.length || 0
  const checklistProgress = trip.checklist?.length > 0
    ? Math.round((trip.checklist.filter(i => i.completed).length / trip.checklist.length) * 100)
    : 0
  const budgetTotal = trip.budget?.reduce((sum, i) => sum + i.amount, 0) || 0

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{
        height: 4,
        background: `linear-gradient(90deg, var(--color-primary), var(--color-accent))`,
      }} />
      <div style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <Link to={`/trips/${trip.id}`} style={{
            fontSize: '1.15rem',
            fontWeight: 600,
            fontFamily: "'Playfair Display', serif",
            textDecoration: 'none',
          }}>
            {trip.title}
          </Link>
          <span className={`badge badge-${trip.status}`}>{trip.status.replace('_', ' ')}</span>
        </div>

        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.92rem', marginBottom: 16 }}>
          {trip.destination}
        </p>

        <div style={{ display: 'flex', gap: 20, marginBottom: 16, fontSize: '0.84rem', color: 'var(--color-text-muted)' }}>
          <span>📅 {trip.start_date} → {trip.end_date}</span>
          <span>🗓 {daysCount} day{daysCount !== 1 ? 's' : ''}</span>
        </div>

        {trip.checklist && trip.checklist.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Prep progress</span>
              <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>{checklistProgress}%</span>
            </div>
            <div style={{
              height: 4,
              background: 'var(--color-border)',
              borderRadius: 2,
              overflow: 'hidden',
            }}>
              <div style={{
                width: `${checklistProgress}%`,
                height: '100%',
                background: checklistProgress === 100 ? 'var(--color-success)' : 'var(--color-primary)',
                borderRadius: 2,
                transition: 'width 0.3s ease',
              }} />
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>
            ${budgetTotal.toFixed(0)} budget
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <Link
              to={`/trips/${trip.id}/edit`}
              className="btn btn-secondary btn-sm"
            >
              Edit
            </Link>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onDelete(trip.id)}
              style={{ color: 'var(--color-danger)' }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Trips
