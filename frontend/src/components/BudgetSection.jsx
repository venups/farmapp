import { useState } from "react";

import { api } from "../api.js";
import { BUDGET_CATEGORIES, money } from "../utils.js";

const blankItem = { category: "lodging", description: "", planned_amount: "", actual_amount: "" };

export default function BudgetSection({ tripId, items, onChange }) {
  const [form, setForm] = useState(blankItem);
  const [error, setError] = useState(null);

  const planned = items.reduce((s, i) => s + (i.planned_amount || 0), 0);
  const actual = items.reduce((s, i) => s + (i.actual_amount || 0), 0);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const add = async (e) => {
    e.preventDefault();
    setError(null);
    if (!form.description.trim() || form.planned_amount === "") {
      setError("A description and planned amount are required.");
      return;
    }
    try {
      await api.addBudgetItem(tripId, {
        category: form.category,
        description: form.description.trim(),
        planned_amount: Number(form.planned_amount),
        actual_amount: form.actual_amount === "" ? null : Number(form.actual_amount),
      });
      setForm(blankItem);
      onChange();
    } catch (err) {
      setError(typeof err.detail === "string" ? err.detail : err.message);
    }
  };

  const saveActual = async (item, value) => {
    const parsed = value === "" ? null : Number(value);
    if (parsed === (item.actual_amount ?? null)) return;
    setError(null);
    try {
      await api.updateBudgetItem(tripId, item.id, {
        category: item.category,
        description: item.description,
        planned_amount: item.planned_amount,
        actual_amount: parsed,
        currency: item.currency,
      });
      onChange();
    } catch (err) {
      setError(typeof err.detail === "string" ? err.detail : err.message);
    }
  };

  const remove = async (item) => {
    setError(null);
    try {
      await api.deleteBudgetItem(tripId, item.id);
      onChange();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="budget-section">
      {items.length === 0 ? (
        <p className="empty-hint">No budget items yet — add your first cost below.</p>
      ) : (
        <div className="table-scroll">
          <table className="budget-table">
            <thead>
              <tr>
                <th scope="col">Category</th>
                <th scope="col">Description</th>
                <th scope="col" className="num">Planned</th>
                <th scope="col" className="num">Actual</th>
                <th scope="col">
                  <span className="visually-hidden">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="cat-cell">{item.category}</td>
                  <td>{item.description}</td>
                  <td className="num mono">{money(item.planned_amount)}</td>
                  <td className="num">
                    <input
                      className="actual-input mono"
                      type="number"
                      min="0"
                      step="0.01"
                      defaultValue={item.actual_amount ?? ""}
                      aria-label={`Actual amount for ${item.description}`}
                      onBlur={(e) => saveActual(item, e.target.value)}
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-quiet btn-small"
                      onClick={() => remove(item)}
                      aria-label={`Delete ${item.description}`}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th scope="row" colSpan={2}>Total</th>
                <td className="num mono">{money(planned)}</td>
                <td className="num mono">{money(actual)}</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      <form onSubmit={add} className="budget-add">
        <label className="field">
          <span className="field-label">Category</span>
          <select value={form.category} onChange={set("category")}>
            {BUDGET_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="field grow">
          <span className="field-label">Description</span>
          <input
            value={form.description}
            onChange={set("description")}
            placeholder="Two nights in Porto"
          />
        </label>
        <label className="field">
          <span className="field-label">Planned ($)</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.planned_amount}
            onChange={set("planned_amount")}
          />
        </label>
        <label className="field">
          <span className="field-label">Actual ($, optional)</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.actual_amount}
            onChange={set("actual_amount")}
          />
        </label>
        <button type="submit" className="btn btn-secondary">
          Add budget item
        </button>
      </form>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
