# 🗺️ TripForge

> **Forge Your Perfect Journey** — A modern trip planning web application built with the FARM Stack

## ✨ Features

- **User Authentication** — Register, login, logout with JWT tokens and bcrypt password hashing
- **Trip Management** — Create, edit, delete, and share trips with dates, destinations, and budgets
- **Itinerary Builder** — Day-by-day planning with activities, time slots, and locations
- **Activity Library** — Browse, search, and add activities with categories and cost estimates
- **Expense Tracker** — Track trip expenses by category with charts and budget monitoring
- **Collaborative Planning** — Invite others to view/edit trips
- **Dashboard** — Overview of upcoming, ongoing, and past trips with stats
- **Map Integration** — Display trip locations on interactive Leaflet maps
- **Packing List** — Categorized checklists with progress tracking
- **Photo Gallery** — Upload and organize trip photos with lightbox viewer
- **Dark Mode** — Beautiful dark-themed UI with glassmorphism cards
- **Responsive Design** — Works on desktop, tablet, and mobile

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | FastAPI (Python 3.9+) |
| **Frontend** | React 18 + TypeScript (Vite) |
| **Database** | MongoDB (Motor + Beanie ODM) |
| **Auth** | JWT (python-jose) + bcrypt |
| **Maps** | Leaflet.js + react-leaflet |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Styling** | Vanilla CSS with custom properties |

## 🚀 Quick Start

### Prerequisites

- Python 3.9+
- Node.js 18+
- MongoDB 6+ (local or Atlas)

### Option 1: Docker (Recommended)

```bash
docker-compose up -d
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Option 2: Manual Setup

```bash
# Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

### Option 3: Makefile

```bash
make install    # Install all dependencies
make dev        # Run both servers
make test       # Run all tests
make build      # Build frontend for production
```

## 📁 Project Structure

```
farmapp/
├── backend/
│   ├── app/
│   │   ├── main.py           # FastAPI entry point
│   │   ├── config.py         # Pydantic settings
│   │   ├── database.py       # MongoDB connection
│   │   ├── models/           # Beanie document models
│   │   ├── schemas/          # Pydantic request/response schemas
│   │   ├── routes/           # API route handlers
│   │   ├── services/         # Business logic
│   │   ├── middleware/       # Error handling
│   │   └── utils/            # Security, helpers, auth deps
│   ├── tests/                # Pytest test suite
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.tsx           # Router configuration
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Route page components
│   │   ├── context/          # React context providers
│   │   ├── hooks/            # Custom React hooks
│   │   ├── services/         # API client + service functions
│   │   ├── types/            # TypeScript interfaces
│   │   └── styles/           # CSS design system
│   └── package.json
├── docker-compose.yml
├── Dockerfile.backend
├── Dockerfile.frontend
├── nginx.conf
└── Makefile
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/trips/` | Create trip |
| GET | `/api/trips/` | List trips |
| GET | `/api/trips/{id}` | Get trip |
| PUT | `/api/trips/{id}` | Update trip |
| DELETE | `/api/trips/{id}` | Delete trip |
| POST | `/api/activities/` | Create activity |
| GET | `/api/activities/trip/{id}` | List activities |
| POST | `/api/expenses/` | Create expense |
| GET | `/api/expenses/trip/{id}` | List expenses |
| GET | `/api/expenses/trip/{id}/summary` | Expense summary |
| POST | `/api/packing/` | Create packing item |
| GET | `/api/packing/trip/{id}` | Get packing list |
| PATCH | `/api/packing/{id}/toggle` | Toggle packed |

Full API docs available at `http://localhost:8000/docs` when the server is running.

## 🧪 Testing

```bash
# Backend tests
cd backend && source venv/bin/activate
python -m pytest tests/ -v

# Frontend type checking
cd frontend && npx tsc --noEmit
```

## 📝 Environment Variables

### Backend (`.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| MONGODB_URL | mongodb://localhost:27017 | MongoDB connection string |
| DATABASE_NAME | tripforge | Database name |
| JWT_SECRET_KEY | (change in production) | JWT signing secret |
| JWT_ALGORITHM | HS256 | JWT algorithm |
| ACCESS_TOKEN_EXPIRE_MINUTES | 1440 | Token expiry (24h) |
| BACKEND_HOST | 0.0.0.0 | Server host |
| BACKEND_PORT | 8000 | Server port |
| FRONTEND_URL | http://localhost:5173 | Frontend URL (CORS) |

### Frontend (`.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| VITE_API_BASE_URL | http://localhost:8000/api | Backend API URL |
| VITE_APP_NAME | TripForge | Application name |

## 📄 License

MIT License
