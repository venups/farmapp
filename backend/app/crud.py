from app.database import get_db
from app.models import Trip, TripCreate, TripUpdate, DashboardTrip, BudgetItem, BudgetItemCreate, ChecklistItem, ChecklistItemCreate, ItineraryDay, ItineraryDayCreate, Activity, ActivityCreate
from datetime import datetime
from typing import List, Optional
from bson import ObjectId
import uuid


def _to_object_id(trip_id: str):
    try:
        return ObjectId(trip_id)
    except Exception:
        return trip_id


def _serialize_doc(doc):
    """Convert all ObjectId fields to strings and rename _id to id for JSON serialization."""
    if isinstance(doc, dict):
        result = {}
        for k, v in doc.items():
            new_key = "id" if k == "_id" else k
            if isinstance(v, ObjectId):
                result[new_key] = str(v)
            elif isinstance(v, list):
                result[new_key] = [_serialize_doc(item) for item in v]
            elif isinstance(v, dict):
                result[new_key] = _serialize_doc(v)
            else:
                result[new_key] = v
        return result
    return doc


async def create_trip(trip_data: TripCreate) -> Trip:
    now = datetime.utcnow().isoformat()
    doc = trip_data.model_dump()
    doc["created_at"] = now
    doc["updated_at"] = now
    result = await get_db().trips.insert_one(doc)
    doc["id"] = str(result.inserted_id)
    return Trip(**doc)


async def get_all_trips() -> List[Trip]:
    trips = await get_db().trips.find().to_list(None)
    return [Trip(**_serialize_doc(t)) for t in trips]


async def get_trip_by_id(trip_id: str) -> Optional[Trip]:
    trip = await get_db().trips.find_one({"_id": _to_object_id(trip_id)})
    if trip:
        return Trip(**_serialize_doc(trip))
    return None


async def update_trip(trip_id: str, trip_data: TripUpdate) -> Optional[Trip]:
    update_doc = trip_data.model_dump(exclude_unset=True)
    update_doc["updated_at"] = datetime.utcnow().isoformat()
    result = await get_db().trips.find_one_and_update(
        {"_id": _to_object_id(trip_id)},
        {"$set": update_doc},
        return_document=True
    )
    if result:
        return Trip(**_serialize_doc(result))
    return None


async def delete_trip(trip_id: str) -> bool:
    result = await get_db().trips.delete_one({"_id": _to_object_id(trip_id)})
    return result.deleted_count > 0


async def add_budget_item(trip_id: str, item: BudgetItemCreate) -> Optional[BudgetItem]:
    doc = item.model_dump()
    doc["_id"] = str(uuid.uuid4())
    result = await get_db().trips.update_one(
        {"_id": _to_object_id(trip_id)},
        {"$push": {"budget": doc}}
    )
    if result.modified_count > 0:
        doc["id"] = doc["_id"]
        return BudgetItem(**doc)
    return None


async def update_budget_item(trip_id: str, item_id: str, item: BudgetItemCreate) -> bool:
    result = await get_db().trips.update_one(
        {"_id": _to_object_id(trip_id), "budget._id": item_id},
        {"$set": {f"budget.$": item.model_dump()}}
    )
    return result.modified_count > 0


async def delete_budget_item(trip_id: str, item_id: str) -> bool:
    result = await get_db().trips.update_one(
        {"_id": _to_object_id(trip_id)},
        {"$pull": {"budget": {"_id": item_id}}}
    )
    return result.modified_count > 0


async def add_checklist_item(trip_id: str, item: ChecklistItemCreate) -> Optional[ChecklistItem]:
    doc = item.model_dump()
    doc["_id"] = str(uuid.uuid4())
    result = await get_db().trips.update_one(
        {"_id": _to_object_id(trip_id)},
        {"$push": {"checklist": doc}}
    )
    if result.modified_count > 0:
        doc["id"] = doc["_id"]
        return ChecklistItem(**doc)
    return None


async def toggle_checklist_item(trip_id: str, item_id: str) -> bool:
    trip = await get_db().trips.find_one({"_id": _to_object_id(trip_id)})
    if not trip:
        return False
    for item in trip.get("checklist", []):
        if str(item.get("_id", "")) == item_id:
            new_val = not item.get("completed", False)
            result = await get_db().trips.update_one(
                {"_id": _to_object_id(trip_id), "checklist._id": item_id},
                {"$set": {"checklist.$.completed": new_val}}
            )
            return result.modified_count > 0
    return False


async def delete_checklist_item(trip_id: str, item_id: str) -> bool:
    result = await get_db().trips.update_one(
        {"_id": _to_object_id(trip_id)},
        {"$pull": {"checklist": {"_id": item_id}}}
    )
    return result.modified_count > 0


async def add_itinerary_day(trip_id: str, day: ItineraryDayCreate) -> Optional[ItineraryDay]:
    doc = day.model_dump()
    doc["_id"] = str(uuid.uuid4())
    result = await get_db().trips.update_one(
        {"_id": _to_object_id(trip_id)},
        {"$push": {"itinerary": doc}}
    )
    if result.modified_count > 0:
        doc["id"] = doc["_id"]
        return ItineraryDay(**doc)
    return None


async def add_activity(trip_id: str, day_index: int, activity: ActivityCreate) -> bool:
    doc = activity.model_dump()
    result = await get_db().trips.update_one(
        {"_id": _to_object_id(trip_id)},
        {"$push": {f"itinerary.{day_index}.activities": doc}}
    )
    return result.modified_count > 0


async def get_dashboard() -> List[DashboardTrip]:
    trips = await get_db().trips.find().to_list(None)
    dashboard = []
    for t in trips:
        checklist = t.get("checklist", [])
        budget = t.get("budget", [])
        dashboard.append(DashboardTrip(
            id=str(t["_id"]),
            title=t.get("title", ""),
            destination=t.get("destination", ""),
            start_date=t.get("start_date", ""),
            end_date=t.get("end_date", ""),
            status=t.get("status", "planning"),
            checklist_total=len(checklist),
            checklist_completed=sum(1 for i in checklist if i.get("completed", False)),
            budget_total=sum(i.get("amount", 0) for i in budget)
        ))
    return dashboard
