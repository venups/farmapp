from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class DayOfWeek(str, Enum):
    MONDAY = "Monday"
    TUESDAY = "Tuesday"
    WEDNESDAY = "Wednesday"
    THURSDAY = "Thursday"
    FRIDAY = "Friday"
    SATURDAY = "Saturday"
    SUNDAY = "Sunday"


class ActivityBase(BaseModel):
    model_config = {"populate_by_name": True}
    title: str
    description: Optional[str] = ""
    time: Optional[str] = ""
    location: Optional[str] = ""
    cost: Optional[float] = 0.0


class ActivityCreate(ActivityBase):
    pass


class Activity(ActivityBase):
    id: str = ""


class ItineraryDayBase(BaseModel):
    model_config = {"populate_by_name": True}
    day_number: int
    date: Optional[str] = ""
    activities: List[Activity] = []


class ItineraryDayCreate(ItineraryDayBase):
    pass


class ItineraryDay(ItineraryDayBase):
    id: str = ""


class BudgetItemBase(BaseModel):
    model_config = {"populate_by_name": True}
    category: str
    amount: float
    description: Optional[str] = ""


class BudgetItemCreate(BudgetItemBase):
    pass


class BudgetItem(BudgetItemBase):
    id: str = ""


class ChecklistItemBase(BaseModel):
    model_config = {"populate_by_name": True}
    text: str
    completed: bool = False
    category: Optional[str] = "general"


class ChecklistItemCreate(ChecklistItemBase):
    pass


class ChecklistItem(ChecklistItemBase):
    id: str = ""


class TripStatus(str, Enum):
    PLANNING = "planning"
    CONFIRMED = "confirmed"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class TripBase(BaseModel):
    model_config = {"populate_by_name": True}
    title: str
    destination: str
    start_date: str
    end_date: str
    description: Optional[str] = ""
    status: TripStatus = TripStatus.PLANNING
    budget: List[BudgetItem] = []
    itinerary: List[ItineraryDay] = []
    checklist: List[ChecklistItem] = []


class TripCreate(TripBase):
    pass


class TripUpdate(BaseModel):
    model_config = {"populate_by_name": True}
    title: Optional[str] = None
    destination: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    description: Optional[str] = None
    status: Optional[TripStatus] = None
    budget: Optional[List[BudgetItemBase]] = None
    itinerary: Optional[List[ItineraryDayBase]] = None
    checklist: Optional[List[ChecklistItemBase]] = None


class Trip(TripBase):
    model_config = {"populate_by_name": True}
    id: str = ""
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


class DashboardTrip(BaseModel):
    id: str
    title: str
    destination: str
    start_date: str
    end_date: str
    status: str
    checklist_total: int = 0
    checklist_completed: int = 0
    budget_total: float = 0.0
