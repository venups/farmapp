# 🚀 FARM Stack Trip Planner — Complete Build Prompt

> **Purpose**: This prompt instructs you (an AI coding assistant) to build a **complete, production-quality FARM Stack (FastAPI + React + MongoDB) trip planning web application** from scratch. You MUST execute every step to 100% completion without stopping, pausing, or asking for clarification. Make all reasonable decisions autonomously. You have full permission to install any packages, create any files, modify any files, and run any commands within this repository.

---

## 🔑 CRITICAL RULES — READ FIRST

1. **DO NOT STOP**. Execute every skill file from start to finish. If you encounter an ambiguity, make the best reasonable decision, document it in `_progress/decisions.md`, and continue.
2. **DO NOT ASK QUESTIONS**. You have full autonomy. Make decisions and document them.
3. **INSTALL ANYTHING NEEDED**. You have permission to run `npm install`, `pip install`, `npx`, `docker`, or any other package manager commands.
4. **CREATE ALL FILES**. Every file described must be fully implemented — no placeholders, no `TODO` comments, no `pass` statements, no `// implement later` comments. Every function must have a real implementation.
5. **TRACK EVERYTHING**. Create and update tracking files in the `_progress/` directory as described below.
6. **QUALITY OVER SPEED**. Write clean, well-documented, production-grade code. Use proper error handling, input validation, type hints (Python) and TypeScript types (React).
7. **WORK SEQUENTIALLY**. Execute skill files in order: 01 → 02 → 03 → ... → 12. Each skill builds on the previous.
8. **TEST AS YOU GO**. After completing each skill, verify the work compiles/runs where applicable.
9. **USE RELATIVE PATHS**. All skill files are located at `./skills/` relative to this file.

---

## 📊 PROGRESS TRACKING SYSTEM

Before writing any code, create the `_progress/` directory and initialize these tracking files:

### File: `_progress/decisions.md`

```markdown
# 🧠 Decisions Log

| #   | Timestamp | Skill | Decision | Reasoning | Alternatives Considered |
| --- | --------- | ----- | -------- | --------- | ----------------------- |
```

Every time you make a non-obvious decision (package choice, architecture choice, naming convention, etc.), append a row.

### File: `_progress/checklist.md`

```markdown
# ✅ Build Checklist

## Phase 1: Foundation

- [ ] Project directory structure created
- [ ] Backend Python environment initialized
- [ ] Frontend React app scaffolded
- [ ] MongoDB connection configured
- [ ] Environment variables set up

## Phase 2: Backend Core

- [ ] FastAPI app entry point created
- [ ] Database models defined (User, Trip, Itinerary, Activity, Expense)
- [ ] CRUD operations implemented
- [ ] Authentication system (JWT) implemented
- [ ] All API routes created and tested
- [ ] Input validation with Pydantic
- [ ] Error handling middleware

## Phase 3: Frontend Core

- [ ] React project with TypeScript configured
- [ ] Routing set up (React Router)
- [ ] Authentication pages (Login, Register)
- [ ] Dashboard page
- [ ] Trip creation/edit pages
- [ ] Itinerary builder page
- [ ] Expense tracker page
- [ ] Profile/settings page
- [ ] Responsive navigation

## Phase 4: Integration & Polish

- [ ] Frontend connected to backend API
- [ ] State management working
- [ ] All CRUD flows functional end-to-end
- [ ] Styling complete and responsive
- [ ] Loading states and error handling in UI
- [ ] Docker configuration created
- [ ] README.md written
- [ ] Final build summary generated

## Completion: \_\_\_% (update as you progress)
```

### File: `_progress/progress.md`

```markdown
# 📈 Build Progress Log

| Skill # | Skill Name                         | Status     | Start Time | End Time | Files Created | Lines Written | Notes |
| ------- | ---------------------------------- | ---------- | ---------- | -------- | ------------- | ------------- | ----- |
| 01      | Project Initialization             | ⏳ Pending |            |          |               |               |       |
| 02      | Backend FastAPI Setup              | ⏳ Pending |            |          |               |               |       |
| 03      | MongoDB Models & Schemas           | ⏳ Pending |            |          |               |               |       |
| 04      | API Routes & CRUD                  | ⏳ Pending |            |          |               |               |       |
| 05      | Authentication System              | ⏳ Pending |            |          |               |               |       |
| 06      | Frontend React Setup               | ⏳ Pending |            |          |               |               |       |
| 07      | UI Components Library              | ⏳ Pending |            |          |               |               |       |
| 08      | Pages & Views                      | ⏳ Pending |            |          |               |               |       |
| 09      | Styling & Design System            | ⏳ Pending |            |          |               |               |       |
| 10      | State Management & API Integration | ⏳ Pending |            |          |               |               |       |
| 11      | Testing & Validation               | ⏳ Pending |            |          |               |               |       |
| 12      | Deployment, Docs & Final Summary   | ⏳ Pending |            |          |               |               |       |
```

