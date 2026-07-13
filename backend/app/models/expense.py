from beanie import Document
from beanie.odm.fields import PydanticObjectId
from pydantic import Field, field_validator
from typing import Optional, List
from datetime import datetime, date
from enum import Enum


class ExpenseCategory(str, Enum):
    FOOD = "food"
    TRANSPORT = "transport"
    ACCOMMODATION = "accommodation"
    ACTIVITIES = "activities"
    SHOPPING = "shopping"
    INSURANCE = "insurance"
    VISA = "visa"
    TIPS = "tips"
    OTHER = "other"


class Expense(Document):
    trip_id: PydanticObjectId
    title: str
    amount: float
    currency: str = "USD"
    category: ExpenseCategory
    date: date
    paid_by: Optional[PydanticObjectId] = None
    split_between: List[PydanticObjectId] = []
    notes: Optional[str] = None
    receipt_url: Optional[str] = None
    is_paid: bool = True
    payment_method: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "expenses"
        indexes = [
            ["trip_id"],
            ["trip_id", "category"],
            ["trip_id", "date"],
        ]

    @field_validator("amount")
    @classmethod
    def validate_amount(cls, v: float) -> float:
        if v <= 0:
            raise ValueError("amount must be > 0")
        return v
