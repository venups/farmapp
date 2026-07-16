"""
API client for Travel Planner frontend.
"""
const API_BASE_URL = "http://localhost:8000/api";

/**
 * Trip API calls
 */
export const tripsApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/trips/`);
    if (!response.ok) throw new Error("Failed to fetch trips");
    return response.json();
  },
  
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/trips/${id}`);
    if (!response.ok) throw new Error("Failed to fetch trip");
    return response.json();
  },
  
  create: async (tripData) => {
    const response = await fetch(`${API_BASE_URL}/trips/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tripData),
    });
    if (!response.ok) throw new Error("Failed to create trip");
    return response.json();
  },
  
  update: async (id, tripData) => {
    const response = await fetch(`${API_BASE_URL}/trips/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tripData),
    });
    if (!response.ok) throw new Error("Failed to update trip");
    return response.json();
  },
  
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/trips/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete trip");
    return true;
  },
};

/**
 * Itinerary API calls
 */
export const itineraryApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/itinerary/`);
    if (!response.ok) throw new Error("Failed to fetch itinerary days");
    return response.json();
  },
  
  getByTripId: async (tripId) => {
    const response = await fetch(`${API_BASE_URL}/itinerary/trip/${tripId}`);
    if (!response.ok) throw new Error("Failed to fetch itinerary days");
    return response.json();
  },
  
  create: async (dayData) => {
    const response = await fetch(`${API_BASE_URL}/itinerary/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dayData),
    });
    if (!response.ok) throw new Error("Failed to create itinerary day");
    return response.json();
  },
};

/**
 * Budget API calls
 */
export const budgetApi = {
  getByTripId: async (tripId) => {
    const response = await fetch(`${API_BASE_URL}/budget/trip/${tripId}`);
    if (!response.ok) throw new Error("Failed to fetch budget items");
    return response.json();
  },
  
  create: async (itemData) => {
    const response = await fetch(`${API_BASE_URL}/budget/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(itemData),
    });
    if (!response.ok) throw new Error("Failed to create budget item");
    return response.json();
  },
};

/**
 * Checklist API calls
 */
export const checklistApi = {
  getByTripId: async (tripId) => {
    const response = await fetch(`${API_BASE_URL}/checklist/trip/${tripId}`);
    if (!response.ok) throw new Error("Failed to fetch checklist items");
    return response.json();
  },
  
  create: async (itemData) => {
    const response = await fetch(`${API_BASE_URL}/checklist/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(itemData),
    });
    if (!response.ok) throw new Error("Failed to create checklist item");
    return response.json();
  },
  
  update: async (id, itemData) => {
    const response = await fetch(`${API_BASE_URL}/checklist/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(itemData),
    });
    if (!response.ok) throw new Error("Failed to update checklist item");
    return response.json();
  },
};