### File: `_progress/errors.md`

```markdown
# ❌ Errors & Resolutions Log

| #   | Timestamp | Skill | Error Description | Resolution | Time to Resolve |
| --- | --------- | ----- | ----------------- | ---------- | --------------- |
```

Log any errors you encounter during the build and how you resolved them.

### File: `_progress/quality_metrics.md`

```markdown
# 📐 Quality Metrics

## Code Quality

- [ ] All Python functions have type hints
- [ ] All Python functions have docstrings
- [ ] All TypeScript components have prop types
- [ ] No `any` types used in TypeScript
- [ ] Consistent naming conventions (snake_case Python, camelCase TS)
- [ ] No unused imports
- [ ] No hardcoded secrets or credentials
- [ ] Environment variables used for configuration
- [ ] Proper error handling (try/catch, HTTP error responses)
- [ ] Input validation on all API endpoints

## Architecture Quality

- [ ] Clear separation of concerns (routes, models, services, utils)
- [ ] Reusable React components
- [ ] Centralized API client
- [ ] Consistent file naming and organization
- [ ] No circular dependencies

## UX Quality

- [ ] Loading states on all async operations
- [ ] Error messages displayed to user
- [ ] Form validation with user-friendly messages
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Consistent visual language
- [ ] Smooth transitions and animations
- [ ] Accessible (semantic HTML, ARIA labels, keyboard nav)
```

---

## 🏗️ APPLICATION OVERVIEW

### What You Are Building

**TripForge** — A modern, feature-rich trip planning web application that helps users plan, organize, and track their travel experiences.

### Core Features

