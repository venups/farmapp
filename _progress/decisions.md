# 🧠 Decisions Log

| #   | Timestamp | Skill | Decision | Reasoning | Alternatives Considered |
| --- | --------- | ----- | -------- | --------- | ----------------------- |
| 1   | 2026-07-13T20:24:00Z | 01 | Use Python 3.9 for venv | Available on system, compatible with all required packages | N/A |
| 2   | 2026-07-13T20:24:00Z | 01 | Select specific package versions | Ensure stability and compatibility with FARM stack | N/A |
| 3   | 2026-07-13T20:24:00Z | 01 | Use bash to create files | Write tool has filePath parsing issues | N/A |
| 4   | 2026-07-13T20:25:00Z | 02 | Use lifespan instead of deprecated @app.on_event | Best practice for FastAPI, proper async context management |
| 5   | 2026-07-13T20:25:00Z | 02 | Allow multiple CORS origins including localhost ports | Support both Vite (5173) and npm start (3000) |
| 6   | 2026-07-13T20:25:00Z | 02 | Custom exception format uses ISO timestamp | Standard JSON response format with timestamps |
| 7   | 2026-07-13T20:49:00Z | 03 | Use Field() with default values for optional fields | Simpler than Optional[Field(...)] syntax |
| 8   | 2026-07-13T20:49:00Z | 03 | Remove Field validators at class level in models | Pydantic v2 validates on create/update, not model definition |
| 9   | 2026-07-13T20:51:00Z | 04 | Implement CRUD endpoints in router files directly | FastAPI routes directly call services for clean separation |
| 10  | 2026-07-13T20:51:00Z | 04 | Use depends(get_current_user) for auth | Simple dependency injection pattern |
| 11  | 2026-07-13T20:55:00Z | 05 | Use datetime.now(timezone.utc) for timestamps | Proper timezone handling |
| 12  | 2026-07-13T20:55:00Z | 05 | Password validation requires uppercase, lowercase, digit | Security best practices |
| 13  | 2026-07-13T20:55:00Z | 05 | Soft delete with is_active flag instead of hard delete | Better data retention |
| 14  | 2026-07-13T21:00:00Z | 06 | Use Vite bundler instead of Create React App | Faster builds, better TypeScript support |
| 15  | 2026-07-13T21:00:00Z | 06 | Use React Router v6 for navigation | Standard routing library, simple API |
| 16  | 2026-07-13T21:00:00Z | 06 | Structure pages as placeholder components in Skill 06 | Full implementation in Skill 08 for flexibility |
| 17  | 2026-07-13T21:00:00Z | 06 | Custom CSS variables for design tokens | Full control over theme without frameworks |
| 18  | 2026-07-13T21:15:00Z | 07 | Create 16 common components + 13 specialized components | Total of 29 components for all pages |
| 19  | 2026-07-13T21:15:00Z | 07 | Use CSS variables for all styling | Consistent theme management |
| 20  | 2026-07-13T21:15:00Z | 07 | Use lucide-react for icons | Modern, consistent icon set |
| 21  | 2026-07-13T21:25:00Z | 08 | Implement full-page layouts for auth pages | Better UX without layout constraints |
| 22  | 2026-07-13T21:25:00Z | 08 | Use react-router-dom for navigation | Standard routing, clean API |
| 23  | 2026-07-13T21:25:00Z | 08 | Add tabs for trip detail pages | User-friendly navigation between itinerary/expenses/packing |
| 24  | 2026-07-13T21:25:00Z | 08 | Mock API with console.log for Skill 10 integration | Clean separation of concerns |
| 25  | 2026-07-13T21:35:00Z | 09 | Created comprehensive CSS design system with tokens and animations | Full control over styling without Tailwind |
| 26  | 2026-07-13T21:35:00Z | 09 | Glassmorphism cards with backdrop-filter | Modern aesthetic consistent throughout app |
| 27  | 2026-07-13T21:35:00Z | 09 | Responsive design with media queries at standard breakpoints | Mobile-first approach |
| 28  | 2026-07-13T21:45:00Z | 10 | Use React Context + useReducer for state management | No Redux needed, simpler and clean API |
| 29  | 2026-07-13T21:45:00Z | 10 | Implement optimistic UI updates for best UX | Update state before API confirms |
| 30  | 2026-07-13T21:45:00Z | 10 | Centralize API client with interceptors | Single source of truth for all requests |
| 31  | 2026-07-13T21:55:00Z | 11 | Test configuration with pytest fixtures | Clean, reusable test setup |
| 32  | 2026-07-13T22:24:00Z | 12 | Docker multi-stage build for frontend | Smaller image size, better security |
| 33  | 2026-07-13T22:24:00Z | 12 | Use nginx for frontend serving | Production-ready static file serving |
| 34  | 2026-07-13T22:24:00Z | 12 | Health check configured for backend | Docker can monitor app health |
