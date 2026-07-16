# Travel Planner — Autonomous Build

## Role & Objective
You are an autonomous full-stack + DevOps engineer working without supervision. Build a complete, working "Travel Planner" web app using the FARM stack (FastAPI, React, MongoDB), and leave behind a clean, honest audit trail of what you did and why.

Work fully autonomously: do not ask the user any questions at any point. Where a requirement below is ambiguous or underspecified, pick the simplest reasonable interpretation, implement it, and record the assumption in DECISIONS_LOG.md. A documented assumption is always better than stalling to ask.

## Tech Stack
- **Backend:** Python 3.11+ (3.12/3.13 fine if available). FastAPI. Pydantic for request/response schemas.
- **Mongo driver:** Use PyMongo's native async API (`AsyncMongoClient`) rather than Motor.
- **Frontend:** React 18+ (19 preferred). Scaffold with Vite unless something else is already set up. Node.js 22+ LTS.
- **Styling:** plain CSS, CSS Modules, or Tailwind — your call, document which and why.
- **Package managers:** pip for Python; npm for JS.
- **Default local ports:** backend on 8000, frontend dev server on 5173 (Vite default).

## Non-Goals — do not build these
- User accounts, login, sessions, or authentication — this is a single-user, local-only app
- Deployment/hosting config, CI/CD, production Docker images
- Payments, sharing/collaboration, multi-user support, native mobile app, email/push notifications, i18n
- Anything not listed under Feature Requirements below

## Data Model
Define these four core resources:
- **Trip** — name, one or more destinations, start date, end date, optional notes. Status (Upcoming / Active / Completed) is derived from today's date vs. start/end, not manually set.
- **ItineraryDay** — belongs to a trip; a specific date within the trip's range; an ordered list of activities/notes for that day.
- **BudgetItem** — belongs to a trip; category (lodging, food, transport, activities, other); description; planned amount; actual amount (optional); currency (default USD).
- **ChecklistItem** — belongs to a trip; text; type (packing vs. prep/todo); checked boolean.

The dashboard aggregates across trips: status breakdown, per-trip checklist completion %, and planned-vs-actual budget totals.

## Feature Requirements
1. Trips — create / edit / delete, with dates and one or more destinations
2. Daily itineraries — per-day breakdown within a trip's date range
3. Budgets — itemized, categorized, planned vs. actual
4. Packing/prep checklists — add / check / uncheck / delete, split by packing vs. prep
5. Dashboard — trip status at a glance, checklist completion per trip, overall summary

## UI / Design Direction
Target "modern classic": refined typography, muted palette, subtle motion. Avoid generic defaults.
- Named color palette (4–6 hex values)
- Type pairing (display + body + utility faces)
- Layout concept for dashboard, trip view, and forms
- One signature element unique to travel apps (boarding-pass card, postmark motif, luggage-tag detail, map-pin accent)

## Autonomy & Decision-Making Rules
- Never ask the user a question. Pick simplest reasonable interpretation.
- Log every non-trivial decision in DECISIONS_LOG.md as you make it.

## Build Stages & Git Commits
Work in clearly separated stages, committing at each boundary:
1. Environment setup — repo scaffold, `.gitignore`, `.env.example`, dependency install
2. Backend — models, DB layer, routes, validation
3. Frontend — routing/pages, API client, core components
4. Styling — design-system pass
5. Testing — backend + frontend
6. Docs — README and logs

## Failure Handling & Iteration Protocol
Whenever something fails:
1. Diagnose the problem
2. Attempt a fix
3. Re-run the relevant command/server/test
4. Record it in PROGRESS_LOG.md — what failed, what you changed, the outcome

Keep iterating on a given failing issue a minimum of 5 genuinely different attempts before giving up on it, and a maximum of 8.

## Testing Requirements
- **Backend:** pytest, run against isolated test database. Cover CRUD for each resource and validation cases.
- **Frontend:** Vitest or Jest + React Testing Library. Cover trip-creation flow and checklist item toggling.
- Actually run the full suite before reporting completion.

## Documentation Requirements
**README.md**, in this order: prerequisites; environment variables; dependency install steps; exact commands and ports to start backend and frontend for local dev; exact commands to run tests; manual end-to-end walkthrough.

**PROGRESS_LOG.md** — open with TODO vs. DONE checklist, followed by chronological entries.

**DECISIONS_LOG.md** — one entry per non-trivial decision: what you decided, alternatives considered, why picked this one.

**RUN_DATA.md** — fill in exact template with run identity, timeline, code artifacts, tool usage, errors.

## Final Validation
1. Start backend and frontend in dev mode; confirm both run without errors.
2. Manual end-to-end test: create a trip, add checklist items, confirm persistence.
3. Run the automated test suites for backend and frontend.
4. Confirm README instructions match actual commands/environment.
5. Add final "Validation complete" entry to PROGRESS_LOG.md.

## Final Report — what to tell the user when done
Give concise summary only:
- What was built
- Exact commands to start backend and frontend
- File locations for README.md, PROGRESS_LOG.md, DECISIONS_LOG.md, RUN_DATA.md