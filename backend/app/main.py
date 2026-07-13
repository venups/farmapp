from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
import os
import logging
from datetime import datetime, timezone

from app.config import settings
from app.database import init_db
from app.utils.exceptions import TripForgeException

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting TripForge API...")
    os.makedirs(settings.upload_dir, exist_ok=True)
    await init_db()
    yield
    logger.info("Shutting down TripForge API...")


app = FastAPI(
    title="TripForge API",
    description="A modern trip planning API built with FastAPI and MongoDB",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.frontend_url,
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files for uploads
if os.path.exists(settings.upload_dir):
    app.mount("/uploads", StaticFiles(directory=settings.upload_dir), name="uploads")

# Exception handlers


@app.exception_handler(TripForgeException)
async def tripforge_exception_handler(request: Request, exc: TripForgeException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": True,
            "status_code": exc.status_code,
            "detail": exc.detail,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        },
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": True,
            "status_code": 500,
            "detail": "Internal server error",
            "timestamp": datetime.now(timezone.utc).isoformat(),
        },
    )

# Routes
from app.routes import auth, users, trips, activities, expenses, packing, uploads

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
        "docs": "/docs",
    }


@app.get("/api/health")
async def health_check():
    from app.database import client

    db_status = "disconnected"
    if client:
        try:
            client.admin.command("ping")
            db_status = "connected"
        except Exception:
            db_status = "disconnected"

    return {"status": "healthy", "database": db_status}
