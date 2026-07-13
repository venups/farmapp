from app.models.user import User
from app.schemas.user import UserRegister, UserUpdate
from app.utils.security import hash_password, verify_password, create_access_token
from beanie import PydanticObjectId


async def register_user(data: UserRegister) -> tuple[User, str]:
    """Register a new user."""
    # Check if email already exists
    existing_user = await User.find_one({"email": data.email})
    if existing_user:
        raise Exception("Email already registered")
    
    # Check if username already exists
    existing_user = await User.find_one({"username": data.username})
    if existing_user:
        raise Exception("Username already taken")
    
    # Hash password
    hashed_password = hash_password(data.password)
    
    # Create user
    user = User(
        email=data.email,
        username=data.username,
        hashed_password=hashed_password,
        full_name=data.full_name,
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )
    
    await user.insert()
    
    # Generate JWT token
    access_token = create_access_token(data={"sub": str(user.id), "username": user.username})
    
    return user, access_token


async def login_user(data) -> tuple[User, str]:
    """Authenticate a user."""
    # Find user by email
    user = await User.find_one({"email": data.email})
    if not user:
        raise Exception("Invalid email or password")
    
    # Verify password
    if not verify_password(data.password, user.hashed_password):
        raise Exception("Invalid email or password")
    
    # Check user is active
    if not user.is_active:
        raise Exception("User account is inactive")
    
    # Generate JWT token
    access_token = create_access_token(data={"sub": str(user.id), "username": user.username})
    
    return user, access_token


async def get_user_profile(user_id: str) -> User:
    """Get user profile by ID."""
    try:
        user = await User.get(user_id)
    except Exception:
        raise Exception("User not found")
    
    if user is None:
        raise Exception("User not found")
    
    return user


async def update_user_profile(user_id: str, data) -> User:
    """Update user profile fields."""
    user = await get_user_profile(user_id)
    
    update_data = {}
    for field in ["full_name", "bio", "avatar_url"]:
        value = getattr(data, field)
        if value is not None:
            update_data[field] = value
    
    if update_data:
        update_data["updated_at"] = datetime.now()
        await user.update({"$set": update_data})
    
    return user


async def change_password(user_id: str, old_password: str, new_password: str) -> bool:
    """Change user password."""
    user = await User.get(user_id)
    
    if not verify_password(old_password, user.hashed_password):
        raise Exception("Invalid current password")
    
    # Validate new password
    if len(new_password) < 8:
        raise Exception("New password must be at least 8 characters")
    
    user.hashed_password = hash_password(new_password)
    user.updated_at = datetime.now()
    
    await user.save()
    return True


async def delete_user_account(user_id: str, password: str) -> bool:
    """Soft-delete user account."""
    user = await User.get(user_id)
    
    if not verify_password(password, user.hashed_password):
        raise Exception("Invalid password")
    
    # Soft delete
    user.is_active = False
    user.updated_at = datetime.now()
    
    await user.save()
    return True
