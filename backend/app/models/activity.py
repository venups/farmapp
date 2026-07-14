from datetime import datetime, timezone
from typing import Optional
from beanie import Document, Indexed
from pydantic import Field, field_validator
from beanie.typedefs import PydanticObjectId

class Activity(Document):
    trip_id: Indexed(PydanticObjectId)
    day_number: int = Field(..., ge=1)
    title: str = Field(..., max_length=200)
    description: Optional[str] = None
    category: str = "other" # food, attraction, transport, accommodation, shopping, entertainment, nature, culture, other
    start_time: Optional[str] = None # HH:MM
    end_time: Optional[str] = None # HH:MM
    location_name: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    address: Optional[str] = None
    estimated_cost: Optional[float] = None
    currency: str = "USD"
    booking_url: Optional[str] = None
    notes: Optional[str] = None
    order_index: int = Field(0, ge=0)
    is_booked: bool = False
    rating: Optional[int] = Field(None, ge=1, le=5)
    image_url: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "activities"
        indexes = [
            "trip_id",
            [("trip_id", 1), ("day_number", 1)],
            [("trip_id", 1), ("day_number", 1), ("order_index", 1)],
        ]

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
        if v is not None:
            import re
            if not re.match(r"^\d{2}:\d{2}$", v):
                raise ValueError("Time must be in HH:MM format")
        return v

    async def save(self, *args, **kwargs):
        self.updated_at = datetime.now(timezone.utc)
        return await super().save(*args, **kwargs)
