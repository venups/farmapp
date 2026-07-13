from contextlib import asynccontextmanager
from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import logging

from app.config import settings
from app.database import init_db
from app.middleware.error_handler import register_exception_handlers

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
    lifespan=lifespan,
)

# Register exception handlers
register_exception_handlers(app)

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

# Root route
@app.get("/")
async def root():
    return {
        "message": "TripForge API is running",
        "version": "1.0.0",
        "docs": "/docs",
    }


# Health check
@app.get("/api/health")
async def health_check():
    try:
        from app.database import init_db
        from motor.motor_asyncio import AsyncIOMotorClient

        client = AsyncIOMotorClient(settings.mongodb_url)
        await client.admin.command("ping")
        database_status = "connected"
    except Exception:
        database_status = "disconnected"

    return {"status": "healthy", "database": database_status}


# Import and include all routers
from app.routes import auth, users, trips, activities, expenses, packing, uploads

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(trips.router, prefix="/api/trips", tags=["Trips"])
app.include_router(activities.router, prefix="/api/activities", tags=["Activities"])
app.include_router(expenses.router, prefix="/api/expenses", tags=["Expenses"])
app.include_router(packing.router, prefix="/api/packing", tags=["Packing List"])
app.include_router(uploads.router, prefix="/api/uploads", tags=["Uploads"])


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host=settings.backend_host, port=settings.backend_port, reload=True)
