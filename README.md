# Travel Planner

A modern, classic travel planning application built with the FARM stack.

## Prerequisites
- Python 3.11+
- Node.js 22+ LTS
- Docker (for MongoDB)

## Environment Variables
Create a `.env` file in the root directory based on `.env.example`:

```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=travel_planner
VITE_API_URL=http://localhost:8000
```

## Installation & Setup

### Backend
1. Navigate to the backend directory: `cd backend`
2. Create a virtual environment: `python3 -m venv .venv`
3. Activate the environment: `source .venv/bin/activate` (macOS/Linux) or `.venv\Scripts\activate` (Windows)
4. Install dependencies: `pip install fastapi uvicorn pymongo pydantic pytest httpx`

### Frontend
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`

## Running the Application

1. **Start MongoDB**:
   From the root directory: `docker compose up -d`

2. **Start Backend**:
   From the `backend` directory (with venv active): `uvicorn app.main:app --reload --port 8000`

3. **Start Frontend**:
   From the `frontend` directory: `npm run dev` (runs on port 5173)

## Running Tests

### Backend
From the `backend` directory (with venv active):
`PYTHONPATH=. pytest`

### Frontend
From the `frontend` directory:
`npm run test` (or `npx vitest run`)

## Manual End-to-End Walkthrough
1. Start both servers and MongoDB.
2. Open `http://localhost:5173` in your browser.
3. Click "Plan New Trip".
4. Fill out the form (e.g., Name: "Japan 2026", Destinations: "Tokyo, Kyoto", Dates: 2026-10-01 to 2026-10-15) and click "Create Trip".
4. You should be redirected to the Dashboard, where your new trip appears as a boarding pass card.
5. Click the trip card to view details.
6. Refresh the page; the trip and its details should persist.
