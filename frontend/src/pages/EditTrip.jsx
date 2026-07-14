import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import apiClient from '../api'

function EditTrip() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [trip, setTrip] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadTrip()
  }, [id])

  const loadTrip = async () => {
    try {
      const res = await apiClient.trips.get(id)
      const data = res.data
      setTrip({
        title: data.title || '',
        destination: data.destination || '',
        start_date: data.start_date || '',
        end_date: data.end_date || '',
        description: data.description || '',
        status: data.status || 'planning',
      })
    } catch (err) {
      setError('Failed to load trip')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setTrip({ ...trip, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      setError('')
      await apiClient.trips.update(id, trip)
      navigate(`/trips/${id}`)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update trip')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="loading">Loading...</div>
  if (!trip) return <div className="empty-state"><p>Trip not found</p></div>

  return (
    <div className="fade-in" style={{ maxWidth: 640, margin: '0 auto' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: 4 }}>Edit Trip</h2>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 32, fontSize: '0.95rem' }}>
        Update your trip details
      </p>

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

      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label>Trip Title *</label>
          <input name="title" value={trip.title} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Destination *</label>
          <input name="destination" value={trip.destination} onChange={handleChange} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label>Start Date *</label>
            <input type="date" name="start_date" value={trip.start_date} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>End Date *</label>
            <input type="date" name="end_date" value={trip.end_date} onChange={handleChange} />
          </div>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={trip.description} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select name="status" value={trip.status} onChange={handleChange}>
            <option value="planning">Planning</option>
            <option value="confirmed">Confirmed</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
          <button type="button" className="btn btn-secondary" onClick={() => navigate(`/trips/${id}`)}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditTrip
