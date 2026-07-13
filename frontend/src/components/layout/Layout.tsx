import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Map, Plus, User, LogOut, Menu, X, Compass } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkBase = 'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ';
  const navLinkInactive = 'text-slate-400 hover:text-white hover:bg-slate-700/50';
  const navLinkActive = 'text-white bg-indigo-600/20 border border-indigo-500/30';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-bg-dark)' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 40, display: 'none',
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          width: 260, minWidth: 260, backgroundColor: 'var(--color-bg-card)',
          borderRight: '1px solid var(--color-border)', display: 'flex',
          flexDirection: 'column', padding: '20px 0',
        }}
      >
        <div style={{ padding: '0 20px 24px', borderBottom: '1px solid var(--color-border)' }}>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-text-primary)' }}>
            <span style={{ color: 'var(--color-primary)' }}>Trip</span>Forge
          </h1>
          <p style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 2 }}>
            Forge Your Perfect Journey
          </p>
        </div>

        <nav style={{ padding: '16px 12px', flex: 1 }}>
          <NavLink to="/dashboard" end onClick={() => setSidebarOpen(false)} className={({ isActive }) => navLinkBase + (isActive ? navLinkActive : navLinkInactive)}>
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>
          <NavLink to="/trips" end onClick={() => setSidebarOpen(false)} className={({ isActive }) => navLinkBase + (isActive ? navLinkActive : navLinkInactive)}>
            <Map size={18} /> My Trips
          </NavLink>
          <NavLink to="/trips/new" onClick={() => setSidebarOpen(false)} className={({ isActive }) => navLinkBase + (isActive ? navLinkActive : navLinkInactive)}>
            <Plus size={18} /> New Trip
          </NavLink>
          <NavLink to="/profile" onClick={() => setSidebarOpen(false)} className={({ isActive }) => navLinkBase + (isActive ? navLinkActive : navLinkInactive)}>
            <User size={18} /> Profile
          </NavLink>
        </nav>

        <div style={{ padding: '16px 12px', borderTop: '1px solid var(--color-border)' }}>
          <div style={{ padding: '12px', borderRadius: 8, backgroundColor: 'rgba(99,102,241,0.1)', marginBottom: 8 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}>
              {user?.full_name || 'User'}
            </p>
            <p style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>
              {user?.email || ''}
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 12px', borderRadius: 8, border: '1px solid var(--color-border)',
              backgroundColor: 'transparent', color: 'var(--color-text-secondary)',
              fontSize: 13, cursor: 'pointer',
            }}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflow: 'auto' }}>
        {/* Mobile header */}
        <div
          style={{
            display: 'none', padding: '12px 16px', backgroundColor: 'var(--color-bg-card)',
            borderBottom: '1px solid var(--color-border)', alignItems: 'center',
            justifyContent: 'space-between',
          }}
          className="mobile-header"
        >
          <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
            <Menu size={24} />
          </button>
          <span style={{ fontWeight: 700 }}>TripForge</span>
          <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <div style={{ padding: 32 }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
