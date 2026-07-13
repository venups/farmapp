from beanie import PydanticObjectId
from datetime import datetime
from typing import List, Optional

from app.models.trip import Trip
from app.models.activity import Activity
from app.schemas.activity import ActivityCreate, ActivityUpdate
from app.utils.exceptions import NotFoundException, ForbiddenException


async def _verify_trip_access(trip_id: str, user_id: str) -> Trip:
    """Verify user has access to a trip."""
    trip = await Trip.get(PydanticObjectId(trip_id))
    if not trip:
        raise NotFoundException("Trip not found")
    if trip.owner_id != PydanticObjectId(user_id) and PydanticObjectId(user_id) not in trip.collaborator_ids:
        raise ForbiddenException("You do not have access to this trip")
    return trip


async def create_activity(user_id: str, activity_data: ActivityCreate) -> Activity:
    """Create activity. Verify user has access to the trip."""
    trip = await _verify_trip_access(activity_data.trip_id, user_id)

    existing = await Activity.find(
        Activity.trip_id == PydanticObjectId(activity_data.trip_id),
        Activity.day_number == activity_data.day_number,
    ).to_list()

    max_order = max((a.order_index for a in existing), default=-1)

    activity = Activity(
        id=PydanticObjectId(),
        trip_id=PydanticObjectId(activity_data.trip_id),
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
        order_index=max_order + 1,
        is_booked=activity_data.is_booked,
        rating=activity_data.rating,
        image_url=activity_data.image_url,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    await activity.insert()
    return activity


async def get_trip_activities(
    trip_id: str, user_id: str, day_number: Optional[int] = None
) -> List[Activity]:
    """Get all activities for a trip, optionally filtered by day."""
    await _verify_trip_access(trip_id, user_id)

    query = Activity.find(Activity.trip_id == PydanticObjectId(trip_id))
    if day_number is not None:
        query = query.find(Activity.day_number == day_number)

    query = query.sort([("day_number", 1), ("order_index", 1)])
    return await query.to_list()


async def get_activity(activity_id: str, user_id: str) -> Activity:
    """Get single activity. Verify user has access to parent trip."""
    activity = await Activity.get(PydanticObjectId(activity_id))
    if not activity:
        raise NotFoundException("Activity not found")
    await _verify_trip_access(str(activity.trip_id), user_id)
    return activity


async def update_activity(activity_id: str, user_id: str, data: ActivityUpdate) -> Activity:
    """Update activity fields. Verify trip access."""
    activity = await Activity.get(PydanticObjectId(activity_id))
    if not activity:
        raise NotFoundException("Activity not found")
    await _verify_trip_access(str(activity.trip_id), user_id)

    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(activity, key, value)

    activity.updated_at = datetime.utcnow()
    await activity.save()
    return activity


async def delete_activity(activity_id: str, user_id: str) -> bool:
    """Delete activity. Verify trip access."""
    activity = await Activity.get(PydanticObjectId(activity_id))
    if not activity:
        raise NotFoundException("Activity not found")
    await _verify_trip_access(str(activity.trip_id), user_id)
    await activity.delete()
    return True


async def reorder_activities(
    trip_id: str, user_id: str, day_number: int, activity_ids: List[str]
) -> List[Activity]:
    """Reorder activities within a day."""
    await _verify_trip_access(trip_id, user_id)

    activities = await Activity.find(
        Activity.trip_id == PydanticObjectId(trip_id),
        Activity.day_number == day_number,
    ).to_list()

    activity_map = {str(a.id): a for a in activities}

    for idx, aid in enumerate(activity_ids):
        if aid in activity_map:
            activity_map[aid].order_index = idx
            activity_map[aid].updated_at = datetime.utcnow()
            await activity_map[aid].save()

    return sorted(activity_map.values(), key=lambda a: a.order_index)
