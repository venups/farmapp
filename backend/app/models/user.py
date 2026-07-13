from beanie import Document, Indexed
from pydantic import Field
from typing import Optional
from datetime import datetime


class User(Document):
    email: Indexed(str, unique=True)
    username: Indexed(str, unique=True)
    hashed_password: str
    full_name: str
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True
    trip_count: int = 0

    class Settings:
        name = "users"

    def to_response_dict(self) -> dict:
        data = self.model_dump()
        data.pop("hashed_password", None)
        return data
