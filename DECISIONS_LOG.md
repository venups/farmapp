# Decisions Log

One entry per non-trivial decision: what was decided, alternatives considered, why.

## D1 — Reuse the existing Python 3.9 virtualenv instead of installing Python 3.11+
- **Decided:** Use the repo's existing `.venv` (Python 3.9.6, the only interpreter on this machine) with FastAPI 0.115 / Pydantic 2.9 / mongomock 4.3 / pymongo 4.9 already installed.
- **Alternatives:** `brew install python@3.12` (or 3.13) and rebuild the venv from scratch.
- **Why:** The venv was clearly prepared for this project and has every needed dependency. Installing a new system-wide Python on the user's machine is a heavier change than the task needs, and the codebase only has to avoid 3.10+ syntax (`X | Y` unions, `match`) to run cleanly on 3.9. Deviation from the prompt's "3.11+" is recorded here per the prompt's own fallback rule.

## D2 — In-process store (mongomock) + JSON snapshot instead of a real MongoDB
- **Decided:** No `mongod` is installed and the Docker daemon is not running, so the data layer defaults to `mongomock` (fallback #3 in the prompt's preference order), wrapped so every write is snapshotted to `backend/data/store.json` and reloaded on startup — data survives backend restarts. Setting `MONGODB_URI` in `.env` switches the same code path to a real MongoDB.
- **Alternatives:** (a) `brew install mongodb-community` — a third-party tap plus a large download and a system-wide daemon on the user's machine; (b) starting Docker Desktop via `open -a Docker` — slow, flaky, and changes machine state outside the repo; (c) `mongita` — disk-backed but unmaintained since 2021 and risky against modern bson.
- **Why:** The prompt explicitly designates the in-process fallback as the correct move when the environment lacks a database, and the JSON snapshot closes the one real gap (persistence across restarts) that plain mongomock has.

## D3 — Sync PyMongo API surface behind the repository, not `AsyncMongoClient`
- **Decided:** The repository layer talks to the sync PyMongo API (`MongoClient`-shaped), and FastAPI routes are plain `def` functions, which FastAPI automatically runs in its threadpool.
- **Alternatives:** PyMongo's `AsyncMongoClient` (the prompt's stated preference), or Motor.
- **Why:** `mongomock` — the store this environment must actually run on — only implements the sync API, so an async repository would need a second, untested code path or an executor shim for the primary store. One sync implementation serves both mongomock and a real `MongoClient` identically, and the prompt itself sanctions "sync PyMongo behind a thread pool" as a fallback. For a single-user local app the threadpool is more than sufficient. (pymongo 4.9's `AsyncMongoClient` is also still beta.)

## D4 — IDs are UUID4 hex strings stored in `_id`
- **Decided:** Every document gets `_id = uuid4().hex`, exposed to the API as `id`.
- **Alternatives:** Mongo `ObjectId`s.
- **Why:** ObjectIds don't JSON-serialize without custom encoders and complicate the JSON snapshot. UUID strings work identically in mongomock, real Mongo, and the snapshot file.

## D5 — Dates stored as ISO `YYYY-MM-DD` strings in the store
- **Decided:** Pydantic validates real `date` objects at the API boundary; the repository stores them as ISO strings.
- **Alternatives:** BSON datetimes.
- **Why:** ISO strings sort correctly, round-trip through the JSON snapshot without custom encoding, and render directly in the frontend.

## D6 — Trip status is computed, never stored
- **Decided:** Status (Upcoming / Active / Completed) is derived at read time from today's date vs. `start_date`/`end_date` (inclusive on both ends).
- **Why:** The prompt requires it; storing it would let it go stale overnight.

## D7 — Itinerary modeled as one document per (trip, date), replaced wholesale via PUT
- **Decided:** `PUT /api/trips/{id}/itinerary/{date}` upserts that day's full ordered activity list (each activity: `order`, optional `time`, `description`). GET returns all saved days; the frontend renders the trip's full date range and merges.
- **Alternatives:** Per-activity CRUD endpoints with their own IDs.
- **Why:** A day's plan is edited as a unit in the UI; whole-day replace is one endpoint instead of four and keeps ordering trivial.

## D8 — Editing a trip's dates prunes itinerary days that fall outside the new range
- **Decided:** On trip update, itinerary-day documents whose date is no longer within [start, end] are deleted.
- **Alternatives:** Keep orphaned days invisible, or block the date change.
- **Why:** Silent orphans leak storage and confuse the GET response; blocking edits is hostile. Pruning matches what the calendar UI shows.

## D9 — Single currency, USD
- **Decided:** BudgetItem carries a `currency` field defaulting to `"USD"`; the UI displays everything as USD and does not offer a currency picker.
- **Why:** The prompt allows a single default currency; multi-currency math (conversion rates) is out of scope.

## D10 — Frontend is JavaScript (JSX), scaffolded with Vite, React 19
- **Decided:** Plain JSX, no TypeScript. Vite `react` template on Node v26.
- **Alternatives:** TypeScript template.
- **Why:** Single-developer, small surface; JSX keeps the build and test setup simpler, and Pydantic already enforces the data contracts at the API boundary.

## D11 — Styling: plain CSS with custom properties (no Tailwind, no CSS Modules)
- **Decided:** One global stylesheet (`src/styles/`) built on CSS custom properties for the palette/type scale, plus component-scoped class names.
- **Alternatives:** Tailwind (extra dependency and a utility aesthetic this design doesn't want), CSS Modules (indirection without benefit at this size).
- **Why:** The design direction calls for a small, deliberate system; custom properties express the tokens directly and keep the boarding-pass signature component readable.

## D12 — Design plan (written before UI code, per the prompt)
- **Concept:** "Timetable modern" — the quiet confidence of a rail-station departure board and a boarding pass, not a generic SaaS dashboard. Cool porcelain surfaces, evergreen ink, one brass accent.
- **Palette:**
  - `#F3F5F4` Porcelain — app background; cool near-white, deliberately not warm cream
  - `#FFFFFF` Card — boarding-pass card stock
  - `#22333B` Ink — primary text; deep blue-slate, softer than black
  - `#2F5D50` Evergreen — brand/primary actions; muted, premium, travel-adjacent without being "airline blue"
  - `#8C6A2F` Brass — single warm accent for highlights and the Active status; used sparingly like luggage-tag hardware
  - `#8A9694` Fog — borders, secondary text, disabled states
- **Type pairing:** Display: Petrona (a contemporary serif with travel-poster warmth, headlines only); Body: Public Sans (neutral, quietly modern); Utility: IBM Plex Mono (dates, codes, amounts — the departure-board voice). All self-hosted via @fontsource so the app works offline.
- **Layout:** Dashboard = summary strip (status counts + budget totals) above a column of boarding-pass trip cards. Trip view = pass-style header (route, dates, status) over three sections: Itinerary / Budget / Checklist. Forms = single-column, generous spacing, inline validation.
- **Signature element:** The boarding-pass trip card — perforated divider (dashed rule + notch cutouts), destinations rendered like a route (`AUS → LIS`-style, full names, mono face), status as a stamp-like chip. Completed trips get a subtle diagonal "COMPLETED" postmark treatment.
- **Motion:** ≤200ms ease-out transitions only on real state changes (checkbox strike-through, status chip, card hover lift); `prefers-reduced-motion` disables all of it.
- **Default-answer check:** A cream/serif/terracotta editorial look or a dark dashboard with one neon accent would both be reflexes; this palette (cool porcelain + evergreen + brass) and the boarding-pass card were chosen specifically from travel material.
