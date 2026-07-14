import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../api'

function CreateTrip() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    destination: '',
    start_date: '',
    end_date: '',
    description: '',
    status: 'planning',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title || !formData.destination || !formData.start_date || !formData.end_date) {
      setError('Please fill in all required fields')
      return
    }
    try {
      setLoading(true)
      setError('')
      const res = await apiClient.trips.create(formData)
      navigate(`/trips/${res.data.id}`)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create trip')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fade-in" style={{ maxWidth: 640, margin: '0 auto' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: 4 }}>Create New Trip</h2>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 32, fontSize: '0.95rem' }}>
        Start planning your next adventure
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
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Summer in Paris"
          />
        </div>

        <div className="form-group">
          <label>Destination *</label>
          <input
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            placeholder="e.g. Paris, France"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label>Start Date *</label>
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>End Date *</label>
            <input
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Any notes about this trip..."
          />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="planning">Planning</option>
            <option value="confirmed">Confirmed</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/trips')}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Trip'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateTrip
