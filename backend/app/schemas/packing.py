from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime

class PackingItemCreate(BaseModel):
    trip_id: str
    name: str = Field(..., min_length=1, max_length=200)
    category: str = "other"
    quantity: int = Field(1, ge=1)
    is_packed: bool = False
    is_essential: bool = False
    notes: Optional[str] = None

class PackingItemUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    category: Optional[str] = None
    quantity: Optional[int] = Field(None, ge=1)
    is_packed: Optional[bool] = None
    is_essential: Optional[bool] = None
    notes: Optional[str] = None

class PackingItemResponse(BaseModel):
    id: str
    trip_id: str
    name: str
    category: str
    quantity: int
    is_packed: bool
    is_essential: bool
    notes: Optional[str]
    created_at: datetime
    updated_at: datetime

class PackingListResponse(BaseModel):
    items: List[PackingItemResponse]
    total_items: int
    packed_items: int
    progress_percent: float
    by_category: Dict[str, List[PackingItemResponse]]
