# Travel Planner

A full-stack travel planning application built with the FARM stack (FastAPI, React, MongoDB).

## Features

- **Trip Management**: Create, edit, and delete trips with dates, destinations, and descriptions
- **Daily Itineraries**: Plan day-by-day activities with times, locations, and costs
- **Budget Tracking**: Add and manage budget items by category
- **Packing Checklists**: Create categorized checklists with completion tracking
- **Dashboard**: Overview of all trips with prep progress and budget summaries
- **Modern Classic UI**: Refined typography, muted premium colors, smooth animations

## Prerequisites

- **Python 3.9+** (for backend)
- **Node.js 18+** and **npm** (for frontend)
- **Docker & Docker Compose** (for containerized deployment)
- **MongoDB** (local or Docker)

## Quick Start (Docker Compose)

The easiest way to run the entire stack:

```bash
# Build and start all services
docker compose up --build

# The application will be available at:
# - Frontend: http://localhost:5173
# - Backend API: http://localhost:8000
# - MongoDB: localhost:27017
```

## Local Development

### 1. Start MongoDB

```bash
# Using Docker
docker compose up -d mongo

# Or use a local MongoDB installation on port 27017
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment (recommended)
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your MongoDB connection string

# Run the backend server
python3 -m uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy and configure environment variables
cp .env.example .env  # If .env.example exists
# Or create .env with: VITE_API_URL=http://localhost:8000

# Run the development server
npm run dev
```

The frontend will be available at http://localhost:5173.

## Running Tests

### Backend Tests

```bash
cd backend

# Ensure MongoDB is running
docker compose up -d mongo

# Run tests
python3 -m pytest tests/ -v
```

### Frontend Tests

```bash
cd frontend
npm test
```

### Docker Tests

```bash
# Run backend tests in Docker
docker compose run --rm backend python3 -m pytest tests/ -v

# Run frontend tests in Docker
docker compose run --rm frontend npm test
```

## Project Structure

```
├── backend/                    # FastAPI backend
│   ├── app/
│   │   ├── main.py            # API routes
│   │   ├── crud.py            # Database operations
│   │   ├── models.py          # Pydantic models
│   │   ├── database.py        # MongoDB connection
│   │   └── config.py          # Configuration
│   ├── tests/
│   │   └── test_api.py        # Backend tests
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── pages/             # Page components
│   │   ├── components/        # Reusable components
│   │   ├── api.js             # API client
│   │   ├── App.jsx            # App router
│   │   └── index.css          # Global styles
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml          # Docker orchestration
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/trips` | List all trips |
| GET | `/api/trips/dashboard` | Dashboard summary |
| GET | `/api/trips/{id}` | Get trip by ID |
| POST | `/api/trips` | Create trip |
| PUT | `/api/trips/{id}` | Update trip |
| DELETE | `/api/trips/{id}` | Delete trip |
| POST | `/api/trips/{id}/checklist` | Add checklist item |
| PUT | `/api/trips/{id}/checklist/{item_id}/toggle` | Toggle checklist item |
| DELETE | `/api/trips/{id}/checklist/{item_id}` | Delete checklist item |
| POST | `/api/trips/{id}/budget` | Add budget item |
| DELETE | `/api/trips/{id}/budget/{item_id}` | Delete budget item |
| POST | `/api/trips/{id}/itinerary` | Add itinerary day |
| POST | `/api/trips/{id}/itinerary/{day_index}/activities` | Add activity |

## Environment Variables

### Backend (.env)

```
MONGO_URL=mongodb://localhost:27017
MONGO_DB=travelplanner
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Frontend (.env)

```
VITE_API_URL=http://localhost:8000
```

## Manual End-to-End Test

1. Open http://localhost:5173 in your browser
2. Click "+ New Trip" in the sidebar
3. Fill in trip details (e.g., "Summer in Paris", destination "Paris, France", dates)
4. Click "Create Trip"
5. On the trip detail page:
   - Go to the "Checklist" tab and add items (e.g., "Pack passport")
   - Go to the "Budget" tab and add items (e.g., "Flight" $500)
   - Go to the "Itinerary" tab and add days with activities
6. Check the "Dashboard" page to see trip overview with progress bars
7. Refresh the page to confirm data persistence
