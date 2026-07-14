from datetime import datetime, timezone
from typing import Optional
from beanie import Document, Indexed

class User(Document):
    email: Indexed(str, unique=True)
    username: Indexed(str, unique=True)
    hashed_password: str
    full_name: str
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    created_at: datetime = datetime.now(timezone.utc)
    updated_at: datetime = datetime.now(timezone.utc)
    is_active: bool = True
    trip_count: int = 0

    class Settings:
        name = "users"

    def to_response_dict(self) -> dict:
        data = self.model_dump()
        data.pop("hashed_password", None)
        return data

    async def save(self, *args, **kwargs):
        self.updated_at = datetime.now(timezone.utc)
        return await super().save(*args, **kwargs)
