from datetime import datetime, date, timezone
from typing import Optional, List
from beanie import Document, Indexed
from pydantic import Field, field_validator
from beanie.typedefs import PydanticObjectId

class Trip(Document):
    title: str = Field(..., max_length=200)
    description: Optional[str] = Field(None, max_length=2000)
    destination: str = Field(...)
    country: Optional[str] = None
    cover_image_url: Optional[str] = None
    start_date: date
    end_date: date
    owner_id: Indexed(PydanticObjectId)
    collaborator_ids: List[PydanticObjectId] = []
    status: str = "planning" # planning, ongoing, completed, cancelled
    budget: Optional[float] = None
    currency: str = "USD"
    tags: List[str] = []
    is_public: bool = False
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "trips"
        indexes = [
            "owner_id",
            [("owner_id", 1), ("status", 1)],
            "start_date",
        ]

    @field_validator("end_date")
    @classmethod
    def validate_dates(cls, v, info):
        if "start_date" in info.data and v < info.data["start_date"]:
            raise ValueError("end_date must be >= start_date")
        return v

    @field_validator("status")
    @classmethod
    def validate_status(cls, v):
        allowed = {"planning", "ongoing", "completed", "cancelled"}
        if v not in allowed:
            raise ValueError(f"Status must be one of {allowed}")
        return v

    @field_validator("budget")
    @classmethod
    def validate_budget(cls, v):
        if v is not None and v < 0:
            raise ValueError("Budget must be >= 0")
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

    async def save(self, *args, **kwargs):
        self.updated_at = datetime.now(timezone.utc)
        return await super().save(*args, **kwargs)
