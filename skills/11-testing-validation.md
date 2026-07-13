# Skill 11: Testing & Validation

> **Goal**: Write backend API tests and frontend build validation. Ensure the application is stable, the backend handles edge cases, and the frontend builds successfully.

---

## Step 11.1: Backend Test Configuration

### File: `backend/conftest.py`

Set up pytest fixtures for testing:

```python
import pytest
import asyncio
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.config import settings

# Use a separate test database
TEST_DB_NAME = f"{settings.database_name}_test"

@pytest.fixture(scope="session")
def event_loop():
    """Create an event loop for the test session."""
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()

@pytest.fixture
async def client():
    """Create an async test client."""
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        yield ac

@pytest.fixture
def auth_headers():
    """Generate auth headers with a test token."""
    from app.utils.security import create_access_token
    token = create_access_token({"sub": "000000000000000000000000"})
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def sample_trip_data():
    """Sample trip creation data."""
    return {
        "title": "Test Trip to Tokyo",
        "description": "A wonderful test trip",
        "destination": "Tokyo",
        "country": "Japan",
        "start_date": "2025-06-01",
        "end_date": "2025-06-10",
        "budget": 3000.00,
        "currency": "USD",
        "tags": ["adventure", "food"],
        "is_public": False,
    }

@pytest.fixture
def sample_activity_data():
    """Sample activity creation data."""
    return {
        "trip_id": "000000000000000000000000",
        "day_number": 1,
        "title": "Visit Senso-ji Temple",
        "category": "attraction",
        "start_time": "09:00",
        "end_time": "12:00",
        "location_name": "Senso-ji Temple",
        "estimated_cost": 0,
    }

@pytest.fixture
def sample_expense_data():
    """Sample expense creation data."""
    return {
        "trip_id": "000000000000000000000000",
        "title": "Sushi Lunch",
        "amount": 45.00,
        "currency": "USD",
        "category": "food",
        "date": "2025-06-01",
    }

@pytest.fixture
def sample_user_data():
    """Sample user registration data."""
    return {
        "email": "test@tripforge.com",
        "username": "testuser",
        "password": "TestPass123",
        "full_name": "Test User",
    }
```

---

## Step 11.2: API Endpoint Tests

### File: `backend/tests/__init__.py` (empty)

### File: `backend/tests/test_auth.py`

Test authentication endpoints:

```python
import pytest
from httpx import AsyncClient

class TestAuthEndpoints:
    """Test authentication routes."""

    @pytest.mark.asyncio
    async def test_register_success(self, client: AsyncClient, sample_user_data):
        """Test successful user registration."""
        response = await client.post("/api/auth/register", json=sample_user_data)
        # Assert status 201
        # Assert response has access_token, token_type, user
        # Assert user fields match input (except password)

    @pytest.mark.asyncio
    async def test_register_duplicate_email(self, client: AsyncClient, sample_user_data):
        """Test registration with existing email returns 409."""
        # Register once, then try again
        # Assert status 409

    @pytest.mark.asyncio
    async def test_register_weak_password(self, client: AsyncClient, sample_user_data):
        """Test registration with weak password returns 422."""
        sample_user_data["password"] = "weak"
        response = await client.post("/api/auth/register", json=sample_user_data)
        # Assert status 422

    @pytest.mark.asyncio
    async def test_register_invalid_email(self, client: AsyncClient, sample_user_data):
        """Test registration with invalid email returns 422."""
        sample_user_data["email"] = "not-an-email"
        response = await client.post("/api/auth/register", json=sample_user_data)
        # Assert status 422

    @pytest.mark.asyncio
    async def test_login_success(self, client: AsyncClient):
        """Test successful login."""
        # First register, then login
        # Assert status 200
        # Assert response has access_token

    @pytest.mark.asyncio
    async def test_login_wrong_password(self, client: AsyncClient):
        """Test login with wrong password returns 401."""
        # Assert status 401

    @pytest.mark.asyncio
    async def test_login_nonexistent_user(self, client: AsyncClient):
        """Test login with non-existent email returns 401."""
        # Assert status 401

    @pytest.mark.asyncio
    async def test_get_me_authenticated(self, client: AsyncClient, auth_headers):
        """Test getting current user profile with valid token."""
        response = await client.get("/api/auth/me", headers=auth_headers)
        # This may fail without a real DB, but the test structure should be correct

    @pytest.mark.asyncio
    async def test_get_me_unauthenticated(self, client: AsyncClient):
        """Test getting profile without token returns 401/403."""
        response = await client.get("/api/auth/me")
        assert response.status_code in [401, 403]

    @pytest.mark.asyncio
    async def test_verify_token_valid(self, client: AsyncClient, auth_headers):
        """Test token verification with valid token."""
        response = await client.post("/api/auth/verify-token", headers=auth_headers)
        # May fail without DB but test structure is correct

    @pytest.mark.asyncio
    async def test_verify_token_invalid(self, client: AsyncClient):
        """Test token verification with invalid token returns 401/403."""
        headers = {"Authorization": "Bearer invalid-token"}
        response = await client.post("/api/auth/verify-token", headers=headers)
        assert response.status_code in [401, 403]
```

