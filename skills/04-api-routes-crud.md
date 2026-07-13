# Skill 04: API Routes & CRUD Operations

> **Goal**: Implement all REST API endpoints with complete CRUD operations, query parameters, pagination, and proper HTTP status codes. Every route must have a real implementation — no stubs.

---

## Step 4.1: Service Layer Pattern

Before implementing routes, create a service layer that handles business logic. Routes should be thin — they parse requests, call services, and return responses.

### File: `backend/app/services/__init__.py` (empty)

### File: `backend/app/services/trip_service.py`

Implement these async functions:

```python
async def create_trip(owner_id: str, trip_data: TripCreate) -> Trip:
    """Create a new trip. Sets owner_id, created_at, updated_at. Also increments User.trip_count."""

async def get_trip(trip_id: str, user_id: str) -> Trip:
    """Get a single trip by ID. Verify user is owner or collaborator. Raise NotFoundException if not found. Raise ForbiddenException if user has no access."""

async def get_user_trips(user_id: str, status: Optional[str] = None, page: int = 1, per_page: int = 10, sort_by: str = "created_at", sort_order: str = "desc") -> Tuple[List[Trip], int]:
    """Get all trips for a user (as owner or collaborator). Supports filtering by status, pagination, and sorting. Returns (trips, total_count)."""

async def update_trip(trip_id: str, user_id: str, trip_data: TripUpdate) -> Trip:
    """Update a trip. Only owner can update. Merge only non-None fields. Update updated_at."""

async def delete_trip(trip_id: str, user_id: str) -> bool:
    """Delete a trip and all associated activities, expenses, and packing items. Only owner can delete. Decrement User.trip_count."""

async def add_collaborator(trip_id: str, owner_id: str, collaborator_email: str) -> Trip:
    """Add a collaborator to a trip by their email. Only owner can add. Verify user exists. Raise ConflictException if already a collaborator."""

async def remove_collaborator(trip_id: str, owner_id: str, collaborator_id: str) -> Trip:
    """Remove a collaborator from a trip. Only owner can remove."""
```

### File: `backend/app/services/activity_service.py`

```python
async def create_activity(user_id: str, activity_data: ActivityCreate) -> Activity:
    """Create activity. Verify user has access to the trip. Auto-set order_index to be last in that day."""

async def get_trip_activities(trip_id: str, user_id: str, day_number: Optional[int] = None) -> List[Activity]:
    """Get all activities for a trip, optionally filtered by day. Sort by day_number then order_index."""

async def get_activity(activity_id: str, user_id: str) -> Activity:
    """Get single activity. Verify user has access to parent trip."""

async def update_activity(activity_id: str, user_id: str, data: ActivityUpdate) -> Activity:
    """Update activity fields. Verify trip access."""

async def delete_activity(activity_id: str, user_id: str) -> bool:
    """Delete activity. Verify trip access."""

async def reorder_activities(trip_id: str, user_id: str, day_number: int, activity_ids: List[str]) -> List[Activity]:
    """Reorder activities within a day. Accepts ordered list of activity IDs and updates order_index for each."""
```

### File: `backend/app/services/expense_service.py`

```python
async def create_expense(user_id: str, data: ExpenseCreate) -> Expense:
    """Create expense. Verify user has trip access. Auto-set paid_by to current user if not specified."""

async def get_trip_expenses(trip_id: str, user_id: str, category: Optional[str] = None, sort_by: str = "date", sort_order: str = "desc") -> List[Expense]:
    """Get all expenses for a trip, optionally filtered by category."""

async def get_expense(expense_id: str, user_id: str) -> Expense:
    """Get single expense. Verify trip access."""

async def update_expense(expense_id: str, user_id: str, data: ExpenseUpdate) -> Expense:
    """Update expense. Verify trip access."""

async def delete_expense(expense_id: str, user_id: str) -> bool:
    """Delete expense. Verify trip access."""

async def get_expense_summary(trip_id: str, user_id: str) -> ExpenseSummary:
    """Calculate expense summary: total, by category, by date, budget remaining. Uses MongoDB aggregation pipeline for efficiency."""
```

### File: `backend/app/services/packing_service.py`

```python
async def create_packing_item(user_id: str, data: PackingItemCreate) -> PackingItem:
    """Create packing item. Verify trip access."""

async def get_packing_list(trip_id: str, user_id: str) -> PackingListResponse:
    """Get full packing list for a trip with stats (total, packed, progress %, by_category). Verify trip access."""

async def update_packing_item(item_id: str, user_id: str, data: PackingItemUpdate) -> PackingItem:
    """Update packing item. Verify trip access."""

async def delete_packing_item(item_id: str, user_id: str) -> bool:
    """Delete packing item. Verify trip access."""

async def toggle_packed(item_id: str, user_id: str) -> PackingItem:
    """Toggle is_packed status. Convenience endpoint."""

async def bulk_create_packing_items(user_id: str, trip_id: str, items: List[PackingItemCreate]) -> List[PackingItem]:
    """Create multiple packing items at once. Useful for template packing lists."""
```

---

