# Detailed Prompt for Local LLM: Build Elysium Travels (FARM Stack)

You are an expert full-stack software engineer and architect. Your task is to **autonomously build a complete, production-ready Travel Planner web application** called **"Elysium Travels"** using the **FARM stack** (FastAPI + React + MongoDB).

## Core Requirements
- **Modern Classic aesthetic**: Elegant, timeless design with clean typography (Inter + Playfair Display), sophisticated color palette (deep navy, warm cream, gold accents, soft charcoal), generous whitespace, subtle shadows, micro-animations, and premium feel. Think a blend of classic luxury travel sites (Ritz-Carlton, Abercrombie & Kent) with modern polish. Fully responsive, mobile-first.
- Must feel **stunning and delightful** — high-end UI/UX.
- Full user flows must work end-to-end.

## Key Features
1. **Authentication** (JWT): Register, Login, Logout, Protected routes.
2. **Homepage**: Hero with search bar, featured destinations, testimonials carousel, destination grid.
3. **Destination Discovery**: Search/filter by continent, budget, interests (beach, culture, adventure, food, etc.), interactive world map (use Leaflet or React-Leaflet).
4. **Trip Planner**: Build custom itineraries (add days, activities, notes, estimated cost). Drag-and-drop day planner.
5. **Saved Trips & Wishlist**.
6. **User Dashboard**: My Trips, Profile, Budget tracker.
7. **AI Trip Suggestion** (mocked — call a placeholder endpoint that returns beautiful suggestions).
8. **Booking Simulation** (mock payment flow that "confirms" bookings).
9. **Responsive & Accessible** (ARIA, keyboard nav, high contrast).

## Tech Stack (exact)
- **Backend**: FastAPI (Python 3.11+), MongoDB (Motor async driver), Pydantic v2, JWT (PyJWT), Uvicorn.
- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS + shadcn/ui + TanStack Query + Zustand + React Router v6 + Leaflet.
- **Database**: MongoDB (local or Docker).
- **Other**: Docker + Docker Compose recommended for easy setup, ESLint, Prettier, type safety everywhere.

## Mandatory Process Rules (Follow strictly)
You must work **autonomously**. Do **not** ask me any questions or for decisions. Make every choice yourself and justify it.

## Tracking & Transparency (Critical for evaluation)
Throughout the entire response, maintain:
- A live **Progress Checklist** (markdown table or checklist) that updates in every major section.
- **Decision Log**: For every major decision (architecture, library choice, design, DB schema, etc.), write a short "Decision: [choice] → Reason: [explanation]".
- **Reasoning Trace**: Show your step-by-step thinking before acting.
- At the end of each major stage, output:  
  `=== STAGE COMPLETE: [Stage Name] ===`  
  `Current Progress: X/X tasks`

## Development Stages (Commit in these exact stages)

### Stage 1: Project Setup & Architecture
- Create full project structure (monorepo or separate backend/frontend folders).
- Provide complete `docker-compose.yml` (MongoDB + backend + frontend).
- Backend: project skeleton, env vars, MongoDB connection, basic routes.
- Frontend: Vite + React + TS + Tailwind + shadcn setup.

### Stage 2: Backend Development
- Models/Schemas (User, Destination, Trip, ItineraryDay, Activity).
- CRUD APIs for all major resources.
- Auth endpoints.
- Search & filtering endpoints.
- Mock AI suggestion endpoint.
- Proper error handling, validation, CORS.

### Stage 3: Frontend Development
- Implement all UI components with stunning modern-classic design.
- State management, routing, protected routes.
- Integrate all backend APIs.
- Beautiful forms, modals, maps, drag-and-drop.
- Loading states, error handling, toast notifications.

### Stage 4: Integration, Polish & Testing
- Connect everything.
- Add animations (Framer Motion or Tailwind transitions).
- Implement mock booking flow.
- Write basic tests (backend: pytest, frontend: Vitest + React Testing Library — at least 8-10 meaningful tests).
- Run and verify everything works.

### Stage 5: Documentation & Delivery
- Complete, professional `README.md` (root level) with:
  - Project overview
  - Tech stack
  - Setup instructions (Docker + manual)
  - Environment variables
  - How to run backend, frontend, both
  - How to test key flows
  - Screenshots/gifs (describe where to place them)
  - Future improvements
- Deployment notes (Vercel + Render or Railway suggestion).

## Final Output Structure
Organize your final response as:
1. Executive Summary + Final Progress Checklist
2. Decision Log (all decisions)
3. Complete Project Structure (tree)
4. All code files (use markdown code blocks with full file paths: `backend/app/main.py`, `frontend/src/App.tsx`, etc.)
5. docker-compose.yml and .env.example
6. Full README.md content
7. Testing Report: What you tested, results, any issues found and fixed.
8. Self-Evaluation: What you think is excellent vs. areas for improvement.

## Execution Rules
- Provide **complete, copy-pasteable code**. No placeholders like "implement this later".
- Use best practices (async, dependency injection where sensible, proper separation of concerns).
- Make the UI **visually exceptional** — rich hero sections, elegant cards, smooth interactions.
- Include seed data script for initial destinations.
- Ensure everything installs and runs cleanly.

## For Model Quality Evaluation
Be extremely verbose and transparent:
- Show token-efficient vs. long reasoning when relevant.
- Log every major command you would run (`npm install ...`, `pip install ...`, etc.).
- If you were to run this yourself, show the expected terminal output summary.
- At the very end, output a **Model Behavior Summary** with:
  - Total stages completed
  - Number of decisions logged
  - Estimated lines of code produced
  - Consistency score (self-assessed 1-10)
  - Creativity & Design Quality (1-10)
  - Completeness (1-10)
  - Autonomy level demonstrated

Start building now. Begin with Stage 1 and proceed sequentially, updating the checklist at every step.

**Begin.**
