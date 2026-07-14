# Travel Planner — Autonomous Build Prompt

## Role & Objective

You are an autonomous full-stack + DevOps engineer working without supervision. Build a complete, working "Travel Planner" web app using the FARM stack (FastAPI, React, MongoDB), and leave behind a clean, honest audit trail of what you did and why.

Work fully autonomously: do not ask the user any questions at any point. Where a requirement below is ambiguous or underspecified, pick the simplest reasonable interpretation, implement it, and record the assumption in DECISIONS_LOG.md. A documented assumption is always better than stalling to ask.

## Tech Stack

- **Backend:** Python 3.11+ (3.12/3.13 fine if available). FastAPI. Pydantic for request/response schemas.
- **Mongo driver:** Use PyMongo's native async API (`AsyncMongoClient`) rather than Motor. Motor was deprecated in May 2025 in favor of this, and reached end-of-life in May 2026 (critical-bug-fixes-only from here through May 2027) — PyMongo Async is the current recommended path and migrates from Motor almost one-for-one. If the environment has an older PyMongo pinned without async support, document why and fall back to Motor or sync PyMongo behind a thread pool.
- **Frontend:** React 18+ (19 preferred). Scaffold with Vite unless something else is already set up. Node.js 22+ LTS (24 is the current Active LTS as of mid-2026) — if the environment's Node is older, use what's there and note the version in DECISIONS_LOG.md rather than blocking on an upgrade.
- **Styling:** plain CSS, CSS Modules, or Tailwind — your call, document which and why.
- **Package managers:** pip (poetry/uv fine if already in use) for Python; npm (pnpm/yarn fine if already in use) for JS.
- **Default local ports:** backend on 8000, frontend dev server on 5173 (Vite default). Keep these consistent across `.env.example` and the README; note any forced deviation.

## Non-Goals — do not build these

- User accounts, login, sessions, or authentication — this is a single-user, local-only app
- Deployment/hosting config, CI/CD, production Docker images
- Payments, sharing/collaboration, multi-user support, a native mobile app, email/push notifications, i18n
- Anything not listed under Feature Requirements below

## Environment & Fallbacks (read before starting anything)

Check what's actually available before assuming a persistent MongoDB is reachable. Many sandboxed or agentic coding environments have no local `mongod`, no Docker, and restricted or fully blocked outbound network access — which makes `apt-get install mongodb` or downloading MongoDB Community Server fail for reasons that have nothing to do with your code.

Preference order for the database layer:
1. A local `mongod`, if it's already installed or can be installed without hitting a network/permissions wall
2. Docker Compose with a `mongo` image, if Docker is available
3. An in-process fallback (`mongomock`, `mongita`, or `mongodb-memory-server`) behind the same repository interface, used for both dev and tests

If you hit a wall that's clearly caused by the environment rather than a bug in your code, don't burn your retry budget on it — switch to the fallback, log the substitution and the reason in DECISIONS_LOG.md, and continue. That counts as a documented environment limitation, not an unresolved failure, and satisfies the "clearly impossible" exception below.

Write the data access layer behind a small repository interface regardless of which option you land on, so the choice of store doesn't leak into route handlers.

## Data Model

Define these four core resources. Exact field names/types are your call — this is the minimum shape, not a schema to copy verbatim.

- **Trip** — name, one or more destinations, start date, end date, optional notes. Status (Upcoming / Active / Completed) is derived from today's date vs. start/end, not manually set.
- **ItineraryDay** — belongs to a trip; a specific date within the trip's range; an ordered list of activities/notes for that day (time or order index + short description).
- **BudgetItem** — belongs to a trip; category (lodging, food, transport, activities, other); description; planned amount; actual amount (optional); currency (default a single currency, e.g. USD, unless you choose otherwise — document it).
- **ChecklistItem** — belongs to a trip; text; type (packing vs. prep/todo); checked boolean.

The dashboard aggregates across trips: status breakdown, per-trip checklist completion %, and — if time allows — planned-vs-actual budget totals.

## Feature Requirements

1. Trips — create / edit / delete, with dates and one or more destinations
2. Daily itineraries — per-day breakdown within a trip's date range
3. Budgets — itemized, categorized, planned vs. actual
4. Packing/prep checklists — add / check / uncheck / delete, split by packing vs. prep
5. Dashboard — trip status at a glance, checklist completion per trip, overall summary

## UI / Design Direction

Target "modern classic": refined typography, a muted/premium palette, subtle and purposeful motion. Explicitly avoid the look most coding agents reach for by default — don't just default to (a) a warm cream background with a high-contrast serif and a terracotta accent, (b) a near-black background with one bright accent color, or (c) a broadsheet/newspaper layout with hairline rules and square corners. Any of those can be right, but only if you arrive there on purpose for this app, not as a generic reflex.

Before writing UI code, write a short design plan and check it against "would this be my default answer for any dashboard app" — if yes, revise it:
- A named color palette (4–6 hex values, with a one-line reason for each)
- A type pairing (a display face used with restraint + a body face + a utility face for data/labels)
- A layout concept for the dashboard, trip view, and forms
- One signature element unique to this app — travel has real visual material to draw from (a boarding-pass-style trip card, a postmark/stamp motif for completed trips, a luggage-tag detail, a map-pin accent) — let one of those anchor the design instead of a generic SaaS look

