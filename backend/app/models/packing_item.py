from datetime import datetime, timezone
from typing import Optional
from beanie import Document, Indexed
from pydantic import Field
from beanie.typedefs import PydanticObjectId

class PackingItem(Document):
    trip_id: Indexed(PydanticObjectId) # Note: PydanticObjectId needs import
    name: str
    category: str = "other" # clothing, toiletries, electronics, documents, medicine, accessories, gear, other
    quantity: int = Field(1, ge=1)
    is_packed: bool = False
    is_essential: bool = False
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "packing_items"
        indexes = [
            "trip_id",
            [("trip_id", 1), ("category", 1)],
        ]

    async def save(self, *args, **kwargs):
        self.updated_at = datetime.now(timezone.utc)
        return await super().save(*args, **kwargs)
