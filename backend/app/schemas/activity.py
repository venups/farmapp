from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from datetime import datetime
import re


TIME_PATTERN = re.compile(r"^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$")
ALLOWED_CATEGORIES = {"food", "attraction", "transport", "accommodation", "shopping", "entertainment", "nature", "culture", "other"}


class ActivityCreate(BaseModel):
    trip_id: str
    day_number: int = Field(..., ge=1)
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    category: str
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    location_name: Optional[str] = Field(None, max_length=200)
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    address: Optional[str] = Field(None, max_length=300)
    estimated_cost: Optional[float] = Field(None, ge=0)
    currency: str = "USD"
    booking_url: Optional[str] = None
    notes: Optional[str] = Field(None, max_length=1000)
    order_index: int = Field(default=0, ge=0)
    is_booked: bool = False
    rating: Optional[int] = Field(None, ge=1, le=5)
    image_url: Optional[str] = None

    @field_validator("title")
    @classmethod
    def validate_title(cls, v: str) -> str:
        return v.strip()

    @field_validator("category")
    @classmethod
    def validate_category(cls, v: str) -> str:
        if v not in ALLOWED_CATEGORIES:
            raise ValueError(f"category must be one of: {', '.join(sorted(ALLOWED_CATEGORIES))}")
        return v

    @field_validator("start_time", "end_time")
    @classmethod
    def validate_time(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and not TIME_PATTERN.match(v):
            raise ValueError("Time must be in HH:MM format")
        return v


class ActivityUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    category: Optional[str] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    location_name: Optional[str] = Field(None, max_length=200)
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    address: Optional[str] = Field(None, max_length=300)
    estimated_cost: Optional[float] = Field(None, ge=0)
    currency: Optional[str] = None
    booking_url: Optional[str] = None
    notes: Optional[str] = Field(None, max_length=1000)
    order_index: Optional[int] = Field(None, ge=0)
    is_booked: Optional[bool] = None
    rating: Optional[int] = Field(None, ge=1, le=5)
    image_url: Optional[str] = None
    day_number: Optional[int] = Field(None, ge=1)

    @field_validator("category")
    @classmethod
    def validate_category(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and v not in ALLOWED_CATEGORIES:
            raise ValueError(f"category must be one of: {', '.join(sorted(ALLOWED_CATEGORIES))}")
        return v

    @field_validator("start_time", "end_time")
    @classmethod
    def validate_time(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and not TIME_PATTERN.match(v):
            raise ValueError("Time must be in HH:MM format")
        return v


class ActivityResponse(BaseModel):
    id: str
    trip_id: str
    day_number: int
    title: str
    description: Optional[str] = None
    category: str
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    location_name: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    address: Optional[str] = None
    estimated_cost: Optional[float] = None
    currency: str
    booking_url: Optional[str] = None
    notes: Optional[str] = None
    order_index: int
    is_booked: bool
    rating: Optional[int] = None
    image_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ActivityListResponse(BaseModel):
    activities: List[ActivityResponse]
    total: int
    page: int
    per_page: int
