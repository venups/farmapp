from typing import Optional, List
from beanie import PydanticObjectId
from app.models.activity import Activity
from app.models.trip import Trip
from app.schemas.activity import ActivityCreate, ActivityUpdate
from app.utils.exceptions import NotFoundException, ForbiddenException

async def create_activity(user_id: str, activity_data: ActivityCreate) -> Activity:
    """Create activity. Verify user has access to the trip."""
    trip = await Trip.get(PydanticObjectId(activity_data.trip_id))
    if not trip:
        raise NotFoundException("Trip not found")
    
    user_oid = PydanticObjectId(user_id)
    if trip.owner_id != user_oid and user_oid not in trip.collaborator_ids:
        raise ForbiddenException("You do not have access to this trip")
    
    # Auto-set order_index to be last in that day
    last_activity = await Activity.find(
        {"trip_id": trip.id, "day_number": activity_data.day_number}
    ).sort("-order_index").first()
    
    order_index = (last_activity.order_index + 1) if last_activity else 0
    
    activity = Activity(**activity_data.model_dump(), order_index=order_index)
    await activity.insert()
    return activity

async def get_trip_activities(trip_id: str, user_id: str, day_number: Optional[int] = None) -> List[Activity]:
    """Get all activities for a trip, optionally filtered by day."""
    trip = await Trip.get(PydanticObjectId(trip_id))
    if not trip:
        raise NotFoundException("Trip not found")
    
    user_oid = PydanticObjectId(user_id)
    if trip.owner_id != user_oid and user_oid not in trip.collaborator_ids:
        raise ForbiddenException("You do not have access to this trip")
    
    query = Activity.find({"trip_id": trip.id})
    if day_number:
        query = query.find({"day_number": day_number})
    
    return await query.sort({"day_number": 1, "order_index": 1}).to_list()

async def get_activity(activity_id: str, user_id: str) -> Activity:
    """Get single activity. Verify user has access to parent trip."""
    activity = await Activity.get(PydanticObjectId(activity_id))
    if not activity:
        raise NotFoundException("Activity not found")
    
    trip = await Trip.get(activity.trip_id)
    user_oid = PydanticObjectId(user_id)
    if trip.owner_id != user_oid and user_oid not in trip.collaborator_ids:
        raise ForbiddenException("You do not have access to this trip")
    
    return activity

async def update_activity(activity_id: str, user_id: str, data: ActivityUpdate) -> Activity:
    """Update activity fields. Verify trip access."""
    activity = await get_activity(activity_id, user_id)
    update_data = data.model_dump(exclude_unset=True)
    await activity.set(update_data)
    return activity

async def delete_activity(activity_id: str, user_id: str) -> bool:
    """Delete activity. Verify trip access."""
    activity = await get_activity(activity_id, user_id)
    await activity.delete()
    return True

async def reorder_activities(trip_id: str, user_id: str, day_number: int, activity_ids: List[str]) -> List[Activity]:
    """Reorder activities within a day."""
    trip = await Trip.get(PydanticObjectId(trip_id))
    if not trip:
        raise NotFoundException("Trip not found")
    
    user_oid = PydanticObjectId(user_id)
    if trip.owner_id != user_oid and user_oid not in trip.collaborator_ids:
        raise ForbiddenException("You do not have access to this trip")
    
    updated_activities = []
    for index, aid in enumerate(activity_ids):
        activity = await Activity.get(PydanticObjectId(aid))
        if activity:
            activity.order_index = index
            await activity.save()
            updated_activities.append(activity)
            
    return updated_activities
