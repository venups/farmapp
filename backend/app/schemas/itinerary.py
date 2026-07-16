from datetime import date
from typing import Optional
from pydantic import BaseModel, Field


class Activity(BaseModel):
    time: Optional[str] = None
    description: str = Field(..., min_length=1)
    order_index: int = 0


class ItineraryDayBase(BaseModel):
    trip_id: str
    date: date
    activities: list[Activity] = Field(default_factory=list)


class ItineraryDayCreate(ItineraryDayBase):
    pass


class ItineraryDayUpdate(BaseModel):
    date: Optional[date] = None
    activities: Optional[list[Activity]] = None


class ItineraryDayResponse(ItineraryDayBase):
    id: str = Field(..., alias="_id")

    class Config:
        populate_by_name = True
