from fastapi import APIRouter, Depends, status, HTTPException
from pydantic import BaseModel

from app.models.user import User
from app.schemas.user import UserRegister, UserLogin, TokenResponse, UserResponse
from app.services import auth_service
from app.utils.auth_deps import get_current_user

router = APIRouter()


def _user_to_response(user: User) -> dict:
    return {
        "id": str(user.id),
        "email": user.email,
        "username": user.username,
        "full_name": user.full_name,
        "avatar_url": user.avatar_url,
        "bio": user.bio,
        "created_at": user.created_at,
        "trip_count": user.trip_count,
    }


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(data: UserRegister):
    user, token = await auth_service.register_user(data)
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=_user_to_response(user),
    )


@router.post("/login", response_model=TokenResponse)
async def login(data: UserLogin):
    user, token = await auth_service.login_user(data)
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=_user_to_response(user),
    )


@router.post("/logout")
async def logout(current_user: User = Depends(get_current_user)):
    return {"message": "Logged out successfully"}


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return _user_to_response(current_user)


@router.post("/verify-token")
async def verify_token(current_user: User = Depends(get_current_user)):
    return {"valid": True, "user": _user_to_response(current_user)}
