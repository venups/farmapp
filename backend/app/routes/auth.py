from fastapi import APIRouter, Depends, status, HTTPException
from typing import Tuple
from app.schemas.user import UserRegister, UserLogin, UserResponse, TokenResponse
from app.services import auth_service
from app.utils.auth_deps import get_current_user
from app.models.user import User
from app.utils.exceptions import TripForgeException

router = APIRouter()

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(data: UserRegister):
    try:
        user, token = await auth_service.register_user(data)
        return TokenResponse(
            access_token=token,
            user=UserResponse(**user.to_response_dict())
        )
    except TripForgeException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)

@router.post("/login", response_model=TokenResponse)
async def login(data: UserLogin):
    try:
        user, token = await auth_service.login_user(data)
        return TokenResponse(
            access_token=token,
            user=UserResponse(**user.to_response_dict())
        )
    except TripForgeException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)

@router.post("/logout")
async def logout():
    return {"message": "Logged out successfully"}

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse(**current_user.to_response_dict())

@router.post("/verify-token")
async def verify_token(current_user: User = Depends(get_current_user)):
    return {
        "valid": True, 
        "user": UserResponse(**current_user.to_response_dict())
    }
