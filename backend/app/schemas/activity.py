from pydantic import BaseModel, Field, field_validator
from datetime import datetime, date
from typing import Optional, List


class ActivityCreate(BaseModel):
    trip_id: str = Field(..., description="Trip ID to associate activity with")
    day_number: int = Field(..., ge=1, description="Day number (1-indexed)")
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    category: str = Field(..., pattern="^(food|attraction|transport|accommodation|shopping|entertainment|nature|culture|other)$")
    start_time: Optional[str] = Field(None, pattern=r'^([01]?[0-9]|2[0-3]):[0-5][0-9]$')
    end_time: Optional[str] = Field(None, pattern=r'^([01]?[0-9]|2[0-3]):[0-5][0-5]$')
    location_name: Optional[str] = Field(None, max_length=200)
    latitude: Optional[float] = Field(None, ge=-90, le=90)
    longitude: Optional[float] = Field(None, ge=-180, le=180)
    address: Optional[str] = Field(None, max_length=500)
    estimated_cost: Optional[float] = Field(None, ge=0)
    currency: str = "USD"
    booking_url: Optional[str] = None
    notes: Optional[str] = None
    order_index: int = Field(0, ge=0)
    is_booked: bool = False
    rating: Optional[int] = Field(None, ge=1, le=5)
    image_url: Optional[str] = None


class ActivityUpdate(BaseModel):
    trip_id: Optional[str] = None
    day_number: Optional[int] = Field(None, ge=1)
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    category: Optional[str] = Field(None, pattern="^(food|attraction|transport|accommodation|shopping|entertainment|nature|culture|other)$")
    start_time: Optional[str] = Field(None, pattern=r'^([01]?[0-9]|2[0-3]):[0-5][0-9]$')
    end_time: Optional[str] = Field(None, pattern=r'^([01]?[0-9]|2[0-3]):[0-5][0-5]$')
    location_name: Optional[str] = Field(None, max_length=200)
    latitude: Optional[float] = Field(None, ge=-90, le=90)
    longitude: Optional[float] = Field(None, ge=-180, le=180)
    address: Optional[str] = Field(None, max_length=500)
    estimated_cost: Optional[float] = Field(None, ge=0)
    currency: Optional[str] = Field(None, max_length=3)
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
    page: int = 1
    per_page: int = 20
