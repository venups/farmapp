"""
Itinerary API routes.
"""
from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from models.schemas import ItineraryDay, ItineraryDayCreate
from repositories.mongo import MongoItineraryDayRepository
from main import db

router = APIRouter()

def get_itinerary_repository():
    """Get itinerary repository with database connection."""
    return MongoItineraryDayRepository(db["itinerary_days"])

@router.post("/", response_model=ItineraryDay, status_code=status.HTTP_201_CREATED)
async def create_itinerary_day(itinerary_day: ItineraryDayCreate, repo: MongoItineraryDayRepository = Depends(get_itinerary_repository)):
    """Create a new itinerary day."""
    try:
        created_day = await repo.create(itinerary_day)
        return created_day
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to create itinerary day: {str(e)}"
        )

@router.get("/", response_model=List[ItineraryDay])
async def get_all_itinerary_days(repo: MongoItineraryDayRepository = Depends(get_itinerary_repository)):
    """Get all itinerary days."""
    try:
        days = await repo.get_all()
        return days
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve itinerary days: {str(e)}"
        )

@router.get("/trip/{trip_id}", response_model=List[ItineraryDay])
async def get_itinerary_days_by_trip(trip_id: str, repo: MongoItineraryDayRepository = Depends(get_itinerary_repository)):
    """Get itinerary days for a specific trip."""
    try:
        days = await repo.get_by_trip_id(trip_id)
        return days
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve itinerary days: {str(e)}"
        )

@router.get("/{day_id}", response_model=ItineraryDay)
async def get_itinerary_day(day_id: str, repo: MongoItineraryDayRepository = Depends(get_itinerary_repository)):
    """Get a specific itinerary day by ID."""
    try:
        day = await repo.get_by_id(day_id)
        if not day:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Itinerary day not found"
            )
        return day
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve itinerary day: {str(e)}"
        )

@router.put("/{day_id}", response_model=ItineraryDay)
async def update_itinerary_day(day_id: str, itinerary_day: ItineraryDayCreate, repo: MongoItineraryDayRepository = Depends(get_itinerary_repository)):
    """Update an existing itinerary day."""
    try:
        updated_day = await repo.update(day_id, itinerary_day)
        if not updated_day:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Itinerary day not found"
            )
        return updated_day
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update itinerary day: {str(e)}"
        )

@router.delete("/{day_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_itinerary_day(day_id: str, repo: MongoItineraryDayRepository = Depends(get_itinerary_repository)):
    """Delete an itinerary day."""
    try:
        success = await repo.delete(day_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Itinerary day not found"
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete itinerary day: {str(e)}"
        )
