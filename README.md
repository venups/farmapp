# Waypoint — Travel Planner

A single-user, local-only travel planner built on the FARM stack (FastAPI, React, MongoDB-compatible store). Plan trips, build per-day itineraries, track planned-vs-actual budgets, and keep packing/prep checklists — with a dashboard that summarizes everything.

## Prerequisites

- **Python 3.9+** (built and tested on the repo's existing 3.9.6 virtualenv; see DECISIONS_LOG.md D1)
- **Node.js 22+** (tested on v26.4.0) and npm
- **MongoDB — optional.** No MongoDB is required: by default the backend uses an in-process store (mongomock) that snapshots to `backend/data/store.json`, so data survives restarts. Set `MONGODB_URI` to use a real MongoDB instead.

## Environment variables

Copy `.env.example` to `.env` at the repo root (the defaults work as-is):

```bash
cp .env.example .env
```

| Variable | Default | Purpose |
| --- | --- | --- |
| `APP_PORT` | `8000` | Port for the FastAPI dev server |
| `MONGODB_URI` | *(empty)* | Empty → in-process store with JSON snapshot. Set to e.g. `mongodb://localhost:27017` to use a real MongoDB |
| `MONGODB_DB` | `travel_planner` | Database name when `MONGODB_URI` is set |
| `DATA_FILE` | `backend/data/store.json` | Snapshot file for the in-process store (relative to repo root) |
| `CORS_ORIGINS` | `http://localhost:5173` | Comma-separated origins allowed to call the API |
| `VITE_API_BASE_URL` | `http://localhost:8000` | Base URL the React app uses to reach the API |

## Install dependencies

Backend (from the repo root — the repo ships a `.venv`; recreate it like this if needed):

```bash
python3 -m venv .venv
.venv/bin/pip install -r backend/requirements.txt
```

Frontend:

```bash
cd frontend
npm install
```

## Run for local development

Backend — port **8000** (from the repo root):

```bash
cd backend
../.venv/bin/python -m uvicorn app.main:app --reload --port 8000
```

Frontend — port **5173** (in a second terminal):

```bash
cd frontend
npm run dev
```

Open http://localhost:5173. The API docs are at http://localhost:8000/docs.

## Run the tests

Backend (14 tests — runs against a fresh in-memory store, never your dev data):

```bash
cd backend
../.venv/bin/python -m pytest
```

Frontend (7 tests — Vitest + React Testing Library):

```bash
cd frontend
npm test
```

## Manual end-to-end walkthrough

1. Start the backend and frontend as above, then open http://localhost:5173.
2. Click **Plan a trip**. Enter a name (e.g. "Autumn in Portugal"), a destination ("Lisbon" — use **Add another stop** for more), a start and end date, and click **Create trip**. You land on the trip page; its status chip (Upcoming / Active / Completed) is derived from today's date.
3. Open the **Checklist** tab. Type "Rain jacket" and click **Add to packing list**; add "Renew passport" under **Add to prep list**. Check "Rain jacket" off — it gets a strike-through.
4. Refresh the browser: the trip and both checklist items are still there (served from the backend).
5. Restart the backend (Ctrl-C, then rerun the uvicorn command) and refresh again: everything persists, because every write was snapshotted to `backend/data/store.json` (or to MongoDB if you configured one). You can inspect that JSON file directly to confirm.
6. Back on the **Dashboard**, the trip appears as a boarding-pass card showing 1/2 checklist completion (50%), and the summary strip counts it under its status.

## Project layout

```
backend/
  app/            FastAPI app: config, store (mongomock/pymongo + snapshot),
                  repository, schemas, routes (trips, itinerary, budget,
                  checklist, dashboard)
  tests/          pytest suite (isolated in-memory store)
frontend/
  src/            React app: pages (Dashboard, TripDetail, TripForm),
                  components, api client, design system (styles/global.css)
  src/__tests__/  Vitest + React Testing Library suite
```

Build history and rationale: PROGRESS_LOG.md, DECISIONS_LOG.md, RUN_DATA.md.
