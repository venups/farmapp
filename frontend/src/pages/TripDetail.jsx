import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { api } from "../api.js";
import BudgetSection from "../components/BudgetSection.jsx";
import ChecklistSection from "../components/ChecklistSection.jsx";
import EmptyState from "../components/EmptyState.jsx";
import ItinerarySection from "../components/ItinerarySection.jsx";
import StatusChip from "../components/StatusChip.jsx";
import { fmtDate, routeCode } from "../utils.js";

const TABS = ["Itinerary", "Budget", "Checklist"];

export default function TripDetail() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [days, setDays] = useState([]);
  const [budget, setBudget] = useState([]);
  const [checklist, setChecklist] = useState([]);
  const [tab, setTab] = useState("Itinerary");
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      const [t, d, b, c] = await Promise.all([
        api.getTrip(tripId),
        api.listItinerary(tripId),
        api.listBudget(tripId),
        api.listChecklist(tripId),
      ]);
      setTrip(t);
      setDays(d);
      setBudget(b);
      setChecklist(c);
    } catch (e) {
      setError(e.message);
    }
  }, [tripId]);

  useEffect(() => {
    load();
  }, [load]);

  const removeTrip = async () => {
    if (!window.confirm(`Delete "${trip.name}" and everything in it?`)) return;
    await api.deleteTrip(tripId);
    navigate("/");
  };

  if (error) {
    return (
      <EmptyState title="This trip couldn't load.">
        <p className="empty-hint">{error}</p>
        <Link to="/" className="btn btn-quiet">
          Back to dashboard
        </Link>
      </EmptyState>
    );
  }
  if (!trip) return <p className="loading">Loading trip…</p>;

  return (
    <>
      <header className="trip-head pass">
        <div className="pass-main">
          <div className="pass-route" aria-hidden="true">
            {trip.destinations.map((d, i) => (
              <span key={`${d}-${i}`} className="route-leg">
                {i > 0 && <span className="route-arrow">→</span>}
                <span className="route-code">{routeCode(d)}</span>
              </span>
            ))}
          </div>
          <h1 className="pass-name">{trip.name}</h1>
          <p className="pass-destinations">{trip.destinations.join(" · ")}</p>
          <p className="pass-dates mono">
            {fmtDate(trip.start_date)} — {fmtDate(trip.end_date)}
          </p>
          <StatusChip status={trip.status} />
          {trip.notes && <p className="trip-notes">{trip.notes}</p>}
        </div>
        <div className="pass-divider" aria-hidden="true" />
        <div className="pass-stub trip-actions">
          <Link to={`/trips/${trip.id}/edit`} className="btn btn-secondary">
            Edit trip
          </Link>
          <button type="button" className="btn btn-danger" onClick={removeTrip}>
            Delete trip
          </button>
        </div>
      </header>

      <div className="tabs" role="tablist" aria-label="Trip sections">
        {TABS.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            className={`tab ${tab === t ? "is-active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Itinerary" && <ItinerarySection trip={trip} days={days} onChange={load} />}
      {tab === "Budget" && <BudgetSection tripId={tripId} items={budget} onChange={load} />}
      {tab === "Checklist" && (
        <ChecklistSection tripId={tripId} items={checklist} onChange={load} />
      )}
    </>
  );
}
