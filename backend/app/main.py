from contextlib import asynccontextmanager
from fastapi import FastAPI

from app.api.trips import router as trips_router
from app.api.itineraries import router as itineraries_router
from app.api.budget import router as budget_router
from app.api.checklist import router as checklist_router
from app.db import Database


@asynccontextmanager
async def lifespan(app: FastAPI):
    await Database.connect()
    yield
    await Database.close()


app = FastAPI(
    title="Travel Planner API",
    description="A simple travel planning application with trips, itineraries, budgets, and checklists.",
    version="0.1.0",
    lifespan=lifespan,
)

app.include_router(trips_router, prefix="/api")
app.include_router(itineraries_router, prefix="/api")
app.include_router(budget_router, prefix="/api")
app.include_router(checklist_router, prefix="/api")


@app.get("/")
async def root():
    return {"message": "Welcome to Travel Planner API"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
