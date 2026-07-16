const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export async function fetchTrips() {
  const res = await fetch(`${API_BASE}/trips/`);
  if (!res.ok) throw new Error('Failed to fetch trips');
  return res.json();
}

export async function createTrip(tripData) {
  const res = await fetch(`${API_BASE}/trips/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tripData),
  });
  if (!res.ok) throw new Error('Failed to create trip');
  return res.json();
}

export async function getTrip(id) {
  const res = await fetch(`${API_BASE}/trips/${id}`);
  if (!res.ok) throw new Error('Failed to fetch trip');
  return res.json();
}

export async function updateTrip(id, tripData) {
  const res = await fetch(`${API_BASE}/trips/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tripData),
  });
  if (!res.ok) throw new Error('Failed to update trip');
  return res.json();
}

export async function deleteTrip(id) {
  const res = await fetch(`${API_BASE}/trips/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete trip');
}

export async function getItineraryDays(tripId) {
  const res = await fetch(`${API_BASE}/itineraries/trip/${tripId}`);
  if (!res.ok) throw new Error('Failed to fetch itinerary days');
  return res.json();
}

export async function createItineraryDay(dayData) {
  const res = await fetch(`${API_BASE}/itineraries/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dayData),
  });
  if (!res.ok) throw new Error('Failed to create itinerary day');
  return res.json();
}

export async function updateItineraryDay(id, dayData) {
  const res = await fetch(`${API_BASE}/itineraries/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dayData),
  });
  if (!res.ok) throw new Error('Failed to update itinerary day');
  return res.json();
}

export async function deleteItineraryDay(id) {
  const res = await fetch(`${API_BASE}/itineraries/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete itinerary day');
}

export async function getBudgetItems(tripId) {
  const res = await fetch(`${API_BASE}/budget/trip/${tripId}`);
  if (!res.ok) throw new Error('Failed to fetch budget items');
  return res.json();
}

export async function createBudgetItem(itemData) {
  const res = await fetch(`${API_BASE}/budget/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(itemData),
  });
  if (!res.ok) throw new Error('Failed to create budget item');
  return res.json();
}

export async function updateBudgetItem(id, itemData) {
  const res = await fetch(`${API_BASE}/budget/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(itemData),
  });
  if (!res.ok) throw new Error('Failed to update budget item');
  return res.json();
}

export async function deleteBudgetItem(id) {
  const res = await fetch(`${API_BASE}/budget/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete budget item');
}

export async function getChecklistItems(tripId) {
  const res = await fetch(`${API_BASE}/checklist/trip/${tripId}`);
  if (!res.ok) throw new Error('Failed to fetch checklist items');
  return res.json();
}

export async function createChecklistItem(itemData) {
  const res = await fetch(`${API_BASE}/checklist/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(itemData),
  });
  if (!res.ok) throw new Error('Failed to create checklist item');
  return res.json();
}

export async function updateChecklistItem(id, itemData) {
  const res = await fetch(`${API_BASE}/checklist/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(itemData),
  });
  if (!res.ok) throw new Error('Failed to update checklist item');
  return res.json();
}

export async function deleteChecklistItem(id) {
  const res = await fetch(`${API_BASE}/checklist/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete checklist item');
}
