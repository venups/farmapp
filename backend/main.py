"""
FastAPI application entry point for Travel Planner.
"""
import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
try:
    from pymongo import AsyncMongoClient
    HAS_ASYNC_PYMONGO = True
except ImportError:
    HAS_ASYNC_PYMONGO = False
    from motor.motor_asyncio import AsyncIOMotorClient as AsyncMongoClient
from pymongo.errors import ConnectionFailure
import mongomock

# Load environment variables
load_dotenv()

app = FastAPI(title="Travel Planner API", version="1.0.0")

# CORS middleware for frontend-backend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection
async def get_mongo_client():
    """Get MongoDB client with fallback to mongomock."""
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/travel_planner")
    use_mongomock = os.getenv("USE_MONGOMOCK", "True").lower() == "true"

    if use_mongomock:
        print("Using mongomock fallback for database")
        # Use sync mongomock and wrap it for async compatibility
        return mongomock.MongoClient(mongo_uri)
    else:
        try:
            mongo_client = AsyncMongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
            # Test the connection
            await mongo_client.admin.command({"ping": 1})
            print("Connected to MongoDB")
            return mongo_client
        except ConnectionFailure:
            print("Could not connect to MongoDB, falling back to mongomock")
            return mongomock.MongoClient(mongo_uri)


# Get database and collections
@app.on_event("startup")
async def startup_db_client():
    """Initialize database connection on startup."""
    global mongo_client, db
    mongo_client = await get_mongo_client()
    db = mongo_client.get_database()
    
    # Import and set up routes after database is ready
    from routes import trips, itinerary, budget, checklist
    app.include_router(trips.router, prefix="/api/trips", tags=["trips"])
    app.include_router(itinerary.router, prefix="/api/itinerary", tags=["itinerary"])
    app.include_router(budget.router, prefix="/api/budget", tags=["budget"])
    app.include_router(checklist.router, prefix="/api/checklist", tags=["checklist"])

# Include API routes (will be set up after database initialization)

@app.get("/")
async def root():
    """Root endpoint for health check."""
    return {"message": "Travel Planner API is running", "status": "healthy"}
