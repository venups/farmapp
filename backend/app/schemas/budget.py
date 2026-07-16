from typing import Optional
from pydantic import BaseModel, Field


class BudgetItemBase(BaseModel):
    trip_id: str
    category: str = Field(..., pattern="^(lodging|food|transport|activities|other)$")
    description: str = Field(..., min_length=1)
    planned_amount: float = Field(..., gt=0)
    actual_amount: Optional[float] = None
    currency: str = "USD"


class BudgetItemCreate(BudgetItemBase):
    pass


class BudgetItemUpdate(BaseModel):
    category: Optional[str] = None
    description: Optional[str] = None
    planned_amount: Optional[float] = None
    actual_amount: Optional[float] = None
    currency: Optional[str] = None


class BudgetItemResponse(BudgetItemBase):
    id: str = Field(..., alias="_id")

    class Config:
        populate_by_name = True
