from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.models import Trip, TripCreate, TripUpdate, DashboardTrip, BudgetItem, BudgetItemCreate, ChecklistItem, ChecklistItemCreate, ItineraryDay, ItineraryDayCreate, Activity, ActivityCreate
from app import crud
from app.config import CORS_ORIGINS
from typing import List

app = FastAPI(title="Travel Planner API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
async def health_check():
    return {"status": "ok"}


@app.get("/api/trips", response_model=List[Trip])
async def list_trips():
    return await crud.get_all_trips()


@app.get("/api/trips/dashboard", response_model=List[DashboardTrip])
async def get_dashboard():
    return await crud.get_dashboard()


@app.get("/api/trips/{trip_id}", response_model=Trip)
async def get_trip(trip_id: str):
    trip = await crud.get_trip_by_id(trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    return trip


@app.post("/api/trips", response_model=Trip)
async def create_trip(trip: TripCreate):
    return await crud.create_trip(trip)


@app.put("/api/trips/{trip_id}", response_model=Trip)
async def update_trip(trip_id: str, trip: TripUpdate):
    result = await crud.update_trip(trip_id, trip)
    if not result:
        raise HTTPException(status_code=404, detail="Trip not found")
    return result


@app.delete("/api/trips/{trip_id}")
async def delete_trip(trip_id: str):
    success = await crud.delete_trip(trip_id)
    if not success:
        raise HTTPException(status_code=404, detail="Trip not found")
    return {"message": "Trip deleted"}


@app.post("/api/trips/{trip_id}/budget", response_model=BudgetItem)
async def add_budget(trip_id: str, item: BudgetItemCreate):
    result = await crud.add_budget_item(trip_id, item)
    if not result:
        raise HTTPException(status_code=404, detail="Trip not found")
    return result


@app.delete("/api/trips/{trip_id}/budget/{item_id}")
async def delete_budget_item(trip_id: str, item_id: str):
    success = await crud.delete_budget_item(trip_id, item_id)
    if not success:
        raise HTTPException(status_code=404, detail="Budget item not found")
    return {"message": "Budget item deleted"}


@app.post("/api/trips/{trip_id}/checklist", response_model=ChecklistItem)
async def add_checklist(trip_id: str, item: ChecklistItemCreate):
    result = await crud.add_checklist_item(trip_id, item)
    if not result:
        raise HTTPException(status_code=404, detail="Trip not found")
    return result


@app.put("/api/trips/{trip_id}/checklist/{item_id}/toggle")
async def toggle_checklist(trip_id: str, item_id: str):
    success = await crud.toggle_checklist_item(trip_id, item_id)
    if not success:
        raise HTTPException(status_code=404, detail="Checklist item not found")
    return {"message": "Checklist item toggled"}


@app.delete("/api/trips/{trip_id}/checklist/{item_id}")
async def delete_checklist_item(trip_id: str, item_id: str):
    success = await crud.delete_checklist_item(trip_id, item_id)
    if not success:
        raise HTTPException(status_code=404, detail="Checklist item not found")
    return {"message": "Checklist item deleted"}


@app.post("/api/trips/{trip_id}/itinerary", response_model=ItineraryDay)
async def add_itinerary_day(trip_id: str, day: ItineraryDayCreate):
    result = await crud.add_itinerary_day(trip_id, day)
    if not result:
        raise HTTPException(status_code=404, detail="Trip not found")
    return result


@app.post("/api/trips/{trip_id}/itinerary/{day_index}/activities")
async def add_activity(trip_id: str, day_index: int, activity: ActivityCreate):
    success = await crud.add_activity(trip_id, day_index, activity)
    if not success:
        raise HTTPException(status_code=404, detail="Trip or day not found")
    return {"message": "Activity added"}
