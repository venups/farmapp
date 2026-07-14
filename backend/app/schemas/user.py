from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional
from datetime import datetime

class UserRegister(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=30, pattern=r"^\w+$")
    password: str = Field(..., min_length=8)
    full_name: str = Field(..., min_length=1, max_length=100)

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not any(c.islower() for c in v):
            raise ValueError("Password must contain at least one lowercase letter")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one number")
        return v

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    username: str
    full_name: str
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    created_at: datetime
    trip_count: int

class UserUpdate(BaseModel):
    full_name: Optional[str] = Field(None, min_length=1, max_length=100)
    bio: Optional[str] = Field(None, max_length=500)
    avatar_url: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
