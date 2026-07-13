from beanie import Document
from datetime import datetime, time
from typing import Optional


class Activity(Document):
    title: str
    description: Optional[str] = None
    date: datetime
    start_time: time
    end_time: Optional[time] = None
    location: Optional[str] = None
    address: Optional[str] = None
    notes: Optional[str] = None
    cost: Optional[float] = 0.0
    budget_category: Optional[str] = None
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()

    class Settings:
        name = "activities"
