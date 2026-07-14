from fastapi import APIRouter, Depends, status, HTTPException
from typing import List
from pydantic import BaseModel

from app.schemas.user import UserResponse, UserUpdate
from app.services import auth_service
from app.utils.auth_deps import get_current_user
from app.models.user import User
from app.utils.exceptions import TripForgeException

router = APIRouter()

class PasswordChangeRequest(BaseModel):
    old_password: str
    new_password: str

class AccountDeleteRequest(BaseModel):
    password: str

@router.get("/profile", response_model=UserResponse)
async def get_profile(current_user: User = Depends(get_current_user)):
    return UserResponse(**current_user.to_response_dict())

@router.put("/profile", response_model=UserResponse)
async def update_profile(data: UserUpdate, current_user: User = Depends(get_current_user)):
    try:
        user = await auth_service.update_user_profile(str(current_user.id), data)
        return UserResponse(**user.to_response_dict())
    except TripForgeException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)

@router.put("/change-password")
async def change_password(data: PasswordChangeRequest, current_user: User = Depends(get_current_user)):
    try:
        await auth_service.change_password(str(current_user.id), data.old_password, data.new_password)
        return {"message": "Password changed successfully"}
    except TripForgeException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)

@router.delete("/account")
async def delete_account(data: AccountDeleteRequest, current_user: User = Depends(get_current_user)):
    try:
        await auth_service.delete_user_account(str(current_user.id), data.password)
        return {"message": "Account deleted successfully"}
    except TripForgeException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)

@router.get("/search", response_model=List[UserResponse])
async def search_users(q: str, current_user: User = Depends(get_current_user)):
    if len(q) < 3:
        raise HTTPException(status_code=400, detail="Search query must be at least 3 characters")
    
    from app.models.user import User
    users = await User.find(
        {"$or": [{"username": {"$regex": q, "$options": "i"}}, {"email": {"$regex": q, "$options": "i"}}]}
    ).limit(10).to_list()
    
    return [UserResponse(**u.to_response_dict()) for u in users]
