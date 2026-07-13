from bson import ObjectId
from datetime import datetime
from typing import Optional, List

from app.models.activity import Activity
from app.schemas.activity import ActivityCreate, ActivityUpdate


async def create_activity(user_id: str, activity_data: ActivityCreate) -> Activity:
    """Create activity. Verify user has access to the trip."""
    from app.services.trip_service import get_trip
    
    # Get trip to verify access
    await get_trip(activity_data.trip_id, user_id)
    
    # Get max order_index for this day
    last_activity = await Activity.find(
        {"trip_id": activity_data.trip_id, "day_number": activity_data.day_number}
    ).sort("order_index", -1).limit(1).to_list()
    
    order_index = last_activity[0].order_index + 1 if last_activity else 0
    
    activity = Activity(
        trip_id=activity_data.trip_id,
        day_number=activity_data.day_number,
        title=activity_data.title,
        description=activity_data.description,
        category=activity_data.category,
        start_time=activity_data.start_time,
        end_time=activity_data.end_time,
        location_name=activity_data.location_name,
        latitude=activity_data.latitude,
        longitude=activity_data.longitude,
        address=activity_data.address,
        estimated_cost=activity_data.estimated_cost,
        currency=activity_data.currency,
        booking_url=activity_data.booking_url,
        notes=activity_data.notes,
        order_index=order_index,
        is_booked=activity_data.is_booked,
        rating=activity_data.rating,
        image_url=activity_data.image_url,
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )
    
    await activity.insert()
    return activity


async def get_trip_activities(trip_id: str, user_id: str, day_number: Optional[int] = None) -> List[Activity]:
    """Get all activities for a trip, optionally filtered by day."""
    from app.services.trip_service import get_trip
    
    await get_trip(trip_id, user_id)
    
    query = {"trip_id": trip_id}
    if day_number:
        query["day_number"] = day_number
    
    activities = await Activity.find(query).sort(["day_number", "order_index"]).to_list()
    return activities


async def get_activity(activity_id: str, user_id: str) -> Activity:
    """Get single activity. Verify user has access to parent trip."""
    from app.services.trip_service import get_trip
    
    try:
        activity = await Activity.find_one({"_id": ObjectId(activity_id)})
    except Exception:
        raise Exception("Activity not found")
    
    if not activity:
        raise Exception("Activity not found")
    
    # Verify access to parent trip
    await get_trip(activity.trip_id, user_id)
    
    return activity


async def update_activity(activity_id: str, user_id: str, data: ActivityUpdate) -> Activity:
    """Update activity. Verify trip access."""
    from app.services.trip_service import get_trip
    
    activity = await get_activity(activity_id, user_id)
    
    # Get trip to verify access
    await get_trip(activity.trip_id, user_id)
    
    update_data = {}
    for field in ["day_number", "title", "description", "category",
                  "start_time", "end_time", "location_name", "latitude",
                  "longitude", "address", "estimated_cost", "currency",
                  "booking_url", "notes", "order_index", "is_booked",
                  "rating", "image_url"]:
        value = getattr(data, field)
        if value is not None:
            update_data[field] = value
    
    if update_data:
        update_data["updated_at"] = datetime.now()
        await activity.update({"$set": update_data})
    
    return activity


async def delete_activity(activity_id: str, user_id: str) -> bool:
    """Delete activity. Verify trip access."""
    from app.services.trip_service import get_trip
    
    activity = await get_activity(activity_id, user_id)
    
    # Get trip to verify access
    await get_trip(activity.trip_id, user_id)
    
    await activity.delete()
    return True


async def reorder_activities(trip_id: str, user_id: str, day_number: int, activity_ids: List[str]) -> List[Activity]:
    """Reorder activities within a day."""
    from app.services.trip_service import get_trip
    
    await get_trip(trip_id, user_id)
    
    activities = []
    for idx, activity_id in enumerate(activity_ids):
        activity = await Activity.find_one({"_id": ObjectId(activity_id), "trip_id": trip_id, "day_number": day_number})
        if activity:
            await activity.update({"$set": {"order_index": idx, "updated_at": datetime.now()}})
            activity.order_index = idx
            activities.append(activity)
    
    return activities
