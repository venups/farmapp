from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from datetime import date, datetime


class TripCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=2000)
    destination: str = Field(..., min_length=1, max_length=200)
    country: Optional[str] = Field(None, max_length=100)
    start_date: date
    end_date: date
    budget: Optional[float] = Field(None, ge=0)
    currency: str = "USD"
    tags: List[str] = []
    is_public: bool = False
    notes: Optional[str] = Field(None, max_length=5000)

    @field_validator("title")
    @classmethod
    def validate_title(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 1:
            raise ValueError("Title cannot be empty")
        return v

    @field_validator("destination")
    @classmethod
    def validate_destination(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 1:
            raise ValueError("Destination cannot be empty")
        return v

    @field_validator("end_date")
    @classmethod
    def validate_dates(cls, v: date, info) -> date:
        if info.data and "start_date" in info.data:
            if v < info.data["start_date"]:
                raise ValueError("end_date must be >= start_date")
        return v


class TripUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=2000)
    destination: Optional[str] = Field(None, min_length=1, max_length=200)
    country: Optional[str] = Field(None, max_length=100)
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    status: Optional[str] = None
    budget: Optional[float] = Field(None, ge=0)
    currency: Optional[str] = None
    tags: Optional[List[str]] = None
    is_public: Optional[bool] = None
    notes: Optional[str] = Field(None, max_length=5000)
    cover_image_url: Optional[str] = None

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and v not in ("planning", "ongoing", "completed", "cancelled"):
            raise ValueError("status must be one of: planning, ongoing, completed, cancelled")
        return v

    @field_validator("end_date")
    @classmethod
    def validate_dates(cls, v: Optional[date], info) -> Optional[date]:
        if v is not None and info.data and "start_date" in info.data and info.data["start_date"]:
            if v < info.data["start_date"]:
                raise ValueError("end_date must be >= start_date")
        return v


class TripResponse(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    destination: str
    country: Optional[str] = None
    cover_image_url: Optional[str] = None
    start_date: date
    end_date: date
    owner_id: str
    collaborator_ids: List[str] = []
    status: str
    budget: Optional[float] = None
    currency: str
    tags: List[str] = []
    is_public: bool
    notes: Optional[str] = None
    duration_days: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class TripListResponse(BaseModel):
    trips: List[TripResponse]
    total: int
    page: int
    per_page: int
