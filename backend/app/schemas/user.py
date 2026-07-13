from pydantic import BaseModel, Field, field_validator, EmailStr
from datetime import datetime
from typing import Optional


class UserRegister(BaseModel):
    email: EmailStr = Field(..., description="User's email address")
    username: str = Field(..., min_length=3, max_length=30, description="Display name (alphanumeric + underscore)")
    password: str = Field(..., min_length=8, description="Password (min 8 characters)")
    full_name: str = Field(..., min_length=1, max_length=100, description="Full name (max 100 characters)")

    @field_validator("username")
    @classmethod
    def validate_username(cls, v: str) -> str:
        if not v.replace("_", "").isalnum():
            raise ValueError("Username must be alphanumeric with underscores only")
        return v.lower()

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one number")
        return v


class UserLogin(BaseModel):
    email: str = Field(..., description="User's email address")
    password: str = Field(..., description="Password")


class UserResponse(BaseModel):
    id: str = Field(..., description="User's unique ID")
    email: str = Field(..., description="User's email address")
    username: str = Field(..., description="Display name")
    full_name: Optional[str] = Field(None, description="Full name")
    avatar_url: Optional[str] = Field(None, description="Avatar image URL")
    bio: Optional[str] = Field(None, description="Short bio (max 500 chars)")
    created_at: datetime = Field(..., description="Account creation timestamp")
    trip_count: int = Field(0, ge=0, description="Number of trips created")


class UserUpdate(BaseModel):
    full_name: Optional[str] = Field(None, min_length=1, max_length=100)
    bio: Optional[str] = Field(None, max_length=500)
    avatar_url: Optional[str] = Field(None)


class TokenResponse(BaseModel):
    access_token: str = Field(..., description="JWT access token")
    token_type: str = Field("bearer", description="Token type")
    user: UserResponse = Field(..., description="User information")


class TokenData(BaseModel):
    sub: str = Field(..., description="Subject (user ID)")
    username: str = Field(..., description="Username")
    exp: datetime = Field(..., description="Token expiry time")