### File: `backend/tests/test_trips.py`

```python
class TestTripEndpoints:
    """Test trip CRUD routes."""

    @pytest.mark.asyncio
    async def test_create_trip(self, client, auth_headers, sample_trip_data):
        """Test creating a new trip."""
        response = await client.post("/api/trips/", json=sample_trip_data, headers=auth_headers)
        # Assert status 201 (if DB available) or proper error

    @pytest.mark.asyncio
    async def test_create_trip_unauthenticated(self, client, sample_trip_data):
        """Test creating trip without auth returns 401/403."""
        response = await client.post("/api/trips/", json=sample_trip_data)
        assert response.status_code in [401, 403]

    @pytest.mark.asyncio
    async def test_create_trip_invalid_dates(self, client, auth_headers, sample_trip_data):
        """Test creating trip where end_date < start_date returns 422."""
        sample_trip_data["end_date"] = "2025-05-01"  # Before start_date
        response = await client.post("/api/trips/", json=sample_trip_data, headers=auth_headers)
        # Assert status 422

    @pytest.mark.asyncio
    async def test_create_trip_missing_required_fields(self, client, auth_headers):
        """Test creating trip without required fields returns 422."""
        response = await client.post("/api/trips/", json={}, headers=auth_headers)
        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_list_trips(self, client, auth_headers):
        """Test listing user's trips."""
        response = await client.get("/api/trips/", headers=auth_headers)
        # Assert status 200

    @pytest.mark.asyncio
    async def test_list_trips_with_pagination(self, client, auth_headers):
        """Test trip listing with page and per_page params."""
        response = await client.get("/api/trips/?page=1&per_page=5", headers=auth_headers)
        # Assert pagination fields in response

    @pytest.mark.asyncio
    async def test_list_trips_with_status_filter(self, client, auth_headers):
        """Test trip listing filtered by status."""
        response = await client.get("/api/trips/?status=planning", headers=auth_headers)
        # Assert only planning trips returned

    @pytest.mark.asyncio
    async def test_get_nonexistent_trip(self, client, auth_headers):
        """Test getting a trip that doesn't exist returns 404."""
        response = await client.get("/api/trips/000000000000000000000000", headers=auth_headers)
        # Assert status 404

    @pytest.mark.asyncio
    async def test_delete_trip_unauthenticated(self, client):
        """Test deleting trip without auth returns 401/403."""
        response = await client.delete("/api/trips/000000000000000000000000")
        assert response.status_code in [401, 403]
```

### File: `backend/tests/test_health.py`

```python
class TestHealthEndpoints:
    """Test health and root endpoints."""

    @pytest.mark.asyncio
    async def test_root_endpoint(self, client: AsyncClient):
        """Test root endpoint returns API info."""
        response = await client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "version" in data

    @pytest.mark.asyncio
    async def test_health_endpoint(self, client: AsyncClient):
        """Test health check endpoint."""
        response = await client.get("/api/health")
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
```

### File: `backend/tests/test_validation.py`

Test Pydantic schema validation:

```python
import pytest
from app.schemas.user import UserRegister
from app.schemas.trip import TripCreate
from app.schemas.activity import ActivityCreate
from app.schemas.expense import ExpenseCreate
from pydantic import ValidationError

class TestUserSchemaValidation:
    def test_valid_user(self):
        user = UserRegister(email="test@test.com", username="testuser", password="TestPass123", full_name="Test")
        assert user.email == "test@test.com"

    def test_invalid_email(self):
        with pytest.raises(ValidationError):
            UserRegister(email="not-email", username="test", password="TestPass123", full_name="Test")

    def test_short_password(self):
        with pytest.raises(ValidationError):
            UserRegister(email="test@test.com", username="test", password="short", full_name="Test")

    def test_password_no_uppercase(self):
        with pytest.raises(ValidationError):
            UserRegister(email="test@test.com", username="test", password="nouppercase1", full_name="Test")

    def test_password_no_number(self):
        with pytest.raises(ValidationError):
            UserRegister(email="test@test.com", username="test", password="NoNumber", full_name="Test")

    def test_short_username(self):
        with pytest.raises(ValidationError):
            UserRegister(email="test@test.com", username="ab", password="TestPass123", full_name="Test")

class TestTripSchemaValidation:
    def test_valid_trip(self):
        trip = TripCreate(title="Test", destination="Tokyo", start_date="2025-06-01", end_date="2025-06-10")
        assert trip.title == "Test"

    def test_end_before_start(self):
        with pytest.raises(ValidationError):
            TripCreate(title="Test", destination="Tokyo", start_date="2025-06-10", end_date="2025-06-01")

    def test_empty_title(self):
        with pytest.raises(ValidationError):
            TripCreate(title="", destination="Tokyo", start_date="2025-06-01", end_date="2025-06-10")

    def test_negative_budget(self):
        with pytest.raises(ValidationError):
            TripCreate(title="Test", destination="Tokyo", start_date="2025-06-01", end_date="2025-06-10", budget=-100)

class TestActivitySchemaValidation:
    def test_valid_activity(self):
        act = ActivityCreate(trip_id="abc", day_number=1, title="Visit Temple", category="attraction")
        assert act.category == "attraction"

    def test_invalid_category(self):
        with pytest.raises(ValidationError):
            ActivityCreate(trip_id="abc", day_number=1, title="Test", category="invalid_category")

    def test_zero_day_number(self):
        with pytest.raises(ValidationError):
            ActivityCreate(trip_id="abc", day_number=0, title="Test", category="food")

class TestExpenseSchemaValidation:
    def test_valid_expense(self):
        exp = ExpenseCreate(trip_id="abc", title="Lunch", amount=25.0, category="food", date="2025-06-01")
        assert exp.amount == 25.0

    def test_zero_amount(self):
        with pytest.raises(ValidationError):
            ExpenseCreate(trip_id="abc", title="Free", amount=0, category="food", date="2025-06-01")

    def test_negative_amount(self):
        with pytest.raises(ValidationError):
            ExpenseCreate(trip_id="abc", title="Refund", amount=-10, category="food", date="2025-06-01")
```

