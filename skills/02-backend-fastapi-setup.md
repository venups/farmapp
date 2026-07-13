# Skill 02: Backend FastAPI Setup

> **Goal**: Create the FastAPI application entry point, configuration module, database connection, CORS middleware, and base route structure.

---

## Step 2.1: Create Configuration Module

### File: `backend/app/config.py`

Create a Pydantic Settings class that loads all environment variables:

```python
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # MongoDB
    mongodb_url: str = "mongodb://localhost:27017"
    database_name: str = "tripforge"
    
    # JWT
    jwt_secret_key: str = "tripforge-super-secret-key-change-in-production-2024"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 1440  # 24 hours
    
    # Server
    backend_host: str = "0.0.0.0"
    backend_port: int = 8000
    frontend_url: str = "http://localhost:5173"
    
    # Uploads
    upload_dir: str = "./uploads"
    max_upload_size_mb: int = 10
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()
```

---

## Step 2.2: Create Database Connection Module

### File: `backend/app/database.py`

Set up Motor (async MongoDB driver) and Beanie ODM initialization. The function should:

1. Create a Motor `AsyncIOMotorClient` using `settings.mongodb_url`
2. Get the database using `settings.database_name`
3. Initialize Beanie with all document models (import them from `app.models`)
4. Include proper error handling — if MongoDB is unreachable, log a clear error message but don't crash the app (log a warning, the app should still start for frontend-only dev)

```python
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.config import settings
import logging

logger = logging.getLogger(__name__)

async def init_db():
    """Initialize MongoDB connection and Beanie ODM."""
    try:
        client = AsyncIOMotorClient(settings.mongodb_url)
        db = client[settings.database_name]
        
        # Import all document models here
        from app.models.user import User
        from app.models.trip import Trip
        from app.models.activity import Activity
        from app.models.expense import Expense
        from app.models.packing_item import PackingItem
        
        await init_beanie(
            database=db,
            document_models=[User, Trip, Activity, Expense, PackingItem]
        )
        logger.info(f"Connected to MongoDB: {settings.database_name}")
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
        logger.warning("App will start without database. API calls will fail.")
```

---

## Step 2.3: Create the Main FastAPI Application

### File: `backend/app/main.py`

Create the FastAPI application with:

1. **App metadata**: Title = "TripForge API", description, version = "1.0.0"
2. **Lifespan context manager**: Use FastAPI's lifespan to initialize the database on startup and create the uploads directory
3. **CORS Middleware**: Allow the frontend URL origin, allow credentials, all methods, all headers
4. **Static file serving**: Mount `/uploads` to serve uploaded files
5. **Root route**: `GET /` returns `{"message": "TripForge API is running", "version": "1.0.0", "docs": "/docs"}`
6. **Health check**: `GET /api/health` returns `{"status": "healthy", "database": "connected/disconnected"}`
7. **Include all routers** under the `/api` prefix:
   - `/api/auth` — authentication routes
   - `/api/users` — user management routes
   - `/api/trips` — trip CRUD routes
   - `/api/activities` — activity routes
   - `/api/expenses` — expense routes
   - `/api/packing` — packing list routes
   - `/api/uploads` — file upload routes

Use the lifespan context manager pattern (NOT the deprecated `@app.on_event`):

```python
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import logging

from app.config import settings
from app.database import init_db

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting TripForge API...")
    os.makedirs(settings.upload_dir, exist_ok=True)
    await init_db()
    yield
    # Shutdown
    logger.info("Shutting down TripForge API...")

app = FastAPI(
    title="TripForge API",
    description="A modern trip planning API built with FastAPI and MongoDB",
    version="1.0.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files for uploads
if os.path.exists(settings.upload_dir):
    app.mount("/uploads", StaticFiles(directory=settings.upload_dir), name="uploads")
```

Then import and include all routers. For now, create placeholder router files that you'll fill in during Skills 04 and 05. Each router file should at minimum have:

