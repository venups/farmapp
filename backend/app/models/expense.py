from datetime import datetime, date, timezone
from typing import Optional, List
from beanie import Document, Indexed
from pydantic import Field, field_validator
from beanie.typedefs import PydanticObjectId

class Expense(Document):
    trip_id: Indexed(PydanticObjectId)
    title: str
    amount: float = Field(..., gt=0)
    currency: str = "USD"
    category: str = "other" # food, transport, accommodation, activities, shopping, insurance, visa, tips, other
    date: date
    paid_by: Optional[PydanticObjectId] = None
    split_between: List[PydanticObjectId] = []
    notes: Optional[str] = None
    receipt_url: Optional[str] = None
    is_paid: bool = True
    payment_method: Optional[str] = None # cash, card, digital
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "expenses"
        indexes = [
            "trip_id",
            [("trip_id", 1), ("category", 1)],
            [("trip_id", 1), ("date", 1)],
        ]

    @field_validator("category")
    @classmethod
    def validate_category(cls, v):
        allowed = {"food", "transport", "accommodation", "activities", "shopping", "insurance", "visa", "tips", "other"}
        if v not in allowed:
            raise ValueError(f"Category must be one of {allowed}")
        return v

    async def save(self, *args, **kwargs):
        self.updated_at = datetime.now(timezone.utc)
        return await super().save(*args, **kwargs)
