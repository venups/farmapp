from fastapi import APIRouter, HTTPException, status
from typing import Annotated

from app.repositories.trip import TripRepository
from app.schemas.trip import TripCreate, TripUpdate, TripResponse


router = APIRouter(prefix="/trips", tags=["Trips"])


@router.post("/", response_model=TripResponse, status_code=status.HTTP_201_CREATED)
async def create_trip(trip: TripCreate):
    return await TripRepository.create(trip)


@router.get("/", response_model=list[TripResponse])
async def list_trips():
    return await TripRepository.get_all()


@router.get("/{trip_id}", response_model=TripResponse)
async def get_trip(trip_id: str):
    trip = await TripRepository.get_by_id(trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    return trip


@router.patch("/{trip_id}", response_model=TripResponse)
async def update_trip(trip_id: str, trip: TripUpdate):
    updated = await TripRepository.update(trip_id, trip)
    if not updated:
        raise HTTPException(status_code=404, detail="Trip not found")
    return updated


@router.delete("/{trip_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_trip(trip_id: str):
    deleted = await TripRepository.delete(trip_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Trip not found")
