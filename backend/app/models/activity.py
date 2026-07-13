from beanie import Document
from beanie.odm.fields import PydanticObjectId
from pydantic import Field, field_validator
from typing import Optional
from datetime import datetime
import re
from enum import Enum


class ActivityCategory(str, Enum):
    FOOD = "food"
    ATTRACTION = "attraction"
    TRANSPORT = "transport"
    ACCOMMODATION = "accommodation"
    SHOPPING = "shopping"
    ENTERTAINMENT = "entertainment"
    NATURE = "nature"
    CULTURE = "culture"
    OTHER = "other"


TIME_PATTERN = re.compile(r"^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$")


class Activity(Document):
    trip_id: PydanticObjectId
    day_number: int
    title: str
    description: Optional[str] = None
    category: ActivityCategory
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    location_name: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    address: Optional[str] = None
    estimated_cost: Optional[float] = None
    currency: str = "USD"
    booking_url: Optional[str] = None
    notes: Optional[str] = None
    order_index: int = 0
    is_booked: bool = False
    rating: Optional[int] = None
    image_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "activities"
        indexes = [
            ["trip_id"],
            ["trip_id", "day_number"],
            ["trip_id", "day_number", "order_index"],
        ]

    @field_validator("day_number")
    @classmethod
    def validate_day_number(cls, v: int) -> int:
        if v < 1:
            raise ValueError("day_number must be >= 1")
        return v

    @field_validator("rating")
    @classmethod
    def validate_rating(cls, v: Optional[int]) -> Optional[int]:
        if v is not None and (v < 1 or v > 5):
            raise ValueError("rating must be between 1 and 5")
        return v

    @field_validator("start_time", "end_time")
    @classmethod
    def validate_time_format(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and not TIME_PATTERN.match(v):
            raise ValueError("Time must be in HH:MM format")
        return v

    @field_validator("order_index")
    @classmethod
    def validate_order_index(cls, v: int) -> int:
        if v < 0:
            raise ValueError("order_index must be >= 0")
        return v
