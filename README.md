# Travel Planner - FARM Stack Application

A complete travel planning application built with FastAPI, React, and MongoDB (using mongomock fallback).

## Current Status
✅ **Backend**: FastAPI application with full CRUD operations for trips, itinerary days, budget items, and checklist items
✅ **Frontend**: React application with Vite, complete UI components and API integration
✅ **Database**: mongomock fallback implementation with Motor async support
✅ **Testing**: Vitest setup with React Testing Library for frontend tests
🚀 **Ready to run**: Both backend and frontend are functional and can be started together

## Environment Variables
Copy `.env.example` to `.env` and update the values as needed:

```bash
cp .env.example .env
```

## Dependency Installation

### Backend Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### Frontend Dependencies  
```bash
cd frontend
npm install
```

## Running the Application

### Start Backend Server
```bash
cd backend
uvicorn main:app --reload --port 8000
```

### Start Frontend Development Server
```bash
cd frontend
npm run dev
```

The application will be available at:
- Backend API: http://localhost:8000
- Frontend: http://localhost:5173

## Running Tests

### Backend Tests
```bash
cd backend
pytest tests/
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Manual End-to-End Walkthrough

1. **Create a Trip**: Navigate to the trips section and create a new trip with name, destinations, start date, and end date.
2. **Add Checklist Items**: For your trip, add packing items (e.g., "Passport", "Toothbrush") and prep/todo items (e.g., "Book hotel", "Confirm flight").
3. **Verify Persistence**: Refresh the page or restart both servers - your trips and checklist items should persist.
4. **View Dashboard**: Check the dashboard to see trip status, checklist completion percentages, and budget summaries.

## Project Structure
```
backend/
├── main.py          # FastAPI application entry point
├── models/          # Data models and schemas
├── repositories/    # Database repository implementations
├── routes/          # API endpoints
├── services/        # Business logic
├── tests/           # Backend tests
└── requirements.txt # Python dependencies

frontend/
├── src/
│   ├── components/  # React components
│   ├── pages/       # Page components
│   ├── api/         # API client
│   ├── styles/      # CSS modules and design system
│   └── App.jsx      # Main application component
├── vite.config.js   # Vite configuration
└── package.json     # JavaScript dependencies
```

## Documentation Files
- **README.md**: This file - project overview, setup instructions
- **PROGRESS_LOG.md**: Development progress and chronological entries
- **DECISIONS_LOG.md**: Key design decisions and rationale
- **RUN_DATA.md**: Execution metrics and error tracking
