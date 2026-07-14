from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from datetime import datetime
import re

class ActivityCreate(BaseModel):
    trip_id: str
    day_number: int = Field(..., ge=1)
    title: str = Field(..., min_length=1, max_length=200)
    category: str
    description: Optional[str] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    location_name: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    address: Optional[str] = None
    estimated_cost: Optional[float] = Field(None, ge=0)
    currency: str = "USD"
    booking_url: Optional[str] = None
    notes: Optional[str] = None
    order_index: int = Field(0, ge=0)
    is_booked: bool = False
    image_url: Optional[str] = None

    @field_validator("category")
    @classmethod
    def validate_category(cls, v):
        allowed = {"food", "attraction", "transport", "accommodation", "shopping", "entertainment", "nature", "culture", "other"}
        if v not in allowed:
            raise ValueError(f"Category must be one of {allowed}")
        return v

    @field_validator("start_time", "end_time")
    @classmethod
    def validate_time(cls, v):
        if v is not None and not re.match(r"^\d{2}:\d{2}$", v):
            raise ValueError("Time must be in HH:MM format")
        return v

class ActivityUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    category: Optional[str] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    location_name: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    address: Optional[str] = None
    estimated_cost: Optional[float] = Field(None, ge=0)
    currency: Optional[str] = None
    booking_url: Optional[str] = None
    notes: Optional[str] = None
    order_index: Optional[int] = Field(None, ge=0)
    is_booked: Optional[bool] = None
    rating: Optional[int] = Field(None, ge=1, le=5)
    image_url: Optional[str] = None

class ActivityResponse(BaseModel):
    id: str
    trip_id: str
    day_number: int
    title: str
    description: Optional[str]
    category: str
    start_time: Optional[str]
    end_time: Optional[str]
    location_name: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]
    address: Optional[str]
    estimated_cost: Optional[float]
    currency: str
    booking_url: Optional[str]
    notes: Optional[str]
    order_index: int
    is_booked: bool
    rating: Optional[int]
    image_url: Optional[str]
    created_at: datetime
    updated_at: datetime

class ActivityListResponse(BaseModel):
    activities: List[ActivityResponse]
    total: int
