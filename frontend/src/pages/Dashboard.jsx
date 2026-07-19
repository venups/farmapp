import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { api } from "../api.js";
import EmptyState from "../components/EmptyState.jsx";
import TripCard from "../components/TripCard.jsx";
import { money } from "../utils.js";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api
      .dashboard()
      .then((d) => !cancelled && setData(d))
      .catch((e) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <EmptyState title="The dashboard couldn't load.">
        <p className="empty-hint">{error} — is the backend running on port 8000?</p>
      </EmptyState>
    );
  }
  if (!data) return <p className="loading">Loading your trips…</p>;

  const { status_counts: counts, budget_totals: totals, trips } = data;

  return (
    <>
      <div className="page-head">
        <h1>Dashboard</h1>
      </div>
      <section className="summary-strip" aria-label="Overall summary">
        <div className="summary-tile">
          <span className="summary-value mono">{counts.Upcoming}</span>
          <span className="summary-label">Upcoming</span>
        </div>
        <div className="summary-tile">
          <span className="summary-value mono">{counts.Active}</span>
          <span className="summary-label">Active</span>
        </div>
        <div className="summary-tile">
          <span className="summary-value mono">{counts.Completed}</span>
          <span className="summary-label">Completed</span>
        </div>
        <div className="summary-tile summary-wide">
          <span className="summary-value mono">
            {money(totals.actual)} <span className="summary-of">of {money(totals.planned)}</span>
          </span>
          <span className="summary-label">Spent vs. planned, all trips</span>
        </div>
      </section>

      {trips.length === 0 ? (
        <EmptyState title="No trips yet — plan your first one.">
          <Link to="/trips/new" className="btn btn-primary">
            Plan a trip
          </Link>
        </EmptyState>
      ) : (
        <section className="pass-list" aria-label="Trips">
          {trips.map((t) => (
            <TripCard key={t.id} trip={t} />
          ))}
        </section>
      )}
    </>
  );
}
