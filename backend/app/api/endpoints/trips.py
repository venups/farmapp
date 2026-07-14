from fastapi import APIRouter, HTTPException, Body, status
from typing import List
from app.schemas.trip import Trip, TripCreate, TripUpdate, ItineraryItem, BudgetEntry, ChecklistItem
from app.db.mongodb import get_database
from bson import ObjectId

router = APIRouter()

@router.post("/", response_model=Trip, status_code=status.HTTP_201_CREATED)
async def create_trip(trip: TripCreate):
    db = get_database()
    new_trip_data = trip.model_dump()
    import datetime
    new_trip_data["_id"] = ObjectId()
    new_trip_data["created_at"] = datetime.datetime.utcnow()
    new_trip_data["itineraries"] = []
    new_trip_data["budgets"] = []
    new_trip_data["checklists"] = []
    
    await db.trips.insert_one(new_trip_data)
    result = await db.trips.find_one({"_id": new_trip_data["_id"]})
    return Trip(**result)

@router.get("/", response_model=List[Trip])
async def list_trips():
    db = get_database()
    trips = await db.trips.find().to_list(length=100)
    return [Trip(**trip) for trip in trips]

@router.get("/{trip_id}", response_model=Trip)
async def get_trip(trip_id: str):
    db = get_database()
    if not ObjectId.is_valid(trip_id):
        raise HTTPException(status_code=400, detail="Invalid trip ID")
    trip = await db.trips.find_one({"_id": ObjectId(trip_id)})
    if trip:
        return Trip(**trip)
    raise HTTPException(status_code=404, detail="Trip not found")

@router.put("/{trip_id}", response_model=Trip)
async def update_trip(trip_id: str, trip_update: TripUpdate):
    db = get_database()
    if not ObjectId.is_valid(trip_id):
        raise HTTPException(status_code=400, detail="Invalid trip ID")
    
    update_data = {k: v for k, v in trip_update.model_dump().items() if v is not None}
    if len(update_data) >= 1:
        await db.trips.update_one({"_id": ObjectId(trip_id)}, {"$set": update_data})
    
    updated_trip = await db.trips.find_one({"_id": ObjectId(trip_id)})
    if updated_trip:
        return Trip(**updated_trip)
    raise HTTPException(status_code=404, detail="Trip not found")

@router.delete("/{trip_id}")
async def delete_trip(trip_id: str):
    db = get_database()
    if not ObjectId.is_valid(trip_id):
        raise HTTPException(status_code=400, detail="Invalid trip ID")
    result = await db.trips.delete_one({"_id": ObjectId(trip_id)})
    if result.deleted_count == 1:
        return {"message": "Trip deleted successfully"}
    raise HTTPException(status_code=404, detail="Trip not found")

# --- Sub-resources ---

@router.post("/{trip_id}/itineraries", response_model=Trip)
async def add_itinerary(trip_id: str, item: ItineraryItem):
    db = get_database()
    if not ObjectId.is_valid(trip_id):
        raise HTTPException(status_code=400, detail="Invalid trip ID")
    
    item_dict = item.model_dump()
    # Since we use PyObjectId which is a str, we don't need to convert item['id'] if it exists
    # But let's be safe and ensure we don't have 'id' in the dict being pushed to MongoDB, 
    # instead we use '_id'.
    if "id" in item_dict:
        item_dict["_id"] = ObjectId(item_dict.pop("id"))
    elif "_id" in item_dict:
        item_dict["_id"] = ObjectId(item_dict["_id"])
    else:
        item_dict["_id"] = ObjectId()

    result = await db.trips.update_one(
        {"_id": ObjectId(trip_id)}, 
        {"$push": {"itineraries": item_dict}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    updated_trip = await db.trips.find_one({"_id": ObjectId(trip_id)})
    return Trip(**updated_trip)

@router.post("/{trip_id}/budgets", response_model=Trip)
async def add_budget(trip_id: str, item: BudgetEntry):
    db = get_database()
    if not ObjectId.is_valid(trip_id):
        raise HTTPException(status_code=400, detail="Invalid trip ID")
    
    item_dict = item.model_dump()
    if "id" in item_dict:
        item_dict["_id"] = ObjectId(item_dict.pop("id"))
    elif "_id" in item_dict:
        item_dict["_id"] = ObjectId(item_dict["_id"])
    else:
        item_dict["_id"] = ObjectId()

    result = await db.trips.update_one(
        {"_id": ObjectId(trip_id)}, 
        {"$push": {"budgets": item_dict}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    updated_trip = await db.trips.find_one({"_id": ObjectId(trip_id)})
    return Trip(**updated_trip)

@router.post("/{trip_id}/checklists", response_model=Trip)
async def add_checklist(trip_id: str, item: ChecklistItem):
    db = get_database()
    if not ObjectId.is_valid(trip_id):
        raise HTTPException(status_code=400, detail="Invalid trip ID")
    
    item_dict = item.model_dump()
    if "id" in item_dict:
        item_dict["_id"] = ObjectId(item_dict.pop("id"))
    elif "_id" in item_dict:
        item_dict["_id"] = ObjectId(item_dict["_id"])
    else:
        item_dict["_id"] = ObjectId()

    result = await db.trips.update_one(
        {"_id": ObjectId(trip_id)}, 
        {"$push": {"checklists": item_dict}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    updated_trip = await db.trips.find_one({"_id": ObjectId(trip_id)})
    return Trip(**updated_trip)

@router.patch("/{trip_id}/checklists/{item_id}")
async def toggle_checklist(trip_id: str, item_id: str):
    db = get_database()
    if not ObjectId.is_valid(trip_id) or not ObjectId.is_valid(item_id):
        raise HTTPException(status_code=400, detail="Invalid ID")
    
    trip = await db.trips.find_one({"_id": ObjectId(trip_id)})
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    found = False
    for item in trip["checklists"]:
        # Check both 'id' and '_id' because it depends on how it was stored/retrieved
        if str(item.get("id")) == item_id or str(item.get("_id")) == item_id:
            item["is_completed"] = not item.get("is_completed", False)
            found = True
            break
    
    if not found:
        raise HTTPException(status_code=404, detail="Checklist item not found")
    
    await db.trips.replace_one({"_id": ObjectId(trip_id)}, trip)
    updated_trip = await db.trips.find_one({"_id": ObjectId(trip_id)})
    return Trip(**updated_trip)
