from fastapi import FastAPI, HTTPException, Depends
from typing import List
from .repository.repository import TravelRepository
from .schemas.schemas import Trip, TripCreate, TripUpdate, ItineraryDay, ItineraryDayCreate, BudgetItem, BudgetItemCreate, ChecklistItem, ChecklistItemCreate

app = FastAPI(title="Travel Planner API")
repo = TravelRepository()

@app.get("/trips", response_model=List[Trip])
def get_trips():
    return repo.get_trips()

@app.post("/trips", response_model=Trip)
def create_trip(trip: TripCreate):
    if trip.end_date < trip.start_date:
        raise HTTPException(status_code=400, detail="End date cannot be before start date")
    return repo.create_trip(trip)

@app.get("/trips/{trip_id}", response_model=Trip)
def get_trip(trip_id: str):
    trip = repo.get_trip(trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    return trip

@app.put("/trips/{trip_id}", response_model=Trip)
def update_trip(trip_id: str, trip: TripUpdate):
    updated = repo.update_trip(trip_id, trip)
    if not updated:
        raise HTTPException(status_code=404, detail="Trip not found")
    return updated

@app.delete("/trips/{trip_id}")
def delete_trip(trip_id: str):
    repo.delete_trip(trip_id)
    return {"message": "Trip deleted"}

@app.post("/trips/{trip_id}/itinerary", response_model=ItineraryDay)
def create_day(trip_id: str, day: ItineraryDayCreate):
    return repo.create_itinerary_day(trip_id, day)

@app.get("/trips/{trip_id}/itinerary", response_model=List[ItineraryDay])
def get_days(trip_id: str):
    return repo.get_itinerary_days(trip_id)

@app.put("/itinerary/{day_id}", response_model=ItineraryDay)
def update_day(day_id: str, day: ItineraryDayCreate):
    updated = repo.update_itinerary_day(day_id, day)
    if not updated:
        raise HTTPException(status_code=404, detail="Day not found")
    return updated

@app.delete("/itinerary/{day_id}")
def delete_day(day_id: str):
    repo.delete_itinerary_day(day_id)
    return {"message": "Day deleted"}

@app.post("/trips/{trip_id}/budget", response_model=BudgetItem)
def create_budget(trip_id: str, item: BudgetItemCreate):
    return repo.create_budget_item(trip_id, item)

@app.get("/trips/{trip_id}/budget", response_model=List[BudgetItem])
def get_budget(trip_id: str):
    return repo.get_budget_items(trip_id)

@app.put("/budget/{item_id}", response_model=BudgetItem)
def update_budget(item_id: str, item: BudgetItemCreate):
    updated = repo.update_budget_item(item_id, item)
    if not updated:
        raise HTTPException(status_code=404, detail="Budget item not found")
    return updated

@app.delete("/budget/{item_id}")
def delete_budget(item_id: str):
    repo.delete_budget_item(item_id)
    return {"message": "Budget item deleted"}

@app.post("/trips/{trip_id}/checklist", response_model=ChecklistItem)
def create_checklist(trip_id: str, item: ChecklistItemCreate):
    return repo.create_checklist_item(trip_id, item)

@app.get("/trips/{trip_id}/checklist", response_model=List[ChecklistItem])
def get_checklist(trip_id: str):
    return repo.get_checklist_items(trip_id)

@app.put("/checklist/{item_id}", response_model=ChecklistItem)
def update_checklist(item_id: str, item: ChecklistItemCreate):
    updated = repo.update_checklist_item(item_id, item)
    if not updated:
        raise HTTPException(status_code=404, detail="Checklist item not found")
    return updated

@app.delete("/checklist/{item_id}")
def delete_checklist(item_id: str):
    repo.delete_checklist_item(item_id)
    return {"message": "Checklist item deleted"}
