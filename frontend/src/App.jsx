import { Link, NavLink, Outlet } from "react-router-dom";

export default function App() {
  return (
    <div className="shell">
      <header className="topbar">
        <NavLink to="/" className="wordmark">
          Waypoint
          <span className="wordmark-sub">Travel Planner</span>
        </NavLink>
        <nav className="topbar-nav">
          <NavLink to="/" end className="nav-link">
            Dashboard
          </NavLink>
          <Link to="/trips/new" className="btn btn-primary">
            Plan a trip
          </Link>
        </nav>
      </header>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
