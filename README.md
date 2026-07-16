# Travel Planner

A simple, single-user travel planning web application built with the FARM stack (FastAPI, React, MongoDB).

## Features

- **Trip Management**: Create, edit, and delete trips with destinations and dates
- **Daily Itineraries**: Plan activities for each day of your trip
- **Budget Tracking**: Track planned vs. actual expenses by category
- **Checklists**: Packing lists and preparation to-do items
- **Dashboard**: Overview of all trips with status breakdown

## Prerequisites

- Python 3.9+
- Node.js 22+ (or any recent LTS version)
- MongoDB (optional - app falls back to in-memory database if not available)

## Environment Setup

### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (recommended):
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On macOS/Linux
   # or
   .\venv\Scripts\Activate  # On Windows
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration:
   - `DATABASE_URL`: MongoDB connection string (default: `mongodb://localhost:27017`)
   - `DATABASE_NAME`: Database name (default: `travel_planner`)
   - `USE_MONGO_MEMORY_SERVER`: Set to `true` for in-memory database (default: `false`)
   - `BACKEND_PORT`: Server port (default: `8000`)

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration:
   - `VITE_API_BASE_URL`: Backend API URL (default: `http://localhost:8000/api`)
   - `FRONTEND_PORT`: Dev server port (default: `5173`)

## Running the Application

### Start Backend Server

From the `backend` directory:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`.

API documentation is available at `http://localhost:8000/docs` (Swagger UI).

### Start Frontend Dev Server

From the `frontend` directory:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## Running Tests

### Backend Tests

```bash
cd backend
python -m pytest tests/ -v
```

Tests use an in-memory MongoDB fallback (mongomock) and do not require a running database.

### Frontend Tests

```bash
cd frontend
npm test
```

## Manual End-to-End Walkthrough

1. **Start both servers** (backend on port 8000, frontend on port 5173)

2. **Create a trip**:
   - Navigate to `http://localhost:5173`
   - Click "New Trip" or "+ New Trip"
   - Fill in the form:
     - Name: "Summer Vacation"
     - Destinations: Add "Paris", "London"
     - Start Date: A future date
     - End Date: 7-10 days after start
   - Click "Create Trip"

3. **Add checklist items**:
   - On the trip detail page, click the "Checklist" tab
   - Under "Packing List", add items like "Passport", "Camera"
   - Under "Preparation / To-Do", add items like "Book flights", "Reserve hotels"
   - Toggle checkboxes to mark items complete

4. **Verify persistence**:
   - Refresh the page or restart the backend server
   - Your trip and checklist items should still be there

5. **Add itinerary days**:
   - Click the "Itinerary" tab
   - Select a date within your trip range
   - Add activities with optional times

6. **Track budget**:
   - Click the "Budget" tab
   - Add items with categories (lodging, food, transport, activities)
   - Track planned vs. actual amounts

## Project Structure

```
farmapp/
├── backend/
│   ├── app/
│   │   ├── api/           # API route handlers
│   │   ├── repositories/  # Data access layer
│   │   ├── schemas/       # Pydantic models
│   │   ├── db.py          # Database connection
│   │   ├── main.py        # FastAPI app entry point
│   │   └── settings.py    # Configuration
│   ├── tests/             # Backend tests
│   ├── requirements.txt
│   └── pyproject.toml
├── frontend/
│   ├── src/
│   │   ├── pages/         # React page components
│   │   ├── components/    # Reusable components
│   │   ├── api.js         # API client
│   │   └── App.jsx        # Main app component
│   ├── package.json
│   └── vite.config.js
├── README.md
├── .env.example
└── .gitignore
```

## Tech Stack

- **Backend**: FastAPI, Pydantic, Motor (MongoDB async driver), mongomock (testing fallback)
- **Frontend**: React 19, Vite, react-router-dom
- **Testing**: pytest + pytest-asyncio (backend), Vitest + React Testing Library (frontend)

## Notes

- This is a single-user, local-only application with no authentication
- If MongoDB is not available, the app automatically falls back to an in-memory database
- All dates are stored as ISO strings for compatibility across the stack
