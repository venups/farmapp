# Skill 05: Authentication System

> **Goal**: Implement complete JWT-based authentication with password hashing, token generation, protected routes, and user management endpoints.

---

## Step 5.1: Password Hashing Utility

### File: `backend/app/utils/security.py`

```python
from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta, timezone
from typing import Optional
from app.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """Hash a password using bcrypt."""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a hash."""
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token.
    
    Args:
        data: dict with at minimum {"sub": user_id_string}
        expires_delta: optional custom expiration
    
    Returns:
        Encoded JWT string
    """
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=settings.access_token_expire_minutes))
    to_encode.update({"exp": expire, "iat": datetime.now(timezone.utc)})
    return jwt.encode(to_encode, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)

def decode_access_token(token: str) -> Optional[dict]:
    """Decode and validate a JWT token.
    
    Returns:
        Decoded payload dict or None if invalid/expired
    """
    try:
        payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
        return payload
    except JWTError:
        return None
```

---

## Step 5.2: Authentication Dependency

### File: `backend/app/utils/auth_deps.py`

**Replace the temporary stub** from Skill 04 with the real implementation:

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.utils.security import decode_access_token
from app.models.user import User
from beanie import PydanticObjectId

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> User:
    """Extract and validate the JWT token from the Authorization header.
    
    Flow:
    1. Extract token from Bearer header
    2. Decode the JWT token
    3. Extract user ID from the "sub" claim
    4. Fetch the User document from MongoDB
    5. Verify user exists and is active
    6. Return the User document
    
    Raises:
        HTTPException 401 if token is invalid, expired, or user not found
        HTTPException 403 if user is inactive
    """
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
```

Also create an optional version for public endpoints that may optionally use auth:

```python
async def get_optional_user(credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer(auto_error=False))) -> Optional[User]:
    """Same as get_current_user but returns None instead of raising if no token provided."""
    if credentials is None:
        return None
    # ... same logic as above but return None on failure
```

---

## Step 5.3: Authentication Service

### File: `backend/app/services/auth_service.py`

```python
async def register_user(data: UserRegister) -> Tuple[User, str]:
    """Register a new user.
    
    Flow:
    1. Check if email already exists → ConflictException
    2. Check if username already exists → ConflictException
    3. Hash the password
    4. Create User document
    5. Generate JWT token
    6. Return (user, token)
    """

async def login_user(data: UserLogin) -> Tuple[User, str]:
    """Authenticate a user.
    
    Flow:
    1. Find user by email → UnauthorizedException if not found
    2. Verify password → UnauthorizedException if wrong
    3. Check user is active → ForbiddenException if inactive
    4. Generate JWT token
    5. Return (user, token)
    """

async def get_user_profile(user_id: str) -> User:
    """Get user profile by ID. Raise NotFoundException if not found."""

async def update_user_profile(user_id: str, data: UserUpdate) -> User:
    """Update user profile fields (full_name, bio, avatar_url). Only non-None fields are updated."""

async def change_password(user_id: str, old_password: str, new_password: str) -> bool:
    """Change user password.
    
    Flow:
    1. Fetch user
    2. Verify old password → BadRequestException if wrong
    3. Hash new password
    4. Update user
    5. Return True
    """

async def delete_user_account(user_id: str, password: str) -> bool:
    """Soft-delete user account.
    
    Flow:
    1. Verify password
    2. Set is_active = False
    3. Return True
    """
```

---

## Step 5.4: Authentication Routes

### File: `backend/app/routes/auth.py`

Replace the placeholder with full implementations:

```
POST   /register              → Register new user
                                Body: UserRegister
                                Response: TokenResponse (201)
                                Validates email format, username format, password strength

POST   /login                 → Login user
                                Body: UserLogin
                                Response: TokenResponse (200)

POST   /logout                → Logout (just returns success — JWT is stateless)
                                Response: {"message": "Logged out successfully"} (200)

GET    /me                    → Get current user profile (requires auth)
                                Response: UserResponse (200)

POST   /verify-token          → Verify if a token is valid (requires auth)
                                Response: {"valid": true, "user": UserResponse} (200)
```

---

## Step 5.5: User Management Routes

### File: `backend/app/routes/users.py`

```
GET    /profile               → Get own profile (requires auth)
                                Response: UserResponse

PUT    /profile               → Update own profile (requires auth)
                                Body: UserUpdate
                                Response: UserResponse

PUT    /change-password       → Change password (requires auth)
                                Body: { old_password: str, new_password: str }
                                Response: {"message": "Password changed"}

DELETE /account               → Delete own account (requires auth)
                                Body: { password: str }
                                Response: {"message": "Account deleted"} (200)

GET    /search                → Search users by username or email (for collaborator invite)
                                Query params: q (search query, min 3 chars)
                                Response: List[UserResponse] (limited to 10 results)
                                Only return id, username, email, avatar_url (not full profile)
```

---

## Step 5.6: Update All Existing Routes

Now go back and update ALL route files from Skill 04 to use the REAL `get_current_user` dependency instead of the stub. Every protected endpoint should:

```python
from app.utils.auth_deps import get_current_user
from app.models.user import User

@router.post("/", response_model=TripResponse, status_code=201)
async def create_trip(data: TripCreate, current_user: User = Depends(get_current_user)):
    result = await trip_service.create_trip(str(current_user.id), data)
    return result
```

Make sure the service functions receive `str(current_user.id)` (converted from ObjectId to string where needed).

---

## Step 5.7: Password Validation Rules

Implement password strength validation in `UserRegister` schema:

```python
@field_validator("password")
@classmethod
def validate_password(cls, v: str) -> str:
    if len(v) < 8:
        raise ValueError("Password must be at least 8 characters")
    if not any(c.isupper() for c in v):
        raise ValueError("Password must contain at least one uppercase letter")
    if not any(c.islower() for c in v):
        raise ValueError("Password must contain at least one lowercase letter")
    if not any(c.isdigit() for c in v):
        raise ValueError("Password must contain at least one number")
    return v
```

---

## Step 5.8: Verify Auth Flow

Start the backend and test these flows using the FastAPI Swagger UI at `/docs`:

1. Register a new user
2. Login with the user
3. Use the returned token to access `/api/auth/me`
4. Verify protected routes reject requests without a token

If MongoDB is not running, note this in `_progress/errors.md` and move on. The code should still be correct.

---

## Step 5.9: Update Progress

1. Update `_progress/checklist.md`:
   - [x] Authentication system (JWT) implemented
   - [x] Error handling middleware

2. Update `_progress/progress.md` for Skill 05
3. Log decisions about password rules, token expiration, etc.

---

## ✅ Completion Criteria for Skill 05

- [ ] `security.py` implements password hashing and JWT token functions
- [ ] `auth_deps.py` has `get_current_user` and `get_optional_user` dependencies
- [ ] `auth_service.py` handles registration, login, profile management
- [ ] Auth routes (register, login, logout, me, verify-token) all implemented
- [ ] User routes (profile, update, change-password, delete, search) all implemented
- [ ] All routes from Skill 04 updated to use real auth dependency
- [ ] Password validation enforced
- [ ] Proper HTTP status codes and error responses
- [ ] No stub implementations remain
- [ ] Progress files updated
