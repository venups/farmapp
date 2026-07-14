from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from datetime import date, datetime

class TripCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=2000)
    destination: str = Field(..., min_length=1, max_length=200)
    country: Optional[str] = None
    start_date: date
    end_date: date
    budget: Optional[float] = Field(None, ge=0)
    currency: str = "USD"
    tags: List[str] = []
    is_public: bool = False
    notes: Optional[str] = None

    @field_validator("end_date")
    @classmethod
    def validate_dates(cls, v, info):
        if "start_date" in info.data and v < info.data["start_date"]:
            raise ValueError("end_date must be >= start_date")
        return v

class TripUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=2000)
    destination: Optional[str] = Field(None, min_length=1, max_length=200)
    country: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    status: Optional[str] = None
    budget: Optional[float] = Field(None, ge=0)
    currency: Optional[str] = None
    tags: Optional[List[str]] = None
    is_public: Optional[bool] = None
    notes: Optional[str] = None
    cover_image_url: Optional[str] = None

class TripResponse(BaseModel):
    id: str
    title: str
    description: Optional[str]
    destination: str
    country: Optional[str]
    cover_image_url: Optional[str]
    start_date: date
    end_date: date
    owner_id: str
    collaborator_ids: List[str]
    status: str
    budget: Optional[float]
    currency: str
    tags: List[str]
    is_public: bool
    notes: Optional[str]
    duration_days: int
    created_at: datetime
    updated_at: datetime

class TripListResponse(BaseModel):
    trips: List[TripResponse]
    total: int
    page: int
    per_page: int
