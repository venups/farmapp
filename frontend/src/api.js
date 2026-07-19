const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export class ApiError extends Error {
  constructor(status, detail) {
    super(typeof detail === "string" ? detail : "Request failed");
    this.status = status;
    this.detail = detail;
  }
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: options.body ? { "Content-Type": "application/json" } : undefined,
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const data = await res.json();
      detail = data.detail ?? detail;
    } catch {
      /* non-JSON error body */
    }
    throw new ApiError(res.status, detail);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  dashboard: () => request("/api/dashboard"),

  listTrips: () => request("/api/trips"),
  getTrip: (id) => request(`/api/trips/${id}`),
  createTrip: (body) => request("/api/trips", { method: "POST", body }),
  updateTrip: (id, body) => request(`/api/trips/${id}`, { method: "PUT", body }),
  deleteTrip: (id) => request(`/api/trips/${id}`, { method: "DELETE" }),

  listItinerary: (tripId) => request(`/api/trips/${tripId}/itinerary`),
  saveDay: (tripId, date, activities) =>
    request(`/api/trips/${tripId}/itinerary/${date}`, { method: "PUT", body: { activities } }),

  listBudget: (tripId) => request(`/api/trips/${tripId}/budget`),
  addBudgetItem: (tripId, body) =>
    request(`/api/trips/${tripId}/budget`, { method: "POST", body }),
  updateBudgetItem: (tripId, itemId, body) =>
    request(`/api/trips/${tripId}/budget/${itemId}`, { method: "PUT", body }),
  deleteBudgetItem: (tripId, itemId) =>
    request(`/api/trips/${tripId}/budget/${itemId}`, { method: "DELETE" }),

  listChecklist: (tripId) => request(`/api/trips/${tripId}/checklist`),
  addChecklistItem: (tripId, body) =>
    request(`/api/trips/${tripId}/checklist`, { method: "POST", body }),
  updateChecklistItem: (tripId, itemId, body) =>
    request(`/api/trips/${tripId}/checklist/${itemId}`, { method: "PATCH", body }),
  deleteChecklistItem: (tripId, itemId) =>
    request(`/api/trips/${tripId}/checklist/${itemId}`, { method: "DELETE" }),
};
