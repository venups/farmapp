from pydantic import BaseModel, Field, field_validator
from typing import Optional, List, Dict, Any
from datetime import date, datetime

class ExpenseCreate(BaseModel):
    trip_id: str
    title: str = Field(..., min_length=1, max_length=200)
    amount: float = Field(..., gt=0)
    currency: str = "USD"
    category: str
    date: date
    paid_by: Optional[str] = None
    split_between: List[str] = []
    notes: Optional[str] = None
    receipt_url: Optional[str] = None
    is_paid: bool = True
    payment_method: Optional[str] = None

    @field_validator("category")
    @classmethod
    def validate_category(cls, v):
        allowed = {"food", "transport", "accommodation", "activities", "shopping", "insurance", "visa", "tips", "other"}
        if v not in allowed:
            raise ValueError(f"Category must be one of {allowed}")
        return v

class ExpenseUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    amount: Optional[float] = Field(None, gt=0)
    currency: Optional[str] = None
    category: Optional[str] = None
    date: Optional[date] = None
    paid_by: Optional[str] = None
    split_between: Optional[List[str]] = None
    notes: Optional[str] = None
    receipt_url: Optional[str] = None
    is_paid: Optional[bool] = None
    payment_method: Optional[str] = None

class ExpenseResponse(BaseModel):
    id: str
    trip_id: str
    title: str
    amount: float
    currency: str
    category: str
    date: date
    paid_by: Optional[str]
    split_between: List[str]
    notes: Optional[str]
    receipt_url: Optional[str]
    is_paid: bool
    payment_method: Optional[str]
    created_at: datetime
    updated_at: datetime

class ExpenseListResponse(BaseModel):
    expenses: List[ExpenseResponse]
    total: int

class ExpenseSummary(BaseModel):
    total_amount: float
    currency: str
    by_category: Dict[str, float]
    by_date: List[Dict[str, Any]]
    budget: Optional[float]
    remaining_budget: Optional[float]
    expense_count: int
