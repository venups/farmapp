from datetime import date
from typing import Dict, List, Literal, Optional

from pydantic import BaseModel, Field, field_validator, model_validator

TripStatus = Literal["Upcoming", "Active", "Completed"]
BudgetCategory = Literal["lodging", "food", "transport", "activities", "other"]
ChecklistType = Literal["packing", "prep"]


def trip_status(start: date, end: date, today: Optional[date] = None) -> str:
    today = today or date.today()
    if today < start:
        return "Upcoming"
    if today > end:
        return "Completed"
    return "Active"


# ---- Trips ----

class TripBase(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    destinations: List[str] = Field(min_length=1)
    start_date: date
    end_date: date
    notes: Optional[str] = Field(default=None, max_length=2000)

    @field_validator("destinations")
    @classmethod
    def destinations_non_empty(cls, v: List[str]) -> List[str]:
        cleaned = [d.strip() for d in v if d.strip()]
        if not cleaned:
            raise ValueError("at least one destination is required")
        return cleaned

    @model_validator(mode="after")
    def end_not_before_start(self):
        if self.end_date < self.start_date:
            raise ValueError("end_date must be on or after start_date")
        return self


class TripCreate(TripBase):
    pass


class TripOut(TripBase):
    id: str
    status: TripStatus


# ---- Itinerary ----

class Activity(BaseModel):
    order: int = Field(ge=0)
    time: Optional[str] = Field(default=None, pattern=r"^([01]\d|2[0-3]):[0-5]\d$")
    description: str = Field(min_length=1, max_length=300)


class DayActivities(BaseModel):
    activities: List[Activity] = Field(default_factory=list)


class ItineraryDayOut(BaseModel):
    id: str
    trip_id: str
    date: date
    activities: List[Activity]


# ---- Budget ----

class BudgetItemBase(BaseModel):
    category: BudgetCategory
    description: str = Field(min_length=1, max_length=200)
    planned_amount: float = Field(ge=0)
    actual_amount: Optional[float] = Field(default=None, ge=0)
    currency: str = Field(default="USD", min_length=3, max_length=3)


class BudgetItemCreate(BudgetItemBase):
    pass


class BudgetItemOut(BudgetItemBase):
    id: str
    trip_id: str


# ---- Checklist ----

class ChecklistItemBase(BaseModel):
    text: str = Field(min_length=1, max_length=200)
    type: ChecklistType
    checked: bool = False


class ChecklistItemCreate(ChecklistItemBase):
    pass


class ChecklistItemUpdate(BaseModel):
    text: Optional[str] = Field(default=None, min_length=1, max_length=200)
    type: Optional[ChecklistType] = None
    checked: Optional[bool] = None


class ChecklistItemOut(ChecklistItemBase):
    id: str
    trip_id: str


# ---- Dashboard ----

class ChecklistProgress(BaseModel):
    total: int
    done: int
    percent: int


class BudgetTotals(BaseModel):
    planned: float
    actual: float


class DashboardTrip(BaseModel):
    id: str
    name: str
    destinations: List[str]
    start_date: date
    end_date: date
    status: TripStatus
    checklist: ChecklistProgress
    budget: BudgetTotals


class DashboardOut(BaseModel):
    status_counts: Dict[str, int]
    budget_totals: BudgetTotals
    trips: List[DashboardTrip]
