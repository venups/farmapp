# Skill 03: MongoDB Models & Pydantic Schemas

> **Goal**: Define all MongoDB document models using Beanie and all request/response Pydantic schemas. Every model must have complete field definitions, validators, and indexes.

---

## Step 3.1: User Model

### File: `backend/app/models/__init__.py`
```python
from app.models.user import User
from app.models.trip import Trip
from app.models.activity import Activity
from app.models.expense import Expense
from app.models.packing_item import PackingItem
```

### File: `backend/app/models/user.py`

Create a Beanie `Document` class for User:

```
class User(Document):
    Fields:
        - email: Indexed(str, unique=True)  — user's email, must be unique
        - username: Indexed(str, unique=True) — display name, must be unique
        - hashed_password: str — bcrypt hashed password (NEVER return in API responses)
        - full_name: str — user's full name
        - avatar_url: Optional[str] = None — URL to avatar image
        - bio: Optional[str] = None — short bio, max 500 chars
        - created_at: datetime — auto-set to utcnow on creation
        - updated_at: datetime — auto-set to utcnow, update on every save
        - is_active: bool = True — soft delete flag
        - trip_count: int = 0 — cached count of trips

    Settings:
        name = "users"  (MongoDB collection name)

    Methods:
        - to_response_dict() -> dict: Returns user data WITHOUT hashed_password
```

**Important**: Use Beanie's `Indexed` for fields that need database indexes.

---

## Step 3.2: Trip Model

### File: `backend/app/models/trip.py`

```
class Trip(Document):
    Fields:
        - title: str — trip name, max 200 chars
        - description: Optional[str] = None — trip description, max 2000 chars
        - destination: str — primary destination name
        - country: Optional[str] = None — country name
        - cover_image_url: Optional[str] = None — cover photo URL
        - start_date: date — trip start date
        - end_date: date — trip end date
        - owner_id: PydanticObjectId — reference to User who created it
        - collaborator_ids: List[PydanticObjectId] = [] — users with edit access
        - status: str = "planning" — one of: "planning", "ongoing", "completed", "cancelled"
        - budget: Optional[float] = None — total budget amount
        - currency: str = "USD" — currency code (USD, EUR, GBP, etc.)
        - tags: List[str] = [] — user-defined tags
        - is_public: bool = False — whether trip is publicly viewable
        - notes: Optional[str] = None — general trip notes
        - created_at: datetime
        - updated_at: datetime

    Settings:
        name = "trips"
        indexes:
            - owner_id (for fast user lookup)
            - [owner_id, status] (compound index)
            - start_date (for sorting)

    Validators:
        - end_date must be >= start_date
        - status must be one of the allowed values
        - budget must be >= 0 if provided

    Methods:
        - @property duration_days -> int: calculates trip duration
        - @property is_upcoming -> bool: start_date > today
        - @property is_past -> bool: end_date < today
```

---

## Step 3.3: Activity Model

### File: `backend/app/models/activity.py`

```
class Activity(Document):
    Fields:
        - trip_id: PydanticObjectId — reference to Trip
        - day_number: int — which day of the trip (1-indexed)
        - title: str — activity name, max 200 chars
        - description: Optional[str] = None — activity details
        - category: str — one of: "food", "attraction", "transport", "accommodation", "shopping", "entertainment", "nature", "culture", "other"
        - start_time: Optional[str] = None — time string "HH:MM" format
        - end_time: Optional[str] = None — time string "HH:MM" format
        - location_name: Optional[str] = None — place name
        - latitude: Optional[float] = None — GPS latitude
        - longitude: Optional[float] = None — GPS longitude
        - address: Optional[str] = None — street address
        - estimated_cost: Optional[float] = None — estimated cost
        - currency: str = "USD"
        - booking_url: Optional[str] = None — booking/reservation link
        - notes: Optional[str] = None
        - order_index: int = 0 — for drag-and-drop ordering within a day
        - is_booked: bool = False
        - rating: Optional[int] = None — 1-5 star rating (post-trip)
        - image_url: Optional[str] = None
        - created_at: datetime
        - updated_at: datetime

    Settings:
        name = "activities"
        indexes:
            - trip_id
            - [trip_id, day_number] (compound)
            - [trip_id, day_number, order_index] (compound for sorted retrieval)

    Validators:
        - day_number must be >= 1
        - category must be one of the allowed values
        - rating must be 1-5 if provided
        - start_time/end_time must match HH:MM format if provided
        - order_index must be >= 0
```

---

## Step 3.4: Expense Model

### File: `backend/app/models/expense.py`

```
class Expense(Document):
    Fields:
        - trip_id: PydanticObjectId — reference to Trip
        - title: str — what the expense is for
        - amount: float — expense amount (must be > 0)
        - currency: str = "USD"
        - category: str — one of: "food", "transport", "accommodation", "activities", "shopping", "insurance", "visa", "tips", "other"
        - date: date — when the expense occurred
        - paid_by: Optional[PydanticObjectId] = None — which user paid
        - split_between: List[PydanticObjectId] = [] — users to split cost with
        - notes: Optional[str] = None
        - receipt_url: Optional[str] = None — uploaded receipt image
        - is_paid: bool = True — payment status
        - payment_method: Optional[str] = None — "cash", "card", "digital"
        - created_at: datetime
        - updated_at: datetime

    Settings:
        name = "expenses"
        indexes:
            - trip_id
            - [trip_id, category]
            - [trip_id, date]

    Validators:
        - amount must be > 0
        - category must be one of the allowed values
```

