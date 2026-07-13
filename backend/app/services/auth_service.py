from datetime import datetime
from typing import Tuple

from beanie import PydanticObjectId

from app.models.user import User
from app.schemas.user import UserRegister, UserLogin, UserUpdate
from app.utils.security import hash_password, verify_password, create_access_token
from app.utils.exceptions import (
    ConflictException,
    UnauthorizedException,
    ForbiddenException,
    NotFoundException,
    BadRequestException,
)


async def register_user(data: UserRegister) -> Tuple[User, str]:
    """Register a new user."""
    existing_email = await User.find(User.email == data.email).first()
    if existing_email:
        raise ConflictException("A user with this email already exists")

    existing_username = await User.find(User.username == data.username).first()
    if existing_username:
        raise ConflictException("A user with this username already exists")

    user = User(
        id=PydanticObjectId(),
        email=data.email,
        username=data.username,
        hashed_password=hash_password(data.password),
        full_name=data.full_name,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    await user.insert()

    token = create_access_token(data={"sub": str(user.id)})
    return user, token


async def login_user(data: UserLogin) -> Tuple[User, str]:
    """Authenticate a user."""
    user = await User.find(User.email == data.email).first()
    if not user:
        raise UnauthorizedException("Invalid email or password")

    if not verify_password(data.password, user.hashed_password):
        raise UnauthorizedException("Invalid email or password")

    if not user.is_active:
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
    user = await User.get(PydanticObjectId(user_id))
    if not user:
        raise NotFoundException("User not found")

    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(user, key, value)

    user.updated_at = datetime.utcnow()
    await user.save()
    return user


async def change_password(user_id: str, old_password: str, new_password: str) -> bool:
    """Change user password."""
    user = await User.get(PydanticObjectId(user_id))
    if not user:
        raise NotFoundException("User not found")

    if not verify_password(old_password, user.hashed_password):
        raise BadRequestException("Current password is incorrect")

    user.hashed_password = hash_password(new_password)
    user.updated_at = datetime.utcnow()
    await user.save()
    return True


async def delete_user_account(user_id: str, password: str) -> bool:
    """Soft-delete user account."""
    user = await User.get(PydanticObjectId(user_id))
    if not user:
        raise NotFoundException("User not found")

    if not verify_password(password, user.hashed_password):
        raise BadRequestException("Password is incorrect")

    user.is_active = False
    user.updated_at = datetime.utcnow()
    await user.save()
    return True


async def search_users(query: str) -> list:
    """Search users by username or email."""
    from beanie import regex

    users = (
        await User.find(
            (User.username.regex(regex.Regex(query, "i")))
            | (User.email.regex(regex.Regex(query, "i")))
        )
        .project_out("hashed_password")
        .limit(10)
        .to_list()
    )
    return users
