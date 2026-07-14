from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import logging

from app.config import settings
from app.database import init_db
from app.middleware.error_handler import tripforge_exception_handler, generic_exception_handler
from app.utils.exceptions import TripForgeException

from app.routes import auth, users, trips, activities, expenses, packing, uploads

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

# Exception Handlers
app.add_exception_handler(TripForgeException, tripforge_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)

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

# Routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(trips.router, prefix="/api/trips", tags=["Trips"])
app.include_router(activities.router, prefix="/api/activities", tags=["Activities"])
app.include_router(expenses.router, prefix="/api/expenses", tags=["Expenses"])
app.include_router(packing.router, prefix="/api/packing", tags=["Packing List"])
app.include_router(uploads.router, prefix="/api/uploads", tags=["Uploads"])

@app.get("/")
async def root():
    return {
        "message": "TripForge API is running", 
        "version": "1.0.0", 
        "docs": "/docs"
    }

@app.get("/api/health")
async def health_check():
    # Simple check: if we can import beanie and it's initialized, consider connected
    # In a real scenario, we might ping the DB.
    return {
        "status": "healthy", 
        "database": "connected/disconnected (check logs)"
    }
