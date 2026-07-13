from beanie import Document
from beanie.odm.fields import PydanticObjectId
from pydantic import Field
from typing import Optional
from datetime import datetime
from enum import Enum


class PackingCategory(str, Enum):
    CLOTHING = "clothing"
    TOILETRIES = "toiletries"
    ELECTRONICS = "electronics"
    DOCUMENTS = "documents"
    MEDICINE = "medicine"
    ACCESSORIES = "accessories"
    GEAR = "gear"
    OTHER = "other"


class PackingItem(Document):
    trip_id: PydanticObjectId
    name: str
    category: PackingCategory
    quantity: int = 1
    is_packed: bool = False
    is_essential: bool = False
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "packing_items"
        indexes = [
            ["trip_id"],
            ["trip_id", "category"],
        ]
