from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date

class TripBase(BaseModel):
    name: str
    destinations: List[str] = Field(..., min_length=1)
    start_date: date
    end_date: date
    notes: Optional[str] = None

class TripCreate(TripBase):
    pass

class TripUpdate(BaseModel):
    name: Optional[str] = None
    destinations: Optional[List[str]] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    notes: Optional[str] = None

class Trip(TripBase):
    id: str

class ItineraryDayBase(BaseModel):
    date: date
    activities: List[str] = []

class ItineraryDayCreate(ItineraryDayBase):
    pass

class ItineraryDay(ItineraryDayBase):
    id: str
    trip_id: str

class BudgetItemBase(BaseModel):
    category: str # lodging, food, transport, activities, other
    description: str
    planned_amount: float
    actual_amount: Optional[float] = None
    currency: str = "USD"

class BudgetItemCreate(BudgetItemBase):
    pass

class BudgetItem(BudgetItemBase):
    id: str
    trip_id: str

class ChecklistItemBase(BaseModel):
    text: str
    type: str # packing vs prep
    checked: bool = False

class ChecklistItemCreate(ChecklistItemBase):
    pass

class ChecklistItem(ChecklistItemBase):
    id: str
    trip_id: str
