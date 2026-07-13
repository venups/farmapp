from beanie import Document
from datetime import datetime
from typing import Optional


class PackingItem(Document):
    item_name: str
    category: str
    quantity: int = 1
    checked: bool = False
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()

    class Settings:
        name = "packing_items"
