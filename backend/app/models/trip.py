from beanie import Document, Link
from datetime import datetime
from typing import Optional, List
from app.models.user import User


class Trip(Document):
    title: str
    description: Optional[str] = None
    destination: str
    start_date: datetime
    end_date: datetime
    cover_image_url: Optional[str] = None
    user_id: str
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()

    class Settings:
        name = "trips"
