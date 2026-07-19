import { useState } from "react";

import { api } from "../api.js";

function ChecklistColumn({ tripId, type, title, addLabel, items, onChange }) {
  const [text, setText] = useState("");
  const [error, setError] = useState(null);

  const add = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    setError(null);
    try {
      await api.addChecklistItem(tripId, { text: trimmed, type, checked: false });
      setText("");
      onChange();
    } catch (err) {
      setError(err.message);
    }
  };

  const toggle = async (item) => {
    setError(null);
    try {
      await api.updateChecklistItem(tripId, item.id, { checked: !item.checked });
      onChange();
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (item) => {
    setError(null);
    try {
      await api.deleteChecklistItem(tripId, item.id);
      onChange();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="checklist-column" aria-label={title}>
      <h3 className="section-subhead">{title}</h3>
      {items.length === 0 && <p className="empty-hint">Nothing here yet.</p>}
      <ul className="checklist">
        {items.map((item) => (
          <li key={item.id} className="checklist-item">
            <label className={`check-label ${item.checked ? "is-checked" : ""}`}>
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => toggle(item)}
              />
              <span>{item.text}</span>
            </label>
            <button
              type="button"
              className="btn btn-quiet btn-small"
              onClick={() => remove(item)}
              aria-label={`Delete ${item.text}`}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <form onSubmit={add} className="checklist-add">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={type === "packing" ? "Rain jacket" : "Renew passport"}
          aria-label={addLabel}
        />
        <button type="submit" className="btn btn-secondary btn-small">
          {addLabel}
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

export default function ChecklistSection({ tripId, items, onChange }) {
  const packing = items.filter((i) => i.type === "packing");
  const prep = items.filter((i) => i.type === "prep");
  return (
    <div className="checklist-grid">
      <ChecklistColumn
        tripId={tripId}
        type="packing"
        title="Packing"
        addLabel="Add to packing list"
        items={packing}
        onChange={onChange}
      />
      <ChecklistColumn
        tripId={tripId}
        type="prep"
        title="Prep"
        addLabel="Add to prep list"
        items={prep}
        onChange={onChange}
      />
    </div>
  );
}
