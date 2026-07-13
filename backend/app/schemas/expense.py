from pydantic import BaseModel, Field, field_validator
from typing import Optional, List, Dict, Any
from datetime import datetime, date


ALLOWED_CATEGORIES = {"food", "transport", "accommodation", "activities", "shopping", "insurance", "visa", "tips", "other"}


class ExpenseCreate(BaseModel):
    trip_id: str
    title: str = Field(..., min_length=1, max_length=200)
    amount: float = Field(..., gt=0)
    currency: str = "USD"
    category: str
    date: date
    paid_by: Optional[str] = None
    split_between: List[str] = []
    notes: Optional[str] = Field(None, max_length=500)
    receipt_url: Optional[str] = None
    is_paid: bool = True
    payment_method: Optional[str] = None

    @field_validator("title")
    @classmethod
    def validate_title(cls, v: str) -> str:
        return v.strip()

    @field_validator("category")
    @classmethod
    def validate_category(cls, v: str) -> str:
        if v not in ALLOWED_CATEGORIES:
            raise ValueError(f"category must be one of: {', '.join(sorted(ALLOWED_CATEGORIES))}")
        return v


class ExpenseUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    amount: Optional[float] = Field(None, gt=0)
    currency: Optional[str] = None
    category: Optional[str] = None
    date: Optional[date] = None
    paid_by: Optional[str] = None
    split_between: Optional[List[str]] = None
    notes: Optional[str] = Field(None, max_length=500)
    receipt_url: Optional[str] = None
    is_paid: Optional[bool] = None
    payment_method: Optional[str] = None

    @field_validator("category")
    @classmethod
    def validate_category(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and v not in ALLOWED_CATEGORIES:
            raise ValueError(f"category must be one of: {', '.join(sorted(ALLOWED_CATEGORIES))}")
        return v


class ExpenseResponse(BaseModel):
    id: str
    trip_id: str
    title: str
    amount: float
    currency: str
    category: str
    date: date
    paid_by: Optional[str] = None
    split_between: List[str] = []
    notes: Optional[str] = None
    receipt_url: Optional[str] = None
    is_paid: bool
    payment_method: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ExpenseListResponse(BaseModel):
    expenses: List[ExpenseResponse]
    total: int
    page: int
    per_page: int


class ExpenseSummary(BaseModel):
    total_amount: float
    currency: str
    by_category: Dict[str, float] = {}
    by_date: List[Dict[str, Any]] = []
    budget: Optional[float] = None
    remaining_budget: Optional[float] = None
    expense_count: int
