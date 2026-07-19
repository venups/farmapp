# Progress Log

## TODO / DONE

- [x] Stage 1 — Environment setup (scaffold, .gitignore, .env.example, deps)
- [x] Stage 2 — Backend (models, store, repository, routes, validation)
- [x] Stage 3 — Frontend (routing, API client, core components)
- [x] Stage 4 — Styling (design-system pass)
- [x] Stage 5 — Testing (backend pytest + frontend Vitest)
- [ ] Stage 6 — Docs (README, RUN_DATA, final logs)
- [ ] Final validation

## Entries

### 2026-07-19 ~08:10 — Environment survey
- Checked interpreters/tooling: Python 3.9.6 only (no 3.11+ anywhere, no uv), Node v26.4.0, npm 11.17.0, Homebrew present, `mongod` absent, Docker CLI present but daemon not running.
- Found an existing repo `.venv` (Python 3.9) already containing fastapi 0.115.0, pydantic 2.9.2, mongomock 4.3.0, pymongo 4.9.2, pytest 8.3.3, uvicorn 0.32.0.
- Commands: `python3 --version`, `node --version`, `which mongod docker`, `docker info`, `.venv/bin/pip list`.
- Result: environment fallback triggered — no reachable MongoDB; going with mongomock + JSON snapshot (DECISIONS_LOG D2). Python 3.9 retained (D1).

### 2026-07-19 ~08:12 — Stage 1 scaffold
- Installed `httpx` into `.venv` (needed by FastAPI's TestClient; also confirmed outbound network works).
- Appended Python/macOS/app-data sections to `.gitignore`; created `backend/app/routes`, `backend/tests`, `backend/data` directories; wrote `.env.example` and `backend/requirements.txt` (pinned to the versions actually installed).
- Wrote DECISIONS_LOG.md D1–D12 (environment fallbacks, data-shape choices, design plan).
- Commands: `pip install httpx` → success.
- Result: OK. Committed `5e1333b`.

### 2026-07-19 ~08:25 — Stage 2: backend
- Wrote `backend/app/`: `config.py` (pydantic-settings), `store.py` (DocumentStore wrapping mongomock or real pymongo, JSON snapshot persistence), `repository.py` (all data access), `schemas.py` (Pydantic request/response models + derived trip status), `deps.py`, `routes/trips.py` (trips + itinerary + budget + checklist), `routes/dashboard.py`, `main.py` (`create_app` factory, CORS, `/api/health`).
- Smoke-tested in-process with TestClient: trip create 201, itinerary PUT 200, budget/checklist POST 201, end-before-start 422, out-of-range itinerary date 422, dashboard aggregation correct — all on first run. Snapshot persistence verified by rebuilding the store from the JSON file.
- Result: OK. Committed `71eba31`.

### 2026-07-19 ~08:38 — Stage 3: frontend
- Scaffolded `frontend/` with `npm create vite@latest -- --template react` (React 19.2, Vite 8). Installed react-router-dom 7, @fontsource (Petrona, Public Sans, IBM Plex Mono); dev deps vitest 4, @testing-library/react, jest-dom, user-event, jsdom.
- Wrote `src/api.js` (fetch client), `src/utils.js`, `src/main.jsx` (router), `src/App.jsx` (shell), pages `Dashboard`/`TripDetail`/`TripForm`, components `TripCard` (boarding pass), `StatusChip`, `ProgressBar`, `EmptyState`, `ItinerarySection`, `BudgetSection`, `ChecklistSection`. Configured Vitest in `vite.config.js`.
- Fixed during review: `dateRange` originally used `toISOString()`, which shifts dates in UTC+ timezones — replaced with local-date formatting before first run.
- `npm run build` → success. Committed `59ee3d0`.

### 2026-07-19 ~08:40 — Stage 4: styling
- Wrote `src/styles/global.css`: full design system per DECISIONS_LOG D12 (porcelain/evergreen/brass palette, Petrona + Public Sans + IBM Plex Mono, boarding-pass card with perforated divider and notch cutouts, Completed postmark, status chips, summary tiles, forms, tabs, checklist/budget/itinerary sections, 720px mobile breakpoint, `prefers-reduced-motion` support, visible `:focus-visible` outlines).
- One process slip: the stage-4 commit ran `npm run build` from the repo root (enoent, no package.json there) but the `&&`-chain still committed because the pipe masked npm's exit code. Re-ran the build from `frontend/` immediately after: success. Files in the commit were correct; no fix needed.
- Result: OK. Committed `855b01c`.

### 2026-07-19 ~08:42 — Stage 5: testing
- Backend: `backend/tests/` — conftest (fresh mongomock store per test, never dev data), `test_trips.py` (CRUD, cascade delete, end-before-start 422, empty destinations 422, 404), `test_itinerary_budget_checklist.py` (itinerary upsert/order/replace/delete, out-of-range 422, date-change pruning, budget CRUD + bad category 422, checklist CRUD + toggle), `test_dashboard_and_store.py` (aggregation, snapshot restart survival).
- `python -m pytest` → **14 passed** on first run.
- Frontend: `src/__tests__/TripForm.test.jsx` (creation flow incl. navigation, end-before-start client validation, multi-destination) and `ChecklistSection.test.jsx` (packing/prep split, toggle on/off, add, delete), with the api module mocked. Added `"test": "vitest run"` script.
- Failure #1: 2 checklist tests failed — `getByLabelText(/rain jacket/i)` matched both the checkbox and the "Delete Rain jacket" button's aria-label. Diagnosis: ambiguous accessible-name query. Fix: query `getByRole("checkbox", { name: ... })`. Re-run → **7 passed**.
- Result: full suite green — 21 tests total.
