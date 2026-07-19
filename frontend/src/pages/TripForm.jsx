import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { api } from "../api.js";

const blank = { name: "", destinations: [""], start_date: "", end_date: "", notes: "" };

export default function TripForm({ edit = false }) {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(blank);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(!edit);

  useEffect(() => {
    if (!edit) return;
    api
      .getTrip(tripId)
      .then((t) =>
        setForm({
          name: t.name,
          destinations: t.destinations,
          start_date: t.start_date,
          end_date: t.end_date,
          notes: t.notes ?? "",
        })
      )
      .then(() => setLoaded(true))
      .catch((e) => setError(e.message));
  }, [edit, tripId]);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const setDestination = (i, value) => {
    const destinations = form.destinations.slice();
    destinations[i] = value;
    setForm({ ...form, destinations });
  };

  const addDestination = () =>
    setForm({ ...form, destinations: [...form.destinations, ""] });

  const removeDestination = (i) =>
    setForm({ ...form, destinations: form.destinations.filter((_, j) => j !== i) });

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    const destinations = form.destinations.map((d) => d.trim()).filter(Boolean);
    if (destinations.length === 0) {
      setError("Add at least one destination.");
      return;
    }
    if (form.end_date && form.start_date && form.end_date < form.start_date) {
      setError("The end date can't be before the start date.");
      return;
    }
    const body = { ...form, destinations, notes: form.notes.trim() || null };
    setSaving(true);
    try {
      const trip = edit ? await api.updateTrip(tripId, body) : await api.createTrip(body);
      navigate(`/trips/${trip.id}`);
    } catch (err) {
      setError(typeof err.detail === "string" ? err.detail : err.message);
      setSaving(false);
    }
  };

  if (!loaded && !error) return <p className="loading">Loading trip…</p>;

  return (
    <div className="form-page">
      <div className="page-head">
        <h1>{edit ? "Edit trip" : "Plan a trip"}</h1>
      </div>
      <form onSubmit={submit} className="trip-form" noValidate>
        <label className="field">
          <span className="field-label">Trip name</span>
          <input
            required
            value={form.name}
            onChange={set("name")}
            placeholder="Autumn in Portugal"
            maxLength={120}
          />
        </label>

        <fieldset className="field">
          <legend className="field-label">Destinations</legend>
          {form.destinations.map((d, i) => (
            <div className="destination-row" key={i}>
              <input
                aria-label={`Destination ${i + 1}`}
                value={d}
                onChange={(e) => setDestination(i, e.target.value)}
                placeholder={i === 0 ? "Lisbon" : "Add a stop"}
              />
              {form.destinations.length > 1 && (
                <button
                  type="button"
                  className="btn btn-quiet"
                  onClick={() => removeDestination(i)}
                  aria-label={`Remove destination ${i + 1}`}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" className="btn btn-quiet" onClick={addDestination}>
            Add another stop
          </button>
        </fieldset>

        <div className="field-row">
          <label className="field">
            <span className="field-label">Start date</span>
            <input type="date" required value={form.start_date} onChange={set("start_date")} />
          </label>
          <label className="field">
            <span className="field-label">End date</span>
            <input type="date" required value={form.end_date} onChange={set("end_date")} />
          </label>
        </div>

        <label className="field">
          <span className="field-label">Notes (optional)</span>
          <textarea
            rows={4}
            value={form.notes}
            onChange={set("notes")}
            placeholder="Anything worth remembering while planning"
          />
        </label>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Saving…" : edit ? "Save changes" : "Create trip"}
          </button>
          <button type="button" className="btn btn-quiet" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
