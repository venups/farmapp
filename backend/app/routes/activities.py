from fastapi import APIRouter, Depends, status, Query
from typing import Optional, List
from fastapi import HTTPException

from app.schemas.activity import ActivityCreate, ActivityUpdate, ActivityResponse, ActivityListResponse
from app.services import activity_service
from app.utils.auth_deps import get_current_user
from app.models.user import User
from app.utils.exceptions import TripForgeException

router = APIRouter()

@router.post("/", response_model=ActivityResponse, status_code=status.HTTP_201_CREATED)
async def create_activity(activity_data: ActivityCreate, current_user: User = Depends(get_current_user)):
    try:
        return await activity_service.create_activity(str(current_user.id), activity_data)
    except TripForgeException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)

@router.get("/trip/{trip_id}", response_model=ActivityListResponse)
async def list_activities(trip_id: str, day_number: Optional[int] = None, current_user: User = Depends(get_current_user)):
    try:
        activities = await activity_service.get_trip_activities(trip_id, str(current_user.id), day_number)
        return {
            "activities": activities,
            "total": len(activities)
        }
    except TripForgeException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)

@router.get("/{activity_id}", response_model=ActivityResponse)
async def get_activity(activity_id: str, current_user: User = Depends(get_current_user)):
    try:
        return await activity_service.get_activity(activity_id, str(current_user.id))
    except TripForgeException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)

@router.put("/{activity_id}", response_model=ActivityResponse)
async def update_activity(activity_id: str, data: ActivityUpdate, current_user: User = Depends(get_current_user)):
    try:
        return await activity_service.update_activity(activity_id, str(current_user.id), data)
    except TripForgeException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)

@router.delete("/{activity_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_activity(activity_id: str, current_user: User = Depends(get_current_user)):
    try:
        await activity_service.delete_activity(activity_id, str(current_user.id))
        return None
    except TripForgeException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)

@router.put("/trip/{trip_id}/reorder", response_model=List[ActivityResponse])
async def reorder_activities(trip_id: str, day_number: int, activity_ids: List[str], current_user: User = Depends(get_current_user)):
    try:
        return await activity_service.reorder_activities(trip_id, str(current_user.id), day_number, activity_ids)
    except TripForgeException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)
