from pydantic import BaseModel, Field, field_validator
from typing import Optional, Dict, List
from datetime import datetime


ALLOWED_CATEGORIES = {"clothing", "toiletries", "electronics", "documents", "medicine", "accessories", "gear", "other"}


class PackingItemCreate(BaseModel):
    trip_id: str
    name: str = Field(..., min_length=1, max_length=100)
    category: str
    quantity: int = Field(default=1, ge=1)
    is_packed: bool = False
    is_essential: bool = False
    notes: Optional[str] = Field(None, max_length=200)

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        return v.strip()

    @field_validator("category")
    @classmethod
    def validate_category(cls, v: str) -> str:
        if v not in ALLOWED_CATEGORIES:
            raise ValueError(f"category must be one of: {', '.join(sorted(ALLOWED_CATEGORIES))}")
        return v


class PackingItemUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    category: Optional[str] = None
    quantity: Optional[int] = Field(None, ge=1)
    is_packed: Optional[bool] = None
    is_essential: Optional[bool] = None
    notes: Optional[str] = Field(None, max_length=200)

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            return v.strip()
        return v

    @field_validator("category")
    @classmethod
    def validate_category(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and v not in ALLOWED_CATEGORIES:
            raise ValueError(f"category must be one of: {', '.join(sorted(ALLOWED_CATEGORIES))}")
        return v


class PackingItemResponse(BaseModel):
    id: str
    trip_id: str
    name: str
    category: str
    quantity: int
    is_packed: bool
    is_essential: bool
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class PackingListResponse(BaseModel):
    items: List[PackingItemResponse]
    total_items: int
    packed_items: int
    progress_percent: float
    by_category: Dict[str, List[PackingItemResponse]] = {}