---

## Step 11.3: Backend Utility Tests

### File: `backend/tests/test_security.py`

```python
from app.utils.security import hash_password, verify_password, create_access_token, decode_access_token

class TestSecurity:
    def test_password_hashing(self):
        hashed = hash_password("MyPassword123")
        assert hashed != "MyPassword123"
        assert verify_password("MyPassword123", hashed) is True
        assert verify_password("WrongPassword", hashed) is False

    def test_jwt_token_creation(self):
        token = create_access_token({"sub": "user123"})
        assert isinstance(token, str)
        assert len(token) > 0

    def test_jwt_token_decode(self):
        token = create_access_token({"sub": "user123"})
        payload = decode_access_token(token)
        assert payload is not None
        assert payload["sub"] == "user123"

    def test_jwt_invalid_token(self):
        payload = decode_access_token("invalid-token")
        assert payload is None

    def test_jwt_different_passwords_different_hashes(self):
        hash1 = hash_password("Password1")
        hash2 = hash_password("Password2")
        assert hash1 != hash2
```

### File: `backend/tests/test_helpers.py`

```python
from app.utils.helpers import generate_id, sanitize_filename, validate_image_file, format_file_size

class TestHelpers:
    def test_generate_id(self):
        id1 = generate_id()
        id2 = generate_id()
        assert isinstance(id1, str)
        assert len(id1) == 12
        assert id1 != id2

    def test_sanitize_filename(self):
        assert sanitize_filename("my file (1).jpg") is not None
        assert ".." not in sanitize_filename("../../../etc/passwd")

    def test_validate_image_file(self):
        assert validate_image_file("photo.jpg") is True
        assert validate_image_file("photo.jpeg") is True
        assert validate_image_file("photo.png") is True
        assert validate_image_file("photo.gif") is True
        assert validate_image_file("photo.webp") is True
        assert validate_image_file("document.pdf") is False
        assert validate_image_file("script.py") is False

    def test_format_file_size(self):
        assert "B" in format_file_size(500) or "bytes" in format_file_size(500).lower()
        assert "KB" in format_file_size(1024)
        assert "MB" in format_file_size(1024 * 1024)
```

---

## Step 11.4: Run Backend Tests

```bash
cd backend && source venv/bin/activate && python -m pytest tests/ -v --tb=short 2>&1 | head -100
```

**Important**: Some tests that require MongoDB will fail if MongoDB is not running. This is expected. The validation and security tests should pass regardless.

Record results:
- Total tests run
- Tests passed
- Tests failed (and why)
- Tests skipped

Log all results in `_progress/progress.md` and any failures in `_progress/errors.md`.

---

## Step 11.5: Frontend Build Validation

### TypeScript Compilation Check
```bash
cd frontend && npx tsc --noEmit 2>&1
```

Fix any TypeScript errors. All code must compile without errors.

### Production Build Check
```bash
cd frontend && npm run build 2>&1
```

This creates a production build in `frontend/dist/`. The build must succeed without errors.

Record:
- Build success/failure
- Bundle size
- Any warnings

---

## Step 11.6: Lint Check (Optional but Impressive)

If eslint is configured in the Vite template:
```bash
cd frontend && npx eslint src/ --ext .ts,.tsx --max-warnings 0 2>&1 | tail -20
```

Fix any critical lint errors. Warnings are OK.

---

## Step 11.7: Update Progress

1. Update `_progress/checklist.md`
2. Update `_progress/progress.md` for Skill 11
3. Update `_progress/quality_metrics.md` with test results

---

## ✅ Completion Criteria for Skill 11

- [ ] `conftest.py` with fixtures and test client
- [ ] Auth endpoint tests (8+ test cases)
- [ ] Trip endpoint tests (8+ test cases)
- [ ] Health endpoint tests (2+ test cases)
- [ ] Schema validation tests (12+ test cases)
- [ ] Security utility tests (5+ test cases)
- [ ] Helper utility tests (4+ test cases)
- [ ] Tests executed and results logged
- [ ] Frontend TypeScript compilation passes
- [ ] Frontend production build succeeds
- [ ] All failures documented in errors.md
- [ ] Progress files updated