---

## Step 3.5: Packing Item Model

### File: `backend/app/models/packing_item.py`

```
class PackingItem(Document):
    Fields:
        - trip_id: PydanticObjectId — reference to Trip
        - name: str — item name
        - category: str — one of: "clothing", "toiletries", "electronics", "documents", "medicine", "accessories", "gear", "other"
        - quantity: int = 1 — how many to pack
        - is_packed: bool = False — checked off or not
        - is_essential: bool = False — marked as essential/critical
        - notes: Optional[str] = None
        - created_at: datetime
        - updated_at: datetime

    Settings:
        name = "packing_items"
        indexes:
            - trip_id
            - [trip_id, category]
```

---

## Step 3.6: Pydantic Request/Response Schemas

### File: `backend/app/schemas/__init__.py` (empty)

### File: `backend/app/schemas/user.py`

Create these Pydantic BaseModel schemas:

```python
class UserRegister(BaseModel):
    email: EmailStr
    username: str  # min 3, max 30 chars, alphanumeric + underscore only
    password: str  # min 8 chars
    full_name: str  # min 1, max 100 chars

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    username: str
    full_name: str
    avatar_url: Optional[str]
    bio: Optional[str]
    created_at: datetime
    trip_count: int

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
```

### File: `backend/app/schemas/trip.py`

```python
class TripCreate(BaseModel):
    title: str  # min 1, max 200
    description: Optional[str] = None
    destination: str  # min 1, max 200
    country: Optional[str] = None
    start_date: date
    end_date: date
    budget: Optional[float] = None  # >= 0
    currency: str = "USD"
    tags: List[str] = []
    is_public: bool = False
    notes: Optional[str] = None

    # Validator: end_date >= start_date

class TripUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    destination: Optional[str] = None
    country: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    status: Optional[str] = None
    budget: Optional[float] = None
    currency: Optional[str] = None
    tags: Optional[List[str]] = None
    is_public: Optional[bool] = None
    notes: Optional[str] = None
    cover_image_url: Optional[str] = None

class TripResponse(BaseModel):
    id: str
    title: str
    description: Optional[str]
    destination: str
    country: Optional[str]
    cover_image_url: Optional[str]
    start_date: date
    end_date: date
    owner_id: str
    collaborator_ids: List[str]
    status: str
    budget: Optional[float]
    currency: str
    tags: List[str]
    is_public: bool
    notes: Optional[str]
    duration_days: int
    created_at: datetime
    updated_at: datetime

class TripListResponse(BaseModel):
    trips: List[TripResponse]
    total: int
    page: int
    per_page: int
```

### File: `backend/app/schemas/activity.py`

Create schemas: `ActivityCreate`, `ActivityUpdate`, `ActivityResponse`, `ActivityListResponse`

Include all fields from the Activity model. The Create schema should require: `trip_id`, `day_number`, `title`, `category`. All other fields are optional.

### File: `backend/app/schemas/expense.py`

Create schemas: `ExpenseCreate`, `ExpenseUpdate`, `ExpenseResponse`, `ExpenseListResponse`, `ExpenseSummary`

`ExpenseSummary` should have:
```python
class ExpenseSummary(BaseModel):
    total_amount: float
    currency: str
    by_category: Dict[str, float]  # category -> total amount
    by_date: List[Dict[str, Any]]  # [{date, amount}]
    budget: Optional[float]
    remaining_budget: Optional[float]
    expense_count: int
```

### File: `backend/app/schemas/packing.py`

Create schemas: `PackingItemCreate`, `PackingItemUpdate`, `PackingItemResponse`, `PackingListResponse`

`PackingListResponse` should include:
```python
class PackingListResponse(BaseModel):
    items: List[PackingItemResponse]
    total_items: int
    packed_items: int
    progress_percent: float  # 0-100
    by_category: Dict[str, List[PackingItemResponse]]
```

---

## Step 3.7: Add Field Validators to All Schemas

Use Pydantic v2 `@field_validator` decorators. Every schema should validate:
- String lengths (min/max)
- Numeric ranges
- Enum values (use Literal types or validators)
- Date relationships (end >= start)
- URL format where applicable

Example:
```python
from pydantic import BaseModel, field_validator

class TripCreate(BaseModel):
    title: str
    
    @field_validator("title")
    @classmethod
    def validate_title(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 1 or len(v) > 200:
            raise ValueError("Title must be between 1 and 200 characters")
        return v
```

---

## Step 3.8: Update Progress

1. Update `_progress/checklist.md`
2. Update `_progress/progress.md` for Skill 03
3. Log decisions: field types, index choices, validation rules

---

## ✅ Completion Criteria for Skill 03

- [ ] All 5 document models created with proper fields, types, indexes
- [ ] All models have `created_at` and `updated_at` auto-populated
- [ ] All Pydantic schemas created for every model (Create, Update, Response, List)
- [ ] All schemas have field validators
- [ ] `__init__.py` exports all models
- [ ] No `pass` statements or TODOs remain
- [ ] Progress files updated
