from fastapi import APIRouter, Depends, HTTPException, status
from typing import Optional

from app.schemas.activity import ActivityCreate, ActivityUpdate, ActivityResponse, ActivityListResponse
from app.services.activity_service import create_activity, get_trip_activities, get_activity, update_activity, delete_activity, reorder_activities
from app.utils.auth_deps import get_current_user

router = APIRouter()


@router.post("/", response_model=ActivityResponse, status_code=status.HTTP_201_CREATED)
async def create_activity_route(activity_data: ActivityCreate, current_user = Depends(get_current_user)):
    """Create a new activity."""
    try:
        activity = await create_activity(str(current_user.id), activity_data)
        return activity
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/trip/{trip_id}", response_model=ActivityListResponse)
async def list_activities(trip_id: str, day_number: Optional[int] = None, current_user = Depends(get_current_user)):
    """Get all activities for a trip."""
    try:
        activities = await get_trip_activities(trip_id, str(current_user.id), day_number)
        return ActivityListResponse(activities=activities, total=len(activities), page=1, per_page=20)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{activity_id}", response_model=ActivityResponse)
async def get_activity_route(activity_id: str, current_user = Depends(get_current_user)):
    """Get single activity."""
    try:
        activity = await get_activity(activity_id, str(current_user.id))
        return activity
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.put("/{activity_id}", response_model=ActivityResponse)
async def update_activity_route(activity_id: str, data: ActivityUpdate, current_user = Depends(get_current_user)):
    """Update activity."""
    try:
        activity = await update_activity(activity_id, str(current_user.id), data)
        return activity
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=403, detail=str(e))


@router.delete("/{activity_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_activity_route(activity_id: str, current_user = Depends(get_current_user)):
    """Delete activity."""
    try:
        await delete_activity(activity_id, str(current_user.id))
        return None
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=403, detail=str(e))


@router.put("/trip/{trip_id}/reorder")
async def reorder_activities_route(trip_id: str, day_number: int, activity_ids: list[str], current_user = Depends(get_current_user)):
    """Reorder activities within a day."""
    try:
        activities = await reorder_activities(trip_id, str(current_user.id), day_number, activity_ids)
        return {"activities": activities}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=403, detail=str(e))