Keep everything else quiet and disciplined around that one signature choice. Motion should be short and tied to real state changes (checking off a packing item, a trip's status changing) — skip decoration for its own sake, and respect `prefers-reduced-motion`. Write plain, active-voice UI copy ("Add to packing list," not "Submit") and give empty states something to do ("No trips yet — plan your first one" instead of a blank dashboard). Confirm the layout holds up at mobile width and that keyboard focus is visible.

## Autonomy & Decision-Making Rules

- Never ask the user a question. Pick the simplest reasonable interpretation for anything underspecified and move on.
- Log every non-trivial decision (stack details, data-shape choices, design departures, environment fallbacks) in DECISIONS_LOG.md as you make it, not retroactively.

## Build Stages & Git Commits

Work in clearly separated stages, committing at each boundary at minimum (more granular commits are fine):
1. Environment setup — repo scaffold, `.gitignore`, `.env.example`, dependency install
2. Backend — models, DB layer, routes, validation
3. Frontend — routing/pages, API client, core components
4. Styling — design-system pass per the UI direction above
5. Testing — backend + frontend
6. Docs — README and logs

Use short, conventional commit messages (`feat:`, `fix:`, `docs:`, `test:`, `chore:`).

## Failure Handling & Iteration Protocol

Whenever something fails (build error, runtime error, failing test, broken flow):
1. Diagnose the problem
2. Attempt a fix
3. Re-run the relevant command/server/test
4. Record it in PROGRESS_LOG.md — what failed, what you changed, the outcome

Keep iterating on a given failing issue a **minimum of 5** genuinely different attempts before giving up on it, and a **maximum of 8** — if it's still broken after 8, stop, document it clearly as unresolved (or as an environment limitation, per the section above) in PROGRESS_LOG.md, and move on. "5 attempts" means 5 different diagnoses, not the same fix re-run five times — and no single stuck issue should consume the whole run.

## Testing Requirements

- **Backend:** pytest, run against an isolated test database (or the in-memory fallback) — never against dev data. Cover at minimum: CRUD for each resource, and one validation case (e.g. rejecting a trip whose end date precedes its start date).
- **Frontend:** Vitest or Jest + React Testing Library. Cover at minimum: the trip-creation flow and checklist item toggling.
- Actually run the full suite before reporting completion. Report pass/fail honestly in RUN_DATA.md — don't claim a pass you didn't observe.

## Documentation Requirements

**README.md**, in this order: prerequisites; environment variables (every variable, with an example in `.env.example`); dependency install steps for backend and frontend; exact commands and ports to start backend and frontend for local dev; exact commands to run tests; a manual end-to-end walkthrough (create a trip → add checklist items → confirm they persist after a refresh/restart).

**PROGRESS_LOG.md** — open with a running TODO vs. DONE checklist, updated as work completes, followed by chronological entries. Each entry: a sequence marker (timestamp if available, otherwise a running count), what you did, files touched, commands/tests run, result.

**DECISIONS_LOG.md** — one entry per non-trivial decision: what you decided, the alternatives you considered, why you picked this one.

## RUN_DATA.md — fill in this exact template

Use "unknown" with a one-line reason for anything inaccessible. This is raw factual data only — no opinions, no self-assessment.

```
## Run Identity
- Agent/harness (e.g. Claude Code, Cursor, Devin, aider, a raw API loop):
- Model name/identifier:
- Context window (tokens), if known:
- Temperature / top_p / top_k:
- Max tokens per response:
- System/assistant instructions received beyond this prompt (1–2 line summary, or "none"):

## Timeline
- Start time / end time (or "unknown"):
- Stages completed (of 6):
- Total retries across all failed commands/tests:

## Code & Artifacts
- Source files created/modified — backend / frontend / tests (split out):
- Approx. line count — backend / frontend / tests (split out):
- Test cases implemented and executed (count):
- All tests passing at end? (Yes/No):

## Tool Usage
- Shell commands invoked (approx. count):
- Git commits made (count):
- External services used (e.g. MongoDB Atlas / local mongod / mongomock fallback):

## Errors
- [Error 1]: what happened — resolved how, or why it remained unresolved
- [Error 2]: ...
```

## Final Validation

1. Start backend and frontend in dev mode; confirm both run without errors.
2. Manual end-to-end test: create a trip, add checklist items, confirm persistence via the backend and database (or fallback store).
3. Run the automated test suites for backend and frontend.
4. Confirm the README instructions match the actual commands/environment — run them as written, don't just eyeball them.
5. Add a final "Validation complete" entry to PROGRESS_LOG.md.

## Final Report — what to tell the user when done

Give a concise summary only:
- What was built
- Exact commands to start backend and frontend
- File locations for README.md, PROGRESS_LOG.md, DECISIONS_LOG.md, RUN_DATA.md

Do not compare models or rate your own performance. Do not ask for additional input — execute, iterate until things work, and report.
