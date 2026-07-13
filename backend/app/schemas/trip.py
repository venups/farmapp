from pydantic import BaseModel, Field, field_validator
from datetime import datetime, date
from typing import Optional, List
from bson import ObjectId


class TripCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=2000)
    destination: str = Field(..., min_length=1, max_length=200)
    country: Optional[str] = Field(None, max_length=100)
    start_date: date
    end_date: date
    budget: Optional[float] = Field(None, ge=0)
    currency: str = Field("USD", max_length=3)
    tags: List[str] = Field(default_factory=list)
    is_public: bool = False
    notes: Optional[str] = None

    @field_validator("end_date")
    @classmethod
    def validate_end_date(cls, v: date) -> date:
        return v

    @field_validator("end_date")
    @classmethod
    def validate_dates(cls, v: date, info) -> date:
        values = info.data
        start_date = values.get("start_date")
        if start_date and v < start_date:
            raise ValueError("end_date must be after or equal to start_date")
        return v


class TripUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=2000)
    destination: Optional[str] = Field(None, min_length=1, max_length=200)
    country: Optional[str] = Field(None, max_length=100)
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    status: Optional[str] = Field(None, pattern="^(planning|ongoing|completed|cancelled)$")
    budget: Optional[float] = Field(None, ge=0)
    currency: Optional[str] = Field(None, max_length=3)
    tags: Optional[List[str]] = None
    is_public: Optional[bool] = None
    notes: Optional[str] = None
    cover_image_url: Optional[str] = None

    @field_validator("end_date")
    @classmethod
    def validate_end_date(cls, v: Optional[date]) -> Optional[date]:
        return v


class TripResponse(BaseModel):
    id: str = Field(..., description="Trip's unique ID")
    title: str
    description: Optional[str]
    destination: str
    country: Optional[str]
    cover_image_url: Optional[str]
    start_date: date
    end_date: date
    owner_id: str = Field(..., description="User ID who owns the trip")
    collaborator_ids: List[str] = Field(default_factory=list, description="User IDs with edit access")
    status: str = Field(..., pattern="^(planning|ongoing|completed|cancelled)$")
    budget: Optional[float]
    currency: str = "USD"
    tags: List[str] = Field(default_factory=list)
    is_public: bool
    notes: Optional[str]
    duration_days: int = Field(..., description="Number of days in the trip")
    created_at: datetime
    updated_at: datetime


class TripListResponse(BaseModel):
    trips: List[TripResponse]
    total: int = Field(ge=0)
    page: int = Field(1, ge=1)
    per_page: int = Field(default=20, ge=1, le=100)
