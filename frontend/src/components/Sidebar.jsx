import { Link, useLocation } from 'react-router-dom'

function Sidebar() {
  const location = useLocation()

  const navItems = [
    { path: '/trips', label: 'My Trips', icon: '✈' },
    { path: '/dashboard', label: 'Dashboard', icon: '◉' },
  ]

  return (
    <aside style={{
      width: 240,
      background: '#1a1a1a',
      color: 'white',
      padding: '28px 0',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{ padding: '0 24px', marginBottom: 36 }}>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '1.4rem',
          fontWeight: 700,
          letterSpacing: '0.02em',
        }}>
          Travel Planner
        </h1>
        <p style={{ fontSize: '0.75rem', color: '#888', marginTop: 4, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Plan your journeys
        </p>
      </div>

      <nav style={{ flex: 1 }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path ||
            (item.path === '/trips' && location.pathname.startsWith('/trips'))
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '11px 24px',
                color: isActive ? 'white' : '#999',
                background: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                borderLeft: isActive ? '3px solid var(--color-accent)' : '3px solid transparent',
                fontSize: '0.9rem',
                fontWeight: isActive ? 500 : 400,
                transition: 'all 150ms ease',
                letterSpacing: '0.01em',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.color = 'white'
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = '#999'
              }}
            >
              <span style={{ fontSize: '1.1rem', width: 22, textAlign: 'center' }}>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div style={{ padding: '20px 24px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <Link
          to="/trips/create"
          className="btn btn-accent"
          style={{ width: '100%', justifyContent: 'center' }}
        >
          + New Trip
        </Link>
      </div>
    </aside>
  )
}

export default Sidebar