## Step 4.2: Implement Trip Routes

### File: `backend/app/routes/trips.py`

Replace the placeholder with full implementations:

```
POST   /                     → Create a new trip (requires auth)
GET    /                     → List user's trips (requires auth)
                               Query params: status, page, per_page, sort_by, sort_order
GET    /{trip_id}            → Get trip details (requires auth, owner or collaborator)
PUT    /{trip_id}            → Update trip (requires auth, owner only)
DELETE /{trip_id}            → Delete trip and all related data (requires auth, owner only)
POST   /{trip_id}/collaborators     → Add collaborator by email (requires auth, owner only)
DELETE /{trip_id}/collaborators/{user_id} → Remove collaborator (requires auth, owner only)
GET    /{trip_id}/overview   → Get trip overview: trip details + activity count + expense total + packing progress
```

Every route handler should:
1. Extract the current user from the JWT dependency (use `Depends(get_current_user)` — you'll implement this in Skill 05, for now import it and use it)
2. Call the appropriate service function
3. Return the response with proper status code (201 for creation, 200 for success, 204 for delete)
4. Handle exceptions with try/except blocks that catch `TripForgeException` subclasses

For now, create a temporary `get_current_user` dependency stub in `backend/app/utils/auth_deps.py`:

```python
from fastapi import Depends, Header
from bson import ObjectId

async def get_current_user(authorization: str = Header(None)):
    """Temporary stub - will be replaced in Skill 05.
    For now, returns a mock user ID for testing."""
    # This will be properly implemented with JWT in Skill 05
    return {"id": "000000000000000000000000", "email": "test@test.com", "username": "testuser"}
```

---

## Step 4.3: Implement Activity Routes

### File: `backend/app/routes/activities.py`

```
POST   /                           → Create activity
GET    /trip/{trip_id}              → List activities for a trip
                                     Query params: day_number (optional filter)
GET    /{activity_id}              → Get single activity
PUT    /{activity_id}              → Update activity
DELETE /{activity_id}              → Delete activity
PUT    /trip/{trip_id}/reorder     → Reorder activities in a day
                                     Body: { day_number: int, activity_ids: List[str] }
```

---

## Step 4.4: Implement Expense Routes

### File: `backend/app/routes/expenses.py`

```
POST   /                           → Create expense
GET    /trip/{trip_id}              → List expenses for a trip
                                     Query params: category (optional filter), sort_by, sort_order
GET    /{expense_id}               → Get single expense
PUT    /{expense_id}               → Update expense
DELETE /{expense_id}               → Delete expense
GET    /trip/{trip_id}/summary     → Get expense summary (totals, by category, budget remaining)
```

---

## Step 4.5: Implement Packing Routes

### File: `backend/app/routes/packing.py`

```
POST   /                           → Create packing item
GET    /trip/{trip_id}              → Get packing list (with stats, grouped by category)
PUT    /{item_id}                  → Update packing item
DELETE /{item_id}                  → Delete packing item
PATCH  /{item_id}/toggle           → Toggle packed status
POST   /trip/{trip_id}/bulk        → Bulk create packing items
                                     Body: { items: List[PackingItemCreate] }
```

---

## Step 4.6: Implement Upload Routes

### File: `backend/app/routes/uploads.py`

```python
POST   /image                      → Upload an image file
                                     Accept multipart/form-data
                                     Validate file type (jpg, png, gif, webp)
                                     Validate file size (< MAX_UPLOAD_SIZE_MB)
                                     Save to uploads/ directory with unique filename
                                     Return: { url: "/uploads/filename.jpg", filename: "filename.jpg" }

DELETE /image/{filename}           → Delete an uploaded file
```

Implementation details:
- Use `UploadFile` from FastAPI
- Generate unique filename: `{uuid}_{original_name}`
- Use `aiofiles` for async file writing
- Create subdirectories by date: `uploads/2024/01/`
- Return the URL path that can be used to access the file

---

## Step 4.7: Add Response Model Annotations

Every route should have `response_model` specified:

```python
@router.post("/", response_model=TripResponse, status_code=status.HTTP_201_CREATED)
async def create_trip(...):
```

This ensures FastAPI validates the response and generates accurate OpenAPI docs.

---

## Step 4.8: Update Progress

1. Update `_progress/checklist.md`:
   - [x] CRUD operations implemented
   - [x] All API routes created
   - [x] Input validation with Pydantic

2. Update `_progress/progress.md` for Skill 04
3. Log decisions about service layer pattern, pagination defaults, etc.

---

## ✅ Completion Criteria for Skill 04

- [ ] 4 service files with full implementations (trip, activity, expense, packing)
- [ ] 7 route files with all endpoints implemented (trips, activities, expenses, packing, uploads, + auth/users stubs)
- [ ] Every route has `response_model` and proper `status_code`
- [ ] Pagination supported on list endpoints
- [ ] Filtering supported where specified
- [ ] Sorting supported where specified
- [ ] Upload route handles file validation and storage
- [ ] All routes use dependency injection for current user
- [ ] No placeholder implementations remain
- [ ] Progress files updated
