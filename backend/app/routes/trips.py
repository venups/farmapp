from fastapi import APIRouter, Depends, status, Query
from typing import Optional

from app.models.user import User
from app.schemas.trip import TripCreate, TripUpdate, TripListResponse
from app.services import trip_service
from app.utils.auth_deps import get_current_user

router = APIRouter()


def _trip_to_dict(trip) -> dict:
    return {
        "id": str(trip.id),
        "title": trip.title,
        "description": trip.description,
        "destination": trip.destination,
        "country": trip.country,
        "cover_image_url": trip.cover_image_url,
        "start_date": trip.start_date,
        "end_date": trip.end_date,
        "owner_id": str(trip.owner_id),
        "collaborator_ids": [str(c) for c in trip.collaborator_ids],
        "status": trip.status.value if hasattr(trip.status, "value") else str(trip.status),
        "budget": trip.budget,
        "currency": trip.currency,
        "tags": trip.tags,
        "is_public": trip.is_public,
        "notes": trip.notes,
        "duration_days": trip.duration_days,
        "created_at": trip.created_at,
        "updated_at": trip.updated_at,
    }


@router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_trip(trip_data: TripCreate, current_user: User = Depends(get_current_user)):
    trip = await trip_service.create_trip(str(current_user.id), trip_data)
    return _trip_to_dict(trip)


@router.get("/", response_model=TripListResponse)
async def list_trips(
    status_filter: Optional[str] = Query(None, alias="status"),
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=50),
    sort_by: str = Query("created_at"),
    sort_order: str = Query("desc"),
    current_user: User = Depends(get_current_user),
):
    trips, total = await trip_service.get_user_trips(
        str(current_user.id),
        status=status_filter,
        page=page,
        per_page=per_page,
        sort_by=sort_by,
        sort_order=sort_order,
    )

    trip_list = [_trip_to_dict(t) for t in trips]
    return TripListResponse(trips=trip_list, total=total, page=page, per_page=per_page)


@router.get("/{trip_id}", response_model=dict)
async def get_trip(trip_id: str, current_user: User = Depends(get_current_user)):
    trip = await trip_service.get_trip(trip_id, str(current_user.id))
    return _trip_to_dict(trip)


@router.put("/{trip_id}", response_model=dict)
async def update_trip(
    trip_id: str, trip_data: TripUpdate, current_user: User = Depends(get_current_user)
):
    trip = await trip_service.update_trip(trip_id, str(current_user.id), trip_data)
    return _trip_to_dict(trip)


@router.delete("/{trip_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_trip(trip_id: str, current_user: User = Depends(get_current_user)):
    await trip_service.delete_trip(trip_id, str(current_user.id))
    return None


@router.post("/{trip_id}/collaborators", response_model=dict)
async def add_collaborator(
    trip_id: str,
    collaborator_email: str,
    current_user: User = Depends(get_current_user),
):
    trip = await trip_service.add_collaborator(trip_id, str(current_user.id), collaborator_email)
    return {"collaborator_ids": [str(c) for c in trip.collaborator_ids]}


@router.delete("/{trip_id}/collaborators/{collaborator_id}", response_model=dict)
async def remove_collaborator(
    trip_id: str,
    collaborator_id: str,
    current_user: User = Depends(get_current_user),
):
    trip = await trip_service.remove_collaborator(trip_id, str(current_user.id), collaborator_id)
    return {"collaborator_ids": [str(c) for c in trip.collaborator_ids]}


@router.get("/{trip_id}/overview", response_model=dict)
async def get_trip_overview(trip_id: str, current_user: User = Depends(get_current_user)):
    return await trip_service.get_trip_overview(trip_id, str(current_user.id))
