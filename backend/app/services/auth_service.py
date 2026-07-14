from typing import Tuple, Optional
from beanie import PydanticObjectId
from app.models.user import User
from app.schemas.user import UserRegister, UserLogin, UserUpdate
from app.utils.security import hash_password, verify_password, create_access_token
from app.utils.exceptions import ConflictException, UnauthorizedException, NotFoundException, BadRequestException

async def register_user(data: UserRegister) -> Tuple[User, str]:
    """Register a new user."""
    if await User.find_one({"email": data.email}):
        raise ConflictException("Email already registered")
    if await User.find_one({"username": data.username}):
        raise ConflictException("Username already taken")
    
    hashed_pw = hash_password(data.password)
    user = User(
        email=data.email,
        username=data.username,
        hashed_password=hashed_pw,
        full_name=data.full_name
    )
    await user.insert()
    
    token = create_access_token(data={"sub": str(user.id)})
    return user, token

async def login_user(data: UserLogin) -> Tuple[User, str]:
    """Authenticate a user."""
    user = await User.find_one({"email": data.email})
    if not user or not verify_password(data.password, user.hashed_password):
        raise UnauthorizedException("Invalid email or password")
    
    if not user.is_active:
        from app.utils.exceptions import ForbiddenException
        raise ForbiddenException("User account is inactive")
    
    token = create_access_token(data={"sub": str(user.id)})
    return user, token

async def get_user_profile(user_id: str) -> User:
    """Get user profile by ID."""
    user = await User.get(PydanticObjectId(user_id))
    if not user:
        raise NotFoundException("User not found")
    return user

async def update_user_profile(user_id: str, data: UserUpdate) -> User:
    """Update user profile fields."""
    user = await get_user_profile(user_id)
    update_data = data.model_dump(exclude_unset=True)
    await user.set(update_data)
    return user

async def change_password(user_id: str, old_password: str, new_password: str) -> bool:
    """Change user password."""
    user = await get_user_profile(user_id)
    if not verify_password(old_password, user.hashed_password):
        raise BadRequestException("Incorrect old password")
    
    user.hashed_password = hash_password(new_password)
    await user.save()
    return True

async def delete_user_account(user_id: str, password: str) -> bool:
    """Soft-delete user account."""
    user = await get_user_profile(user_id)
    if not verify_password(password, user.hashed_password):
        raise BadRequestException("Incorrect password")
    
    user.is_active = False
    await user.save()
    return True
