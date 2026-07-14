from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
from app.utils.security import decode_access_token
from app.models.user import User
from beanie import PydanticObjectId

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> User:
    """Extract and validate the JWT token from the Authorization header."""
    token = credentials.credentials
    payload = decode_access_token(token)
    
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        )
    
    try:
        user = await User.get(PydanticObjectId(user_id))
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive",
        )
    
    return user

async def get_optional_user(credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer(auto_error=False))) -> Optional[User]:
    """Same as get_current_user but returns None instead of raising if no token provided."""
    if credentials is None:
        return None
    try:
        token = credentials.credentials
        payload = decode_access_token(token)
        if payload is None:
            return None
        user_id = payload.get("sub")
        if user_id is None:
            return None
        user = await User.get(PydanticObjectId(user_id))
        if user is None or not user.is_active:
            return None
        return user
    except Exception:
        return None
