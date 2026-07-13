# 🧠 Decisions Log

| #   | Timestamp | Skill | Decision | Reasoning | Alternatives Considered |
| --- | --------- | ----- | -------- | --------- | ----------------------- |
| 1   | 2026-07-13 00:00 | 01 | Beginning FARM Stack TripForge build | Per prompt.md instructions | N/A |
| 2   | 2026-07-13 00:01 | 01 | Python 3.9 used for venv | System default on macOS | Python 3.11+ preferred but 3.9 available |
| 3   | 2026-07-13 00:01 | 01 | Cleared frontend dir before Vite scaffold | .env file caused "directory not empty" cancellation | Could have used --force flag |
| 4   | 2026-07-13 00:06 | 02 | Used lifespan context manager for startup/shutdown | Modern FastAPI pattern, replaces deprecated on_event | on_event decorator |
| 5   | 2026-07-13 00:06 | 02 | Database init logs warning but doesn't crash on MongoDB failure | Allows frontend-only development without MongoDB running | Hard crash on DB failure |
| 6   | 2026-07-13 00:06 | 02 | Used Pydantic v2 model_config instead of Config class | Pydantic v2 compatibility | Legacy Config class |
| 7   | 2026-07-13 00:10 | 03 | Used Python Enum for trip status and categories | Type-safe, self-documenting | Plain strings with validators |
| 8   | 2026-07-13 00:10 | 03 | Used Beanie PydanticObjectId for all references | Native Beanie integration | Manual ObjectId conversion |
| 9   | 2026-07-13 00:15 | 04 | Service layer pattern for business logic | Thin routes, fat services, testable | All logic in route handlers |
| 10  | 2026-07-13 00:15 | 04 | Temp auth stub returns mock user | Enables testing CRUD before JWT auth | Could have skipped to Skill 05 first |
| 11  | 2026-07-13 00:22 | 05 | JWT with 24h token expiration | Reasonable session length for SPA | Shorter (1h) or longer (7d) tokens |
| 12  | 2026-07-13 00:22 | 05 | Password requires uppercase, lowercase, digit, 8+ chars | Basic strength requirements | Could add special char requirement |
| 13  | 2026-07-13 00:22 | 05 | Stateless JWT auth (no token blacklist) | Simplicity, no Redis needed | Token blacklist with Redis for logout |
| 14  | 2026-07-13 00:30 | 06 | Vite with @ path alias for imports | Cleaner import paths, standard convention | Relative imports only |
| 15  | 2026-07-13 00:30 | 06 | React Router v6 with nested routes | Clean URL structure, code splitting friendly | Flat route structure |
| 16  | 2026-07-13 00:38 | 07 | Inline styles with CSS variables | No CSS-in-JS library overhead, good performance | CSS modules, styled-components |
| 17  | 2026-07-13 00:48 | 08 | Split login/register into 60/40 layout | Modern auth page design, engaging | Single column centered form |
| 18  | 2026-07-13 01:00 | 09 | Kept inline styles with CSS variables for components | Flexibility per component, no class name conflicts | Pure CSS class-based approach |
| 19  | 2026-07-13 01:05 | 10 | React Context + useReducer for state management | No external state library needed for this scale | Redux/Zustand/Jotai |
| 20  | 2026-07-13 01:05 | 10 | Axios with interceptors for API layer | Request/response middleware, auto token injection | fetch() with manual wrapper |
| 21  | 2026-07-13 01:15 | 11 | pytest-asyncio for backend async tests | Standard async test framework | unittest.async |
| 22  | 2026-07-13 01:20 | 12 | Docker Compose with 3 services | Simple local dev + deploy | Kubernetes manifests |