1. **User Authentication** — Register, login, logout, profile management with JWT tokens
2. **Trip Management** — Create, edit, delete, and share trips with dates, destinations, cover images
3. **Itinerary Builder** — Day-by-day itinerary with drag-and-drop activities, time slots, locations
4. **Activity Library** — Browse, search, and add activities (restaurants, attractions, tours) to itineraries
5. **Expense Tracker** — Track trip expenses by category, split costs, view spending charts
6. **Collaborative Planning** — Invite others to view/edit trips (collaborator system)
7. **Dashboard** — Overview of upcoming, ongoing, and past trips with stats
8. **Map Integration** — Display trip locations on an interactive map (use Leaflet.js — it's free, no API key needed)
9. **Packing List** — Checklist for packing items per trip
10. **Photo Gallery** — Upload and organize trip photos (use local file storage, not cloud)

### Tech Stack (FARM Stack)

| Layer          | Technology                 | Version       | Notes                                   |
| -------------- | -------------------------- | ------------- | --------------------------------------- |
| **Backend**    | FastAPI                    | Latest stable | Python 3.11+                            |
| **Database**   | MongoDB                    | Latest        | Use Motor (async driver) + Beanie (ODM) |
| **Frontend**   | React                      | 18+           | With TypeScript, using Vite as bundler  |
| **Styling**    | Vanilla CSS                | —             | CSS custom properties, no Tailwind      |
| **State**      | React Context + useReducer | —             | No Redux needed                         |
| **Routing**    | React Router               | v6+           | —                                       |
| **Maps**       | Leaflet.js + react-leaflet | Latest        | Free, no API key                        |
| **Charts**     | Recharts                   | Latest        | For expense visualization               |
| **Icons**      | Lucide React               | Latest        | Modern icon set                         |
| **HTTP**       | Axios                      | Latest        | For API calls                           |
| **Auth**       | JWT (python-jose) + bcrypt | —             | Secure password hashing                 |
| **Validation** | Pydantic v2                | —             | Backend validation                      |
| **Date**       | date-fns                   | Latest        | Frontend date handling                  |
| **DnD**        | @hello-pangea/dnd          | Latest        | Drag and drop for itinerary             |
| **Toast**      | react-hot-toast            | Latest        | Notification toasts                     |

### Target Directory Structure

```
farmapp/
├── prompt.md                          ← THIS FILE
├── skills/                            ← Skill instruction files
│   ├── 01-project-initialization.md
│   ├── 02-backend-fastapi-setup.md
│   ├── 03-mongodb-models-schemas.md
│   ├── 04-api-routes-crud.md
│   ├── 05-authentication-system.md
│   ├── 06-frontend-react-setup.md
│   ├── 07-ui-components-library.md
│   ├── 08-pages-and-views.md
│   ├── 09-styling-design-system.md
│   ├── 10-state-api-integration.md
│   ├── 11-testing-validation.md
│   └── 12-deployment-docs-summary.md
├── _progress/                         ← Auto-generated tracking files
│   ├── decisions.md
│   ├── checklist.md
│   ├── progress.md
│   ├── errors.md
│   └── quality_metrics.md
├── backend/                           ← FastAPI backend
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   └── utils/
│   ├── requirements.txt
│   ├── .env
│   └── .env.example
├── frontend/                          ← React frontend
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   └── styles/
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── docker-compose.yml
├── Dockerfile.backend
├── Dockerfile.frontend
├── .gitignore
├── README.md
└── Makefile
```

---

## 🎯 EXECUTION INSTRUCTIONS

### Step 0: Initialize Progress Tracking

1. Create the `_progress/` directory
2. Create all 5 tracking files listed above with their initial content
3. Record the current timestamp as `BUILD_START_TIME`
4. Log Decision #1: "Beginning FARM Stack TripForge build"

### Steps 1–12: Execute Skill Files IN ORDER

Read and execute each skill file completely before moving to the next. The skill files are located at relative paths from this file:

| Order | Skill File (relative path)               | Description                                                       |
| ----- | ---------------------------------------- | ----------------------------------------------------------------- |
| 1     | `./skills/01-project-initialization.md`  | Create project structure, init environments, install base deps    |
| 2     | `./skills/02-backend-fastapi-setup.md`   | Set up FastAPI app, config, CORS, database connection             |
| 3     | `./skills/03-mongodb-models-schemas.md`  | Define all MongoDB document models and Pydantic schemas           |
| 4     | `./skills/04-api-routes-crud.md`         | Implement all REST API endpoints with full CRUD                   |
| 5     | `./skills/05-authentication-system.md`   | JWT auth, password hashing, protected routes, middleware          |
| 6     | `./skills/06-frontend-react-setup.md`    | Scaffold React+TS app, routing, base layout                       |
| 7     | `./skills/07-ui-components-library.md`   | Build all reusable UI components                                  |
| 8     | `./skills/08-pages-and-views.md`         | Implement all application pages                                   |
| 9     | `./skills/09-styling-design-system.md`   | Complete CSS design system, theming, responsive design            |
| 10    | `./skills/10-state-api-integration.md`   | Context providers, API service layer, connect frontend to backend |
| 11    | `./skills/11-testing-validation.md`      | Backend tests, frontend smoke tests, validation                   |
| 12    | `./skills/12-deployment-docs-summary.md` | Docker, README, Makefile, final build summary                     |

### After Each Skill:

1. Update `_progress/checklist.md` — check off completed items
2. Update `_progress/progress.md` — fill in the row for the completed skill (status, timestamps, file count, line count)
3. Log any decisions made in `_progress/decisions.md`
4. Log any errors encountered in `_progress/errors.md`

### Step 13: Generate Final Build Summary

After ALL skills are complete, create `_progress/build_summary.md` with this EXACT structure:

```markdown
# 🏁 FINAL BUILD SUMMARY — TripForge

## Build Metadata

- **Model Name**: [Your model name/version]
- **Build Start Time**: [timestamp]
- **Build End Time**: [timestamp]
- **Total Build Duration**: [HH:MM:SS]
- **Completion Percentage**: [X]%

## Code Statistics

| Metric            | Backend | Frontend | Total |
| ----------------- | ------- | -------- | ----- |
| Files Created     |         |          |       |
| Lines of Code     |         |          |       |
| Lines of Comments |         |          |       |
| Functions/Methods |         |          |       |
| React Components  | N/A     |          |       |
| API Endpoints     |         | N/A      |       |
| Database Models   |         | N/A      |       |
| Test Files        |         |          |       |
| Test Cases        |         |          |       |

## File Inventory

[List every file created with its path and line count]

## Package Dependencies

### Backend (Python)

[List every pip package installed with version]

### Frontend (Node.js)

[List every npm package installed with version]

## Features Implemented

| Feature             | Status   | Notes |
| ------------------- | -------- | ----- |
| User Registration   | ✅/❌/⚠️ |       |
| User Login/Logout   | ✅/❌/⚠️ |       |
| Trip CRUD           | ✅/❌/⚠️ |       |
| Itinerary Builder   | ✅/❌/⚠️ |       |
| Activity Management | ✅/❌/⚠️ |       |
| Expense Tracker     | ✅/❌/⚠️ |       |
| Collaborators       | ✅/❌/⚠️ |       |
| Dashboard           | ✅/❌/⚠️ |       |
| Map Integration     | ✅/❌/⚠️ |       |
| Packing List        | ✅/❌/⚠️ |       |
| Photo Gallery       | ✅/❌/⚠️ |       |
| Responsive Design   | ✅/❌/⚠️ |       |
| Dark Mode           | ✅/❌/⚠️ |       |
| Loading States      | ✅/❌/⚠️ |       |
| Error Handling      | ✅/❌/⚠️ |       |
| Docker Setup        | ✅/❌/⚠️ |       |

## Decisions Made

[Total count]: See `_progress/decisions.md` for full log.

## Errors Encountered

[Total count]: See `_progress/errors.md` for full log.

## Quality Self-Assessment

Rate yourself 1-10 on each:
| Dimension | Score | Justification |
|-----------|-------|---------------|
| Code Completeness | /10 | |
| Code Quality | /10 | |
| Architecture | /10 | |
| UI/UX Design | /10 | |
| Error Handling | /10 | |
| Documentation | /10 | |
| Test Coverage | /10 | |
| Overall | /10 | |

## Architecture Diagram

[Draw an ASCII or mermaid diagram showing the system architecture]

## Known Limitations

[List any features that are incomplete or have known issues]

## What I Would Improve With More Time

[List improvements you would make]
```

---

## 🎨 DESIGN REQUIREMENTS

### Visual Identity

- **App Name**: TripForge
- **Tagline**: "Forge Your Perfect Journey"
- **Primary Color**: `#6366F1` (Indigo)
- **Secondary Color**: `#EC4899` (Pink)
- **Accent Color**: `#10B981` (Emerald)
- **Dark Background**: `#0F172A` (Slate 900)
- **Card Background**: `#1E293B` (Slate 800)
- **Text Primary**: `#F8FAFC` (Slate 50)
- **Text Secondary**: `#94A3B8` (Slate 400)
- **Error**: `#EF4444` (Red)
- **Warning**: `#F59E0B` (Amber)
- **Success**: `#10B981` (Emerald)
- **Border Radius**: `12px` (cards), `8px` (buttons), `6px` (inputs)
- **Font**: Inter (from Google Fonts) — fallback: system-ui, sans-serif
- **Design Style**: Dark mode by default, glassmorphism cards, subtle gradients, smooth transitions

### UI Principles

1. Every interactive element must have a hover state
2. Every async operation must show a loading spinner or skeleton
3. Every form must have inline validation
4. Every destructive action must have a confirmation dialog
5. Use smooth CSS transitions (200-300ms ease)
6. Cards should have subtle `backdrop-filter: blur()` glassmorphism
7. Navigation should highlight the active route
8. Mobile-first responsive design with breakpoints at 640px, 768px, 1024px, 1280px

---

## 🔐 ENVIRONMENT VARIABLES

Use these defaults (the user will replace with real values):

### Backend `.env`

```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=tripforge
JWT_SECRET_KEY=tripforge-super-secret-key-change-in-production-2024
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
FRONTEND_URL=http://localhost:5173
UPLOAD_DIR=./uploads
MAX_UPLOAD_SIZE_MB=10
```

### Frontend `.env`

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=TripForge
```

---

## ⚡ BEGIN EXECUTION NOW

1. Read `./skills/01-project-initialization.md`
2. Execute every instruction in it
3. Update progress tracking files
4. Move to the next skill
5. Repeat until all 12 skills are complete
6. Generate the final build summary

**START NOW. DO NOT STOP UNTIL THE FINAL BUILD SUMMARY IS WRITTEN.**
