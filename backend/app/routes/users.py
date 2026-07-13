from fastapi import APIRouter, Depends, HTTPException
from app.schemas.user import UserUpdate, UserResponse
from app.services.auth_service import get_user_profile, update_user_profile

router = APIRouter()


@router.get("/profile")
async def get_own_profile(current_user = Depends(__import__('app.utils.auth_deps', fromlist=['get_current_user']).get_current_user)):
    """Get own profile."""
    return UserResponse(
        id=str(current_user.id),
        email=current_user.email,
        username=current_user.username,
        full_name=current_user.full_name,
        avatar_url=current_user.avatar_url,
        bio=current_user.bio,
        created_at=current_user.created_at,
        trip_count=current_user.trip_count,
    )


@router.put("/profile")
async def update_own_profile(data: UserUpdate, current_user = Depends(__import__('app.utils.auth_deps', fromlist=['get_current_user']).get_current_user)):
    """Update own profile."""
    try:
        user = await update_user_profile(str(current_user.id), data)
        return UserResponse(
            id=str(user.id),
            email=user.email,
            username=user.username,
            full_name=user.full_name,
            avatar_url=user.avatar_url,
            bio=user.bio,
            created_at=user.created_at,
            trip_count=user.trip_count,
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/change-password")
async def change_password(data: dict, current_user = Depends(__import__('app.utils.auth_deps', fromlist=['get_current_user']).get_current_user)):
    """Change password."""
    try:
        from app.services.auth_service import change_password
        await change_password(str(current_user.id), data["old_password"], data["new_password"])
        return {"message": "Password changed successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/account")
async def delete_account(data: dict, current_user = Depends(__import__('app.utils.auth_deps', fromlist=['get_current_user']).get_current_user)):
    """Delete own account."""
    try:
        from app.services.auth_service import delete_user_account
        await delete_user_account(str(current_user.id), data["password"])
        return {"message": "Account deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/search")
async def search_users(q: str = "", current_user = Depends(__import__('app.utils.auth_deps', fromlist=['get_current_user']).get_current_user)):
    """Search users by username or email for collaborator invite."""
    if len(q) < 3:
        raise HTTPException(status_code=400, detail="Search query must be at least 3 characters")
    
    from app.models.user import User
    users = await User.find({
        "$or": [
            {"username": {"$regex": q, "$options": "i"}},
            {"email": {"$regex": q, "$options": "i"}}
        ]
    }).limit(10).to_list()
    
    return [
        {
            "id": str(u.id),
            "username": u.username,
            "email": u.email,
            "avatar_url": u.avatar_url,
        }
        for u in users
    ]
