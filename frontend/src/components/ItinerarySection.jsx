import { useState } from "react";

import { api } from "../api.js";
import { dateRange, fmtDayLabel } from "../utils.js";

function DayCard({ tripId, date, activities, onChange }) {
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);

  const save = async (next) => {
    setError(null);
    try {
      await api.saveDay(
        tripId,
        date,
        next.map((a, i) => ({ ...a, order: i }))
      );
      onChange();
    } catch (err) {
      setError(typeof err.detail === "string" ? err.detail : err.message);
    }
  };

  const add = async (e) => {
    e.preventDefault();
    const trimmed = description.trim();
    if (!trimmed) return;
    await save([...activities, { time: time || null, description: trimmed }]);
    setTime("");
    setDescription("");
  };

  const remove = (index) => save(activities.filter((_, i) => i !== index));

  return (
    <section className="day-card" aria-label={`Itinerary for ${fmtDayLabel(date)}`}>
      <h3 className="day-head">
        <span className="day-label">{fmtDayLabel(date)}</span>
        <span className="day-date mono">{date}</span>
      </h3>
      {activities.length === 0 ? (
        <p className="empty-hint">Nothing planned yet.</p>
      ) : (
        <ol className="activity-list">
          {activities.map((a, i) => (
            <li key={`${a.description}-${i}`} className="activity">
              <span className="activity-time mono">{a.time ?? "—"}</span>
              <span className="activity-desc">{a.description}</span>
              <button
                type="button"
                className="btn btn-quiet btn-small"
                onClick={() => remove(i)}
                aria-label={`Remove ${a.description}`}
              >
                Remove
              </button>
            </li>
          ))}
        </ol>
      )}
      <form onSubmit={add} className="activity-add">
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          aria-label={`Time for new activity on ${date}`}
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Morning at the Alfama viewpoints"
          aria-label={`New activity on ${date}`}
        />
        <button type="submit" className="btn btn-secondary btn-small">
          Add activity
        </button>
      </form>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}

export default function ItinerarySection({ trip, days, onChange }) {
  const byDate = Object.fromEntries(days.map((d) => [d.date, d.activities]));
  const range = dateRange(trip.start_date, trip.end_date);
  return (
    <div className="itinerary">
      {range.map((date) => (
        <DayCard
          key={date}
          tripId={trip.id}
          date={date}
          activities={byDate[date] ?? []}
          onChange={onChange}
        />
      ))}
    </div>
  );
}
