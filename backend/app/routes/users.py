from fastapi import APIRouter, Depends, status, Query
from typing import Optional, List
from pydantic import BaseModel, Field

from app.models.user import User
from app.schemas.user import UserUpdate, UserResponse
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


class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str = Field(..., min_length=8)


class DeleteAccountRequest(BaseModel):
    password: str


@router.get("/profile", response_model=UserResponse)
async def get_profile(current_user: User = Depends(get_current_user)):
    return _user_to_response(current_user)


@router.put("/profile", response_model=UserResponse)
async def update_profile(
    data: UserUpdate, current_user: User = Depends(get_current_user)
):
    user = await auth_service.update_user_profile(str(current_user.id), data)
    return _user_to_response(user)


@router.put("/change-password")
async def change_password(
    data: ChangePasswordRequest, current_user: User = Depends(get_current_user)
):
    await auth_service.change_password(str(current_user.id), data.old_password, data.new_password)
    return {"message": "Password changed successfully"}


@router.delete("/account", status_code=status.HTTP_200_OK)
async def delete_account(
    data: DeleteAccountRequest, current_user: User = Depends(get_current_user)
):
    await auth_service.delete_user_account(str(current_user.id), data.password)
    return {"message": "Account deleted successfully"}


@router.get("/search", response_model=List[dict])
async def search_users(
    q: str = Query(..., min_length=3, description="Search query"),
    current_user: User = Depends(get_current_user),
):
    users = await auth_service.search_users(q)
    return [
        {
            "id": str(u.id),
            "username": u.username,
            "email": u.email,
            "avatar_url": u.avatar_url,
        }
        for u in users
    ]
