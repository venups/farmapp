from fastapi import APIRouter, Depends, status, Query
from typing import Optional, List
from pydantic import BaseModel

from app.models.user import User
from app.schemas.activity import ActivityCreate, ActivityUpdate
from app.services import activity_service
from app.utils.auth_deps import get_current_user

router = APIRouter()


class ReorderRequest(BaseModel):
    day_number: int
    activity_ids: List[str]


def _activity_to_dict(activity) -> dict:
    return {
        "id": str(activity.id),
        "trip_id": str(activity.trip_id),
        "day_number": activity.day_number,
        "title": activity.title,
        "description": activity.description,
        "category": activity.category.value if hasattr(activity.category, "value") else str(activity.category),
        "start_time": activity.start_time,
        "end_time": activity.end_time,
        "location_name": activity.location_name,
        "latitude": activity.latitude,
        "longitude": activity.longitude,
        "address": activity.address,
        "estimated_cost": activity.estimated_cost,
        "currency": activity.currency,
        "booking_url": activity.booking_url,
        "notes": activity.notes,
        "order_index": activity.order_index,
        "is_booked": activity.is_booked,
        "rating": activity.rating,
        "image_url": activity.image_url,
        "created_at": activity.created_at,
        "updated_at": activity.updated_at,
    }


@router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_activity(data: ActivityCreate, current_user: User = Depends(get_current_user)):
    activity = await activity_service.create_activity(str(current_user.id), data)
    return _activity_to_dict(activity)


@router.get("/trip/{trip_id}", response_model=List[dict])
async def list_activities(
    trip_id: str,
    day_number: Optional[int] = Query(None),
    current_user: User = Depends(get_current_user),
):
    activities = await activity_service.get_trip_activities(trip_id, str(current_user.id), day_number)
    return [_activity_to_dict(a) for a in activities]


@router.get("/{activity_id}", response_model=dict)
async def get_activity(activity_id: str, current_user: User = Depends(get_current_user)):
    activity = await activity_service.get_activity(activity_id, str(current_user.id))
    return _activity_to_dict(activity)


@router.put("/{activity_id}", response_model=dict)
async def update_activity(
    activity_id: str, data: ActivityUpdate, current_user: User = Depends(get_current_user)
):
    activity = await activity_service.update_activity(activity_id, str(current_user.id), data)
    return _activity_to_dict(activity)


@router.delete("/{activity_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_activity(activity_id: str, current_user: User = Depends(get_current_user)):
    await activity_service.delete_activity(activity_id, str(current_user.id))
    return None


@router.put("/trip/{trip_id}/reorder", response_model=List[dict])
async def reorder_activities(
    trip_id: str, data: ReorderRequest, current_user: User = Depends(get_current_user)
):
    activities = await activity_service.reorder_activities(
        trip_id, str(current_user.id), data.day_number, data.activity_ids
    )
    return [_activity_to_dict(a) for a in activities]
