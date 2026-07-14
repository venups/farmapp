from fastapi import APIRouter, Depends, status, Query
from typing import Optional, List, Tuple
from fastapi import HTTPException

from app.schemas.trip import TripCreate, TripUpdate, TripResponse, TripListResponse
from app.services import trip_service
from app.utils.auth_deps import get_current_user
from app.models.user import User
from app.utils.exceptions import TripForgeException

router = APIRouter()

@router.post("/", response_model=TripResponse, status_code=status.HTTP_201_CREATED)
async def create_trip(trip_data: TripCreate, current_user: User = Depends(get_current_user)):
    try:
        return await trip_service.create_trip(str(current_user.id), trip_data)
    except TripForgeException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)

@router.get("/", response_model=TripListResponse)
async def list_trips(
    status: Optional[str] = None, 
    page: int = Query(1, ge=1), 
    per_page: int = Query(10, ge=1, le=100), 
    sort_by: str = "created_at", 
    sort_order: str = "desc",
    current_user: User = Depends(get_current_user)
):
    try:
        trips, total = await trip_service.get_user_trips(
            str(current_user.id), status, page, per_page, sort_by, sort_order
        )
        return {
            "trips": trips,
            "total": total,
            "page": page,
            "per_page": per_page
        }
    except TripForgeException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)

@router.get("/{trip_id}", response_model=TripResponse)
async def get_trip(trip_id: str, current_user: User = Depends(get_current_user)):
    try:
        return await trip_service.get_trip(trip_id, str(current_user.id))
    except TripForgeException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)

@router.put("/{trip_id}", response_model=TripResponse)
async def update_trip(trip_id: str, trip_data: TripUpdate, current_user: User = Depends(get_current_user)):
    try:
        return await trip_service.update_trip(trip_id, str(current_user.id), trip_data)
    except TripForgeException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)

@router.delete("/{trip_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_trip(trip_id: str, current_user: User = Depends(get_current_user)):
    try:
        await trip_service.delete_trip(trip_id, str(current_user.id))
        return None
    except TripForgeException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)

@router.post("/{trip_id}/collaborators", response_model=TripResponse)
async def add_collaborator(trip_id: str, email: str, current_user: User = Depends(get_current_user)):
    try:
        return await trip_service.add_collaborator(trip_id, str(current_user.id), email)
    except TripForgeException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)

@router.delete("/{trip_id}/collaborators/{user_id}", response_model=TripResponse)
async def remove_collaborator(trip_id: str, user_id: str, current_user: User = Depends(get_current_user)):
    try:
        return await trip_service.remove_collaborator(trip_id, str(current_user.id), user_id)
    except TripForgeException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)
