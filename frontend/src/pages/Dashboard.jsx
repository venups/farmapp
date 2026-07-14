import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import apiClient from '../api'

function Dashboard() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      setLoading(true)
      const res = await apiClient.trips.dashboard()
      setTrips(res.data)
    } catch (err) {
      setError('Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  const stats = {
    total: trips.length,
    planning: trips.filter(t => t.status === 'planning').length,
    confirmed: trips.filter(t => t.status === 'confirmed').length,
    inProgress: trips.filter(t => t.status === 'in_progress').length,
    completed: trips.filter(t => t.status === 'completed').length,
    totalBudget: trips.reduce((sum, t) => sum + t.budget_total, 0),
  }

  if (loading) return <div className="loading">Loading dashboard...</div>
  if (error) return <div className="empty-state"><p>{error}</p></div>

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: '2rem', marginBottom: 4 }}>Dashboard</h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
          Overview of all your trips
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 16,
        marginBottom: 36,
      }}>
        <StatCard label="Total Trips" value={stats.total} color="var(--color-primary)" />
        <StatCard label="Planning" value={stats.planning} color="var(--color-primary)" />
        <StatCard label="Confirmed" value={stats.confirmed} color="var(--color-success)" />
        <StatCard label="In Progress" value={stats.inProgress} color="var(--color-warning)" />
        <StatCard label="Completed" value={stats.completed} color="var(--color-accent)" />
        <StatCard label="Total Budget" value={`$${stats.totalBudget.toFixed(0)}`} color="var(--color-text-secondary)" />
      </div>

      <h3 style={{ fontSize: '1.3rem', marginBottom: 16, fontFamily: "'Playfair Display', serif" }}>
        All Trips
      </h3>

      {trips.length === 0 ? (
        <div className="empty-state">
          <h3>No trips yet</h3>
          <p>Start planning your next adventure!</p>
          <Link to="/trips/create" className="btn btn-primary">Create Your First Trip</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {trips.map((trip) => (
            <TripSummaryCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, color }) {
  return (
    <div className="card" style={{ padding: '18px 20px' }}>
      <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
        {label}
      </p>
      <p style={{ fontSize: '1.8rem', fontWeight: 700, color, fontFamily: "'Playfair Display', serif" }}>
        {value}
      </p>
    </div>
  )
}

function TripSummaryCard({ trip }) {
  const progress = trip.checklist_total > 0
    ? Math.round((trip.checklist_completed / trip.checklist_total) * 100)
    : 0

  return (
    <Link to={`/trips/${trip.id}`}>
      <div className="card" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '18px 24px',
        cursor: 'pointer',
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{trip.title}</h4>
            <span className={`badge badge-${trip.status}`}>{trip.status.replace('_', ' ')}</span>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)' }}>
            {trip.destination} · {trip.start_date} → {trip.end_date}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 28, marginLeft: 24 }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Budget</p>
            <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>${trip.budget_total.toFixed(0)}</p>
          </div>
          <div style={{ textAlign: 'right', minWidth: 80 }}>
            <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Prep</p>
            <div style={{
              width: 60, height: 5, background: 'var(--color-border)', borderRadius: 3, marginTop: 4,
              marginLeft: 'auto', overflow: 'hidden'
            }}>
              <div style={{
                width: `${progress}%`, height: '100%',
                background: progress === 100 ? 'var(--color-success)' : 'var(--color-primary)',
                borderRadius: 3,
                transition: 'width 0.3s ease'
              }} />
            </div>
            <p style={{ fontSize: '0.78rem', fontWeight: 600, marginTop: 2 }}>{progress}%</p>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default Dashboard
