import pytest
import asyncio
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.config import settings

TEST_DB_NAME = f"{settings.database_name}_test"


@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture
async def client():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac


@pytest.fixture
def auth_headers():
    from app.utils.security import create_access_token
    token = create_access_token({"sub": "000000000000000000000000"})
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def sample_trip_data():
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
    return {
        "email": "test@tripforge.com",
        "username": "testuser",
        "password": "TestPass123",
        "full_name": "Test User",
    }
