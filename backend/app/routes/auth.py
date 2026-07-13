from fastapi import APIRouter, Depends, HTTPException
from app.schemas.user import UserRegister, UserLogin, TokenResponse, UserResponse
from app.services.auth_service import register_user, login_user

router = APIRouter()


@router.post("/register", response_model=TokenResponse, status_code=201)
async def register(data: UserRegister):
    """Register a new user."""
    try:
        user, access_token = await register_user(data)
        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            user=UserResponse(
                id=str(user.id),
                email=user.email,
                username=user.username,
                full_name=user.full_name,
                avatar_url=user.avatar_url,
                bio=user.bio,
                created_at=user.created_at,
                trip_count=user.trip_count,
            )
        )
    except Exception as e:
        raise HTTPException(status_code=409, detail=str(e))


@router.post("/login", response_model=TokenResponse)
async def login(data: UserLogin):
    """Authenticate a user."""
    try:
        user, access_token = await login_user(data)
        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            user=UserResponse(
                id=str(user.id),
                email=user.email,
                username=user.username,
                full_name=user.full_name,
                avatar_url=user.avatar_url,
                bio=user.bio,
                created_at=user.created_at,
                trip_count=user.trip_count,
            )
        )
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))


@router.post("/logout")
async def logout():
    """Logout user (JWT is stateless)."""
    return {"message": "Logged out successfully"}


@router.get("/me")
async def get_current_user_profile(current_user = Depends(__import__('app.utils.auth_deps', fromlist=['get_current_user']).get_current_user)):
    """Get current user profile."""
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


@router.post("/verify-token")
async def verify_token(current_user = Depends(__import__('app.utils.auth_deps', fromlist=['get_current_user']).get_current_user)):
    """Verify if a token is valid."""
    return {
        "valid": True,
        "user": UserResponse(
            id=str(current_user.id),
            email=current_user.email,
            username=current_user.username,
            full_name=current_user.full_name,
            avatar_url=current_user.avatar_url,
            bio=current_user.bio,
            created_at=current_user.created_at,
            trip_count=current_user.trip_count,
        )
    }
