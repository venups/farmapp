# 🗺️ TripForge

> **Forge Your Perfect Journey** — A modern, full-featured trip planning web application built with the FARM Stack

[![Built with FastAPI](https://img.shields.io/badge/Backend-FastAPI-6366F1?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python 3.11+](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python)](https://www.python.org/)
[![React 19+](https://img.shields.io/badge/Frontend-React%2019+-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript 6+](https://img.shields.io/badge/TypeScript-6+-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB 7+](https://img.shields.io/badge/Database-MongoDB-7+-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Container-Docker-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)

---

## ✨ Features

### 🗓️ Trip Management
- Create, edit, and delete trips with comprehensive details
- Track trip status (planned, in-progress, completed)
- Filter and search trips by name, destination, or date range
- Beautiful trip cards with visual status indicators

### 📋 Itinerary Builder
- Day-by-day activity planning for each trip
- Drag-and-drop reordering with `@hello-pangea/dnd`
- Add activities with title, description, time, and location
- View day-by-day breakdown of your trip schedule

### 💰 Expense Tracker
- Track trip expenses with category-based organization
- Visual expense charts using Recharts
- Budget planning and progress tracking
- Detailed expense breakdown with percentage visualization

### 🗺️ Interactive Maps
- Visualize trip locations with Leaflet maps
- Pin multiple destinations on a single map
- Interactive markers for each location
- Full-screen map mode

### 🎒 Packing Lists
- Create categorized packing checklists per trip
- Categories: Clothing, Electronics, Toiletries, Documents, etc.
- Mark items as packed with visual feedback
- Reusable packing list templates

### 📸 Photo Gallery
- Upload and organize trip photos (max 10MB per image)
- Upload destination images for trips
- Lightbox-style photo viewer with navigation
- Responsive image grid layout

### 👥 Collabortation Features
- User registration and authentication with JWT tokens
- Profile pages with avatar uploads
- Password hashing for security
- Protected routes and authentication middleware

### 🌙 Dark Mode UI
- Beautiful dark-themed interface with glassmorphism effects
- Responsive design for all screen sizes
- Smooth transitions and animations
- Custom CSS variables for easy theming

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | FastAPI (Python 3.11) with async support |
| **Frontend** | React 19 + TypeScript 6 (Vite) |
| **Database** | MongoDB 7 with Motor & Beanie |
| **Authentication** | JWT tokens + bcrypt password hashing |
| **Maps** | Leaflet.js with react-leaflet |
| **Charts** | Recharts for expense visualization |
| **Styling** | Custom CSS with Tailwind utilities |
| **Testing** | pytest (backend) + TypeScript strict mode (frontend) |
| **Containerization** | Docker + docker-compose |

---

## 🚀 Quick Start

### Prerequisites
- ✅ Python 3.11 or higher
- ✅ Node.js 20+ and npm
- ✅ Docker & Docker Compose (optional but recommended)
- ✅ MongoDB 7+ (or use MongoDB Atlas)

### Option 1: Docker Deployment (Recommended ⭐)
```bash
# Clone the repository
git clone https://github.com/yourusername/tripforge.git
cd tripforge

# Start all services with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f
```

**Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs
- MongoDB: localhost:27017

**Stop the application:**
```bash
docker-compose down
```

### Option 2: Manual Setup (Development)
```bash
# Clone the repository
git clone https://github.com/yourusername/tripforge.git
cd tripforge

# Install backend dependencies
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Install frontend dependencies
cd ../frontend
npm install

# Create environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Start backend server
cd ../backend
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Start frontend development server (in a new terminal)
cd ../frontend
npm run dev
```

**Access the application:**
- Frontend: http://localhost:5173 (default Vite port)
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### Quick Makefile Commands
```bash
# Install all dependencies
make install

# Run in development mode (backend + frontend)
make dev

# Build frontend for production
make build

# Run tests
make test

# Docker operations
make docker-up        # Start containers
make docker-down      # Stop containers
make docker-build     # Build Docker images
```

---

## 📁 Project Structure

```
farmapp/
├── backend/                          # FastAPI Backend
│   ├── app/
│   │   ├── config.py                # Application settings and environment variables
│   │   ├── database.py              # MongoDB connection and initialization
│   │   ├── main.py                  # FastAPI application entry point
│   │   ├── models/                  # MongoDB data models (User, Trip, Activity, etc.)
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── trip.py
│   │   │   ├── activity.py
│   │   │   ├── expense.py
│   │   │   └── packing_item.py
│   │   ├── routes/                  # API endpoints
│   │   │   ├── __init__.py
│   │   │   ├── auth.py              # Authentication endpoints
│   │   │   ├── users.py             # User management
│   │   │   ├── trips.py             # Trip CRUD operations
│   │   │   ├── activities.py        # Activity management
│   │   │   ├── expenses.py          # Expense tracking
│   │   │   ├── packing.py           # Packing list management
│   │   │   └── uploads.py           # File upload endpoints
│   │   ├── schemas/                 # Pydantic data models
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── trip.py
│   │   │   ├── activity.py
│   │   │   ├── expense.py
│   │   │   └── packing.py
│   │   ├── services/                # Business logic layer
│   │   │   ├── __init__.py
│   │   │   ├── auth_service.py
│   │   │   ├── trip_service.py
│   │   │   ├── activity_service.py
│   │   │   ├── expense_service.py
│   │   │   └── packing_service.py
│   │   ├── utils/                   # Utility functions
│   │   │   ├── __init__.py
│   │   │   ├── auth_deps.py         # Authentication dependencies
│   │   │   ├── security.py          # Password hashing and JWT utilities
│   │   │   └── helpers.py           # Helper functions
│   │   └── middleware/              # Middleware components
│   │       ├── __init__.py
│   │       └── error_handler.py     # Global exception handling
│   ├── tests/                       # Backend test suite
│   │   ├── __init__.py
│   │   ├── conftest.py              # Test fixtures and configuration
│   │   ├── test_auth.py             # Authentication tests
│   │   ├── test_trips.py            # Trip CRUD tests
│   │   ├── test_health.py           # Health check tests
│   │   └── [...]                    # Additional tests
│   ├── uploads/                     # User uploaded files (created automatically)
│   ├── requirements.txt             # Python dependencies
│   └── .env.example                 # Environment variables template
├── frontend/                         # React Frontend
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   │   ├── common/              # Generic components (Button, Card, Modal, etc.)
│   │   │   ├── trips/               # Trip-specific components
│   │   │   ├── itinerary/           # Itinerary and activity components
│   │   │   ├── expenses/            # Expense tracking UI components
│   │   │   ├── packing/             # Packing list components
│   │   │   ├── photos/              # Photo gallery components
│   │   │   ├── maps/                # Map components
│   │   │   └── layout.tsx           # Main layout wrapper
│   │   ├── context/                 # React context providers
│   │   │   ├── AuthContext.tsx      # Authentication state
│   │   │   ├── TripsContext.tsx     # Trip state management
│   │   │   ├── ActivitiesContext.tsx
│   │   │   ├── ExpensesContext.tsx
│   │   │   └── PackingContext.tsx
│   │   ├── pages/                   # Page components
│   │   │   ├── DashboardPage.tsx    # Main dashboard view
│   │   │   ├── TripsPage.tsx        # Trip listing page
│   │   │   ├── TripDetailPage.tsx   # Individual trip view
│   │   │   ├── TripCreatePage.tsx   # Create new trip
│   │   │   ├── ItineraryPage.tsx    # Itinerary planning page
│   │   │   ├── ExpensesPage.tsx     # Expense tracking page
│   │   │   ├── PackingPage.tsx      # Packing list page
│   │   │   ├── ProfilePage.tsx      # User profile page
│   │   │   └── (...)                # Login, Register, NotFound pages
│   │   ├── styles/                  # CSS stylesheets
│   │   │   ├── components/          # Component-specific styles
│   │   │   ├── pages/               # Page-specific styles
│   │   │   ├── index.css            # Main CSS entry
│   │   │   └── animations.css       # Animation utilities
│   │   ├── App.tsx                  # Main app component with routing
│   │   └── main.tsx                 # Entry point
│   ├── public/                      # Static assets
│   │   └── favicon.svg
│   ├── index.html                   # HTML template
│   ├── package.json                 # NPM dependencies
│   └── tsconfig.json                # TypeScript configuration
├── nginx.conf                       # Nginx configuration for frontend
├── Dockerfile.backend               # Backend container definition
├── Dockerfile.frontend              # Frontend container definition
├── docker-compose.yml               # Multi-container Docker configuration
└── Makefile                         # Common command shortcuts

```

---

## 🔌 API Documentation

Once the backend is running, visit the interactive API documentation at:

**http://localhost:8000/docs**

### Available Endpoints

#### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Authenticate and get JWT token |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/auth/me` | Get current user profile |
| POST | `/api/auth/verify-token` | Verify token validity |

#### Trips
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/trips` | List all trips for current user |
| POST | `/api/trips` | Create a new trip |
| GET | `/api/trips/{trip_id}` | Get trip details |
| PUT | `/api/trips/{trip_id}` | Update trip |
| DELETE | `/api/trips/{trip_id}` | Delete trip |

#### Activities
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/activities` | List activities for a trip |
| POST | `/api/activities` | Add activity to trip |
| PUT | `/api/activities/{activity_id}` | Update activity |
| DELETE | `/api/activities/{activity_id}` | Delete activity |
| PUT | `/api/activities/reorder` | Reorder activities by day |

#### Expenses
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/expenses` | List expenses for a trip |
| POST | `/api/expenses` | Add expense to trip |
| PUT | `/api/expenses/{expense_id}` | Update expense |
| DELETE | `/api/expenses/{expense_id}` | Delete expense |

#### Packing List
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/packing` | List packing items for a trip |
| POST | `/api/packing` | Add packing item |
| PUT | `/api/packing/{item_id}` | Update packing item |
| DELETE | `/api/packing/{item_id}` | Deletepacking item |
| PUT | `/api/packing/{item_id}/toggle` | Toggle packed status |

#### Uploads
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/uploads/trip/{trip_id}/destination` | Upload destination image |
| GET | `/uploads/{filename}` | Serve uploaded file |

---

## 📸 Screenshots

### Dashboard
The main dashboard shows trip overview with quick access to key features:
- Total trips count and upcoming trips
- Budget summary with visual progress bars
- Recent activities and expenses
- Quick navigation to key features

### Trip Planner
Create and manage trips with comprehensive details:
- Location, dates, description, and status
- Budget allocation and tracking
- Destination images and descriptions

### Itinerary Builder
Drag-and-drop activity scheduling:
- Day-by-day organization of activities
- Drag items between days to reorder
- Add time, location, and description for each activity
- Visual calendar interface

### Expense Tracker
Visual expense management:
- Category-based spending breakdown
- Interactive charts showing expenses by category
- Budget progress with visual indicators
- Add/edit/delete expense records

### Packing Lists
Never forget essentials:
- Categorized packing lists (Clothing, Electronics, Toiletries, Documents)
- Checkbox interface for items
- Toggle between packed/unpacked view

### Map View
Visual trip location tracking:
- Multiple destination markers on Leaflet maps
- Click markers for details
- Full-screen map mode

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
source venv/bin/activate
python -m pytest tests/ -v

# Run specific test file
python -m pytest tests/test_auth.py -v

# Run with coverage (requires pytest-cov)
python -m pytest tests/ --cov=app --cov-report=html
```

### Frontend Type Checking
```bash
cd frontend
npx tsc --noEmit

# Run build to verify no errors
npm run build
```

### Linting (Frontend)
```bash
cd frontend
npx oxlint src/
```

### Run All Tests
```bash
make test
# or
make test-backend && make test-frontend
```

---

## 🐳 Deployment

### Docker Production Build
```bash
# Build all images
docker-compose build --no-cache

# Start in production mode
docker-compose up -d

# Check service status
docker-compose ps
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URL` | MongoDB connection string | `mongodb://localhost:27017` |
| `DATABASE_NAME` | Database name | `tripforge` |
| `JWT_SECRET_KEY` | Secret key for JWT tokens | (required in production) |
| `JWT_ALGORITHM` | Algorithm for JWT signing | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiration time (minutes) | `1440` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `BACKEND_HOST` | Backend host address | `0.0.0.0` |
| `BACKEND_PORT` | Backend port | `8000` |
| `UPLOAD_DIR` | Directory for uploads | `./uploads` |
| `MAX_UPLOAD_SIZE_MB` | Max file upload size (MB) | `10` |

### Production Deployment Checklist
- [ ] Set strong `JWT_SECRET_KEY` in production
- [ ] Configure HTTPS (use reverse proxy like Nginx or Cloudflare)
- [ ] Set `DEBUG=false` in production
- [ ] Enable proper file storage for uploads (cloud storage recommended)
- [ ] Configure database connection string with credentials
- [ ] Set up proper logging (backend logs to file)
- [ ] Enable rate limiting for API endpoints
- [ ] Configure SSL certificates
- [ ] Set up backup strategy for MongoDB

---

## 📝 Environment Variables Reference

### Backend (.env)
```bash
# MongoDB Configuration
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=tripforge

# JWT Configuration (CRITICAL - change in production!)
JWT_SECRET_KEY=your-super-secret-jwt-key-change-me
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Server Configuration
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
FRONTEND_URL=http://localhost:5173

# Upload Configuration
UPLOAD_DIR=./uploads
MAX_UPLOAD_SIZE_MB=10
```

### Frontend (.env)
```bash
# API Configuration
VITE_API_URL=http://localhost:8000/api
```

---

## 🤝 Contributing

We welcome contributions to TripForge! Here's how you can help:

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- **Backend**: Follow PEP 8 style guidelines, use type hints
- **Frontend**: Follow TypeScript best practices, use ESLint with Oxlint

### Running Tests
```bash
# Run backend tests
make test-backend

# Run frontend type checking
make test-frontend

# Run linter
make lint
```

### Commit Message Format
```
<type>: <description>

[optional body]

Examples:
feat: add trip editing capability
fix: correct expense calculation bug
docs: update README with deployment guide
```

### Types
- `feat`: New feature for users
- `fix`: Bug fix for users
- `docs`: Documentation-only changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code structure changes without behavior change
- `test`: Adding or updating tests
- `chore`: Dependency updates or tooling changes

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 🙏 Acknowledgments

- FastAPI team for the amazing web framework
- React community for the incredible component ecosystem
- MongoDB for their flexible database solution

---

## 📞 Support & Contact

For support, please open an issue in the GitHub repository or contact [your email].

---

**Built with ❤️ using the FARM Stack**
