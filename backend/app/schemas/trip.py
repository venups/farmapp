from datetime import date
from typing import Optional
from pydantic import BaseModel, Field


class TripBase(BaseModel):
    name: str = Field(..., min_length=1)
    destinations: list[str] = Field(default_factory=list)
    start_date: date
    end_date: date
    notes: Optional[str] = None

    def model_post_init(self, __context):
        if self.end_date < self.start_date:
            raise ValueError("End date must be after or equal to start date")


class TripCreate(TripBase):
    pass


class TripUpdate(BaseModel):
    name: Optional[str] = None
    destinations: Optional[list[str]] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    notes: Optional[str] = None


class TripResponse(TripBase):
    id: str = Field(..., alias="_id")

    class Config:
        populate_by_name = True
