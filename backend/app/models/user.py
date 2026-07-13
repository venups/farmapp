from beanie import Document
from datetime import datetime
from typing import Optional


class User(Document):
    email: str
    hashed_password: str
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()

    class Settings:
        name = "users"
