from fastapi import FastAPI
from app.db.mongodb import connect_to_mongo, close_mongo_connection
from app.api.endpoints import trips

app = FastAPI(title="Travel Planner API")

@app.on_event("startup")
async def startup_db_client():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_mongo_connection()

app.include_router(trips.router, prefix="/api/trips", tags=["trips"])

@app.get("/")
async def root():
    return {"message": "Welcome to the Travel Planner API"}
