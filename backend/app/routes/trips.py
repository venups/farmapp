from fastapi import APIRouter, Depends, HTTPException, status
from typing import Optional

from app.schemas.trip import TripCreate, TripUpdate, TripResponse, TripListResponse
from app.services.trip_service import create_trip, get_trip, get_user_trips, update_trip, delete_trip, add_collaborator, remove_collaborator
from app.utils.auth_deps import get_current_user

router = APIRouter()


@router.post("/", response_model=TripResponse, status_code=status.HTTP_201_CREATED)
async def create_trip_route(trip_data: TripCreate, current_user = Depends(get_current_user)):
    """Create a new trip."""
    try:
        trip = await create_trip(str(current_user.id), trip_data)
        return trip
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/", response_model=TripListResponse)
async def list_trips(
    status: Optional[str] = None,
    page: int = 1,
    per_page: int = 20,
    sort_by: str = "created_at",
    sort_order: str = "desc",
    current_user = Depends(get_current_user)
):
    """Get all trips for the current user (as owner or collaborator)."""
    try:
        trips, total = await get_user_trips(
            str(current_user.id),
            status=status,
            page=page,
            per_page=per_page,
            sort_by=sort_by,
            sort_order=sort_order
        )
        return TripListResponse(trips=trips, total=total, page=page, per_page=per_page)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{trip_id}", response_model=TripResponse)
async def get_trip_route(trip_id: str, current_user = Depends(get_current_user)):
    """Get trip details."""
    try:
        trip = await get_trip(trip_id, str(current_user.id))
        return trip
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.put("/{trip_id}", response_model=TripResponse)
async def update_trip_route(trip_id: str, trip_data: TripUpdate, current_user = Depends(get_current_user)):
    """Update a trip."""
    try:
        trip = await update_trip(trip_id, str(current_user.id), trip_data)
        return trip
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=403, detail=str(e))


@router.delete("/{trip_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_trip_route(trip_id: str, current_user = Depends(get_current_user)):
    """Delete a trip and all related data."""
    try:
        await delete_trip(trip_id, str(current_user.id))
        return None
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=403, detail=str(e))


@router.post("/{trip_id}/collaborators", response_model=TripResponse)
async def add_collaborator_route(trip_id: str, collaborator_email: str, current_user = Depends(get_current_user)):
    """Add a collaborator to a trip by email."""
    try:
        trip = await add_collaborator(trip_id, str(current_user.id), collaborator_email)
        return trip
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{trip_id}/collaborators/{user_id}", response_model=TripResponse)
async def remove_collaborator_route(trip_id: str, user_id: str, current_user = Depends(get_current_user)):
    """Remove a collaborator from a trip."""
    try:
        trip = await remove_collaborator(trip_id, str(current_user.id), user_id)
        return trip
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=403, detail=str(e))


@router.get("/{trip_id}/overview")
async def get_trip_overview(trip_id: str, current_user = Depends(get_current_user)):
    """Get trip overview with activity count, expense total, and packing progress."""
    try:
        from app.models.activity import Activity
        from app.models.expense import Expense
        from app.models.packing_item import PackingItem
        
        trip = await get_trip(trip_id, str(current_user.id))
        
        activity_count = await Activity.find({"trip_id": trip_id}).count()
        expense_total = await Expense.find({"trip_id": trip_id}, {"amount": 1, "_id": 0}).to_list()
        expense_amount = sum(e["amount"] for e in expense_total)
        
        packing_items = await PackingItem.find({"trip_id": trip_id}).to_list()
        packed_count = sum(1 for item in packing_items if item.is_packed)
        packing_progress = (packed_count / len(packing_items) * 100) if packing_items else 0
        
        return {
            "trip": trip,
            "activity_count": activity_count,
            "expense_total": {"amount": expense_amount, "currency": trip.currency},
            "packing_items_total": len(packing_items),
            "packing_progress_percent": packing_progress,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))