```python
from fastapi import APIRouter
router = APIRouter()
```

Include them in main.py:
```python
from app.routes import auth, users, trips, activities, expenses, packing, uploads

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(trips.router, prefix="/api/trips", tags=["Trips"])
app.include_router(activities.router, prefix="/api/activities", tags=["Activities"])
app.include_router(expenses.router, prefix="/api/expenses", tags=["Expenses"])
app.include_router(packing.router, prefix="/api/packing", tags=["Packing List"])
app.include_router(uploads.router, prefix="/api/uploads", tags=["Uploads"])
```

Add the root and health check endpoints directly on the app.

---

## Step 2.4: Create Placeholder Router Files

Create these files, each with a basic `APIRouter()`:

- `backend/app/routes/__init__.py` (empty)
- `backend/app/routes/auth.py`
- `backend/app/routes/users.py`
- `backend/app/routes/trips.py`
- `backend/app/routes/activities.py`
- `backend/app/routes/expenses.py`
- `backend/app/routes/packing.py`
- `backend/app/routes/uploads.py`

Each file should contain:
```python
from fastapi import APIRouter

router = APIRouter()

# Routes will be implemented in Skill 04/05
```

---

## Step 2.5: Create Utility Modules

### File: `backend/app/utils/__init__.py` (empty)

### File: `backend/app/utils/helpers.py`

Create helper functions:
- `generate_id()` — generates a short unique ID (use `uuid.uuid4().hex[:12]`)
- `get_current_timestamp()` — returns current UTC datetime
- `sanitize_filename(filename: str) -> str` — removes special characters from filenames, keeps extension
- `validate_image_file(filename: str) -> bool` — checks if file extension is an allowed image type (jpg, jpeg, png, gif, webp)
- `format_file_size(size_bytes: int) -> str` — converts bytes to human-readable format (KB, MB)

### File: `backend/app/utils/exceptions.py`

Create custom exception classes:
- `TripForgeException(Exception)` — base exception with `status_code` and `detail`
- `NotFoundException(TripForgeException)` — 404
- `UnauthorizedException(TripForgeException)` — 401
- `ForbiddenException(TripForgeException)` — 403
- `BadRequestException(TripForgeException)` — 400
- `ConflictException(TripForgeException)` — 409

### File: `backend/app/middleware/__init__.py` (empty)

### File: `backend/app/middleware/error_handler.py`

Create an error handling middleware/exception handler:
- Register exception handlers for `TripForgeException` subclasses
- Register a handler for generic `Exception` that returns 500
- All error responses should follow this JSON format:
```json
{
    "error": true,
    "status_code": 404,
    "detail": "Trip not found",
    "timestamp": "2024-01-01T00:00:00Z"
}
```

Register these exception handlers in `main.py`.

---

## Step 2.6: Verify Backend Starts

Run the backend to verify it starts without errors:

```bash
cd backend && source venv/bin/activate && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The server should start. It's OK if the MongoDB connection fails (MongoDB may not be running), but the app itself should start. Visit `http://localhost:8000` and `http://localhost:8000/docs` to verify.

**Stop the server after verification** (Ctrl+C or kill the process).

---

## Step 2.7: Update Progress

1. Update `_progress/checklist.md` — check off relevant items
2. Update `_progress/progress.md` — fill in Skill 02 row
3. Log decisions: CORS origins chosen, error response format, lifespan vs events

---

## ✅ Completion Criteria for Skill 02

- [ ] `config.py` loads all environment variables via Pydantic Settings
- [ ] `database.py` initializes Motor + Beanie with graceful error handling
- [ ] `main.py` creates FastAPI app with CORS, lifespan, static files, all routers
- [ ] All 7 router placeholder files exist
- [ ] Helper utilities created (`helpers.py`, `exceptions.py`)
- [ ] Error handler middleware created and registered
- [ ] Backend starts without crashing (even without MongoDB)
- [ ] Progress files updated
