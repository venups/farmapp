from beanie import Document
from beanie.odm.fields import PydanticObjectId
from pydantic import Field, field_validator
from typing import Optional, List
from datetime import datetime, date
from enum import Enum


class TripStatus(str, Enum):
    PLANNING = "planning"
    ONGOING = "ongoing"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class Trip(Document):
    title: str
    description: Optional[str] = None
    destination: str
    country: Optional[str] = None
    cover_image_url: Optional[str] = None
    start_date: date
    end_date: date
    owner_id: PydanticObjectId
    collaborator_ids: List[PydanticObjectId] = []
    status: TripStatus = TripStatus.PLANNING
    budget: Optional[float] = None
    currency: str = "USD"
    tags: List[str] = []
    is_public: bool = False
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "trips"
        indexes = [
            ["owner_id"],
            ["owner_id", "status"],
            ["start_date"],
        ]

    @field_validator("end_date")
    @classmethod
    def validate_dates(cls, v: date, info) -> date:
        if info.data and "start_date" in info.data:
            start = info.data["start_date"]
            if v < start:
                raise ValueError("end_date must be >= start_date")
        return v

    @field_validator("budget")
    @classmethod
    def validate_budget(cls, v: Optional[float]) -> Optional[float]:
        if v is not None and v < 0:
            raise ValueError("budget must be >= 0")
        return v

    @property
    def duration_days(self) -> int:
        return (self.end_date - self.start_date).days + 1

    @property
    def is_upcoming(self) -> bool:
        return self.start_date > date.today()

    @property
    def is_past(self) -> bool:
        return self.end_date < date.today()
