# Decisions Log

## Database Choice: mongomock Fallback

**Decision**: Use mongomock as the primary test database and fallback for local development when MongoDB is unavailable.

**Alternatives considered**:
1. Require local MongoDB installation - would block developers without MongoDB
2. Docker Compose setup - requires Docker, adds complexity
3. MongoDB Atlas free tier - requires network access and credentials

**Reasoning**: The environment check showed no local `mongod` but Docker is available. However, many agentic coding environments have restricted network access. mongomock provides a zero-config fallback that works everywhere. Production deployments can use real MongoDB by setting `DATABASE_URL`.

---

## Python Version: 3.9 Compatibility

**Decision**: Use Python 3.9-compatible syntax throughout the codebase.

**Alternatives considered**:
1. Use Python 3.10+ union syntax (`Type | None`) - cleaner but breaks on 3.9
2. Add `from __future__ import annotations` - allows newer syntax with older runtime

**Reasoning**: The system has Python 3.9.6 as the default. Using `Optional[Type]` instead of `Type | None` ensures compatibility without requiring future imports or version upgrades.

---

## Sync Operations in Repositories for mongomock

**Decision**: Use synchronous mongomock operations wrapped in async functions rather than true async Motor operations.

**Alternatives considered**:
1. True async with Motor - requires real MongoDB or mongodb-memory-server
2. Thread pool executor for sync ops - adds complexity

**Reasoning**: mongomock is inherently synchronous. Wrapping sync calls in async functions maintains the async interface for FastAPI while using the lightweight in-memory mock. This works because tests run quickly and don't benefit from true concurrency.

---

## Date Serialization Strategy

**Decision**: Convert `datetime.date` objects to ISO strings before storage, convert back on retrieval.

**Alternatives considered**:
1. Use datetime.datetime instead of date - loses semantic clarity for all-day events
2. Custom BSON encoder - more complex, less portable
3. Accept only string input from API - shifts burden to frontend

**Reasoning**: Pydantic handles date parsing from strings automatically in request bodies. Converting to ISO strings ensures mongomock can serialize the document. On retrieval, we convert back to date objects for consistent domain logic.

---

## Styling: Plain CSS over Tailwind

**Decision**: Use plain CSS with custom properties instead of a utility-first framework like Tailwind.

**Alternatives considered**:
1. Tailwind CSS - faster prototyping but larger bundle
2. CSS Modules - better scoping but more boilerplate
3. Styled-components - runtime overhead, JS-based styling

**Reasoning**: The app is small enough that plain CSS is maintainable. A design system in `App.css` with clear organization provides consistency without the build complexity of Tailwind. The file size is minimal and no additional dependencies needed.

---

## Design Direction: Modern Classic

**Decision**: Use a refined, muted color palette with system fonts and subtle motion.

**Alternatives considered**:
1. Warm cream background with terracotta accent - too common in AI-generated designs
2. Dark mode first - not specified as requirement
3. Bold travel-themed graphics - would require assets

**Reasoning**: The "modern classic" direction with navy/sky blue evokes travel (sky, ocean) without being literal. System fonts ensure fast loading and native feel. Status badges and progress bars provide visual interest without requiring custom graphics.

---

## API Structure: Flat Routes vs Nested

**Decision**: Use flat route structure (`/api/trips`, `/api/budget`) instead of nested (`/api/trips/:id/budget`).

**Alternatives considered**:
1. Nested routes - more RESTful but harder to query across parent
2. GraphQL - overkill for simple CRUD

**Reasoning**: Flat routes with `trip_id` in the request body/query are simpler and allow filtering budget/checklist items without fetching the trip first. The API is still logically organized via tags in Swagger docs.

---

## Frontend State Management: No Global Store

**Decision**: Use local component state with direct API calls instead of Redux/Context.

**Alternatives considered**:
1. React Query/SWR - great for caching but adds dependency
2. Context API - useful for auth, not needed here
3. Redux Toolkit - overkill for small app

**Reasoning**: The app is simple enough that prop drilling and local state work fine. Each page fetches its own data on mount. Adding a global store would increase complexity without clear benefit.

---

## Test Database Isolation

**Decision**: Use separate test database name (`test_travel_planner`) with cleanup after each test run.

**Alternatives considered**:
1. Drop and recreate collections per test - slower
2. Use transaction rollback - not supported by MongoDB
3. Single shared test DB - risk of test interference

**Reasoning**: The `setup_test_db` fixture creates a fresh database for the entire test suite, which is fast and isolated from production data. mongomock's in-memory nature means no cleanup is actually needed between runs.
