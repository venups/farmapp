from fastapi import APIRouter, HTTPException, status
from typing import Annotated

from app.repositories.itinerary import ItineraryRepository
from app.schemas.itinerary import ItineraryDayCreate, ItineraryDayUpdate, ItineraryDayResponse


router = APIRouter(prefix="/itineraries", tags=["Itineraries"])


@router.post("/", response_model=ItineraryDayResponse, status_code=status.HTTP_201_CREATED)
async def create_itinerary_day(day: ItineraryDayCreate):
    return await ItineraryRepository.create(day)


@router.get("/trip/{trip_id}", response_model=list[ItineraryDayResponse])
async def list_itinerary_days(trip_id: str):
    return await ItineraryRepository.get_by_trip_id(trip_id)


@router.get("/{day_id}", response_model=ItineraryDayResponse)
async def get_itinerary_day(day_id: str):
    day = await ItineraryRepository.get_by_id(day_id)
    if not day:
        raise HTTPException(status_code=404, detail="Itinerary day not found")
    return day


@router.patch("/{day_id}", response_model=ItineraryDayResponse)
async def update_itinerary_day(day_id: str, day: ItineraryDayUpdate):
    updated = await ItineraryRepository.update(day_id, day)
    if not updated:
        raise HTTPException(status_code=404, detail="Itinerary day not found")
    return updated


@router.delete("/{day_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_itinerary_day(day_id: str):
    deleted = await ItineraryRepository.delete(day_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Itinerary day not found")
