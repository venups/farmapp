from pydantic import BaseModel, Field, field_validator
from datetime import datetime, date
from typing import Optional, List, Dict, Any


class ExpenseCreate(BaseModel):
    trip_id: str = Field(..., description="Trip ID to associate expense with")
    title: str = Field(..., min_length=1, max_length=200)
    amount: float = Field(..., gt=0, description="Expense amount (must be > 0)")
    currency: str = "USD"
    category: str = Field(..., pattern="^(food|transport|accommodation|activities|shopping|insurance|visa|tips|other)$")
    date: date
    paid_by: Optional[str] = None
    split_between: List[str] = Field(default_factory=list)
    notes: Optional[str] = None
    receipt_url: Optional[str] = None
    is_paid: bool = True
    payment_method: Optional[str] = Field(None, pattern="^(cash|card|digital)$")


class ExpenseUpdate(BaseModel):
    trip_id: Optional[str] = None
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    amount: Optional[float] = Field(None, gt=0)
    currency: Optional[str] = Field(None, max_length=3)
    category: Optional[str] = Field(None, pattern="^(food|transport|accommodation|activities|shopping|insurance|visa|tips|other)$")
    date: Optional[date] = None
    paid_by: Optional[str] = None
    split_between: Optional[List[str]] = None
    notes: Optional[str] = None
    receipt_url: Optional[str] = None
    is_paid: Optional[bool] = None
    payment_method: Optional[str] = Field(None, pattern="^(cash|card|digital)$")


class ExpenseResponse(BaseModel):
    id: str
    trip_id: str
    title: str
    amount: float
    currency: str = "USD"
    category: str
    date: date
    paid_by: Optional[str]
    split_between: List[str] = Field(default_factory=list)
    notes: Optional[str]
    receipt_url: Optional[str]
    is_paid: bool
    payment_method: Optional[str]
    created_at: datetime
    updated_at: datetime


class ExpenseListResponse(BaseModel):
    expenses: List[ExpenseResponse]
    total: int
    page: int = 1
    per_page: int = 20


class ExpenseSummary(BaseModel):
    total_amount: float
    currency: str = "USD"
    by_category: Dict[str, float] = Field(default_factory=dict)
    by_date: List[Dict[str, Any]] = Field(default_factory=list)
    budget: Optional[float] = None
    remaining_budget: Optional[float] = None
    expense_count: int = 0
