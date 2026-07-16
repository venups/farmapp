"""
Trip API routes.
"""
from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from models.schemas import Trip, TripCreate
from repositories.mongo import MongoTripRepository
from main import db

router = APIRouter()

def get_trip_repository():
    """Get trip repository with database connection."""
    return MongoTripRepository(db["trips"])

@router.post("/", response_model=Trip, status_code=status.HTTP_201_CREATED)
async def create_trip(trip: TripCreate, repo: MongoTripRepository = Depends(get_trip_repository)):
    """Create a new trip."""
    try:
        created_trip = await repo.create(trip)
        return created_trip
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to create trip: {str(e)}"
        )

@router.get("/", response_model=List[Trip])
async def get_all_trips(repo: MongoTripRepository = Depends(get_trip_repository)):
    """Get all trips."""
    try:
        trips = await repo.get_all()
        return trips
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve trips: {str(e)}"
        )

@router.get("/{trip_id}", response_model=Trip)
async def get_trip(trip_id: str, repo: MongoTripRepository = Depends(get_trip_repository)):
    """Get a specific trip by ID."""
    try:
        trip = await repo.get_by_id(trip_id)
        if not trip:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Trip not found"
            )
        return trip
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve trip: {str(e)}"
        )

@router.put("/{trip_id}", response_model=Trip)
async def update_trip(trip_id: str, trip: TripCreate, repo: MongoTripRepository = Depends(get_trip_repository)):
    """Update an existing trip."""
    try:
        updated_trip = await repo.update(trip_id, trip)
        if not updated_trip:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Trip not found"
            )
        return updated_trip
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update trip: {str(e)}"
        )

@router.delete("/{trip_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_trip(trip_id: str, repo: MongoTripRepository = Depends(get_trip_repository)):
    """Delete a trip."""
    try:
        success = await repo.delete(trip_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Trip not found"
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete trip: {str(e)}"
        )
