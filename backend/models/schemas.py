"""
Data models and Pydantic schemas for Travel Planner.
"""
from datetime import date
from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field, validator


class TripStatus(str, Enum):
    """Trip status derived from dates."""
    UPCOMING = "upcoming"
    ACTIVE = "active"
    COMPLETED = "completed"


class BudgetCategory(str, Enum):
    """Budget item categories."""
    LODGING = "lodging"
    FOOD = "food"
    TRANSPORT = "transport"
    ACTIVITIES = "activities"
    OTHER = "other"


class ChecklistType(str, Enum):
    """Checklist item types."""
    PACKING = "packing"
    PREP = "prep"


class TripBase(BaseModel):
    """Base trip model."""
    name: str = Field(..., min_length=1, max_length=100)
    destinations: List[str] = Field(..., min_items=1)
    start_date: date
    end_date: date
    notes: Optional[str] = None

    @validator("end_date")
    def end_date_after_start(cls, v, values):
        """Validate that end date is after start date."""
        if "start_date" in values and v < values["start_date"]:
            raise ValueError("End date must be after start date")
        return v

    @property
    def status(self) -> TripStatus:
        """Calculate trip status based on current date."""
        today = date.today()
        if today < self.start_date:
            return TripStatus.UPCOMING
        elif today <= self.end_date:
            return TripStatus.ACTIVE
        else:
            return TripStatus.COMPLETED


class TripCreate(TripBase):
    """Trip creation model."""
    pass


class Trip(TripBase):
    """Full trip model with ID."""
    id: str = Field(..., alias="_id")

    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "name": "European Vacation",
                "destinations": ["Paris", "London", "Rome"],
                "start_date": "2024-12-01",
                "end_date": "2024-12-15",
                "notes": "First trip to Europe"
            }
        }


class ItineraryDayBase(BaseModel):
    """Base itinerary day model."""
    trip_id: str = Field(..., alias="tripId")
    date: date
    activities: List[str] = Field(default_factory=list)
    notes: Optional[str] = None

    class Config:
        populate_by_name = True


class ItineraryDayCreate(ItineraryDayBase):
    """Itinerary day creation model."""
    pass


class ItineraryDay(ItineraryDayBase):
    """Full itinerary day model with ID."""
    id: str = Field(..., alias="_id")

    class Config:
        populate_by_name = True


class BudgetItemBase(BaseModel):
    """Base budget item model."""
    trip_id: str = Field(..., alias="tripId")
    category: BudgetCategory
    description: str = Field(..., min_length=1, max_length=200)
    planned_amount: float = Field(..., gt=0)
    actual_amount: Optional[float] = None
    currency: str = "USD"

    class Config:
        populate_by_name = True


class BudgetItemCreate(BudgetItemBase):
    """Budget item creation model."""
    pass


class BudgetItem(BudgetItemBase):
    """Full budget item model with ID."""
    id: str = Field(..., alias="_id")

    class Config:
        populate_by_name = True


class ChecklistItemBase(BaseModel):
    """Base checklist item model."""
    trip_id: str = Field(..., alias="tripId")
    text: str = Field(..., min_length=1, max_length=200)
    type: ChecklistType
    checked: bool = False

    class Config:
        populate_by_name = True


class ChecklistItemCreate(ChecklistItemBase):
    """Checklist item creation model."""
    pass


class ChecklistItem(ChecklistItemBase):
    """Full checklist item model with ID."""
    id: str = Field(..., alias="_id")

    class Config:
        populate_by_name = True
