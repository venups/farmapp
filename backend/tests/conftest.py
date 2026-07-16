import pytest
from mongomock import MongoClient
from datetime import date, datetime

from app.db import Database, get_db


@pytest.fixture(autouse=True)
async def setup_test_db():
    """Set up an isolated in-memory database for tests."""
    # Use mongomock for all tests with custom encoder for dates
    from bson import Code, Regex, Timestamp, MinKey, MaxKey
    
    Database.client = MongoClient()
    Database.db = Database.client['test_travel_planner']
    
    yield
    
    # Clean up after test
    if Database.client:
        Database.client.drop_database('test_travel_planner')


@pytest.fixture
def sample_trip_data():
    from datetime import date, timedelta
    today = date.today()
    return {
        'name': 'Test Trip',
        'destinations': ['Paris', 'London'],
        'start_date': today + timedelta(days=30),
        'end_date': today + timedelta(days=40),
        'notes': 'Test notes'
    }


@pytest.fixture
def sample_trip_data_invalid():
    from datetime import date, timedelta
    today = date.today()
    return {
        'name': 'Invalid Trip',
        'destinations': ['Tokyo'],
        'start_date': today + timedelta(days=40),
        'end_date': today + timedelta(days=30),  # End before start - invalid
        'notes': None
    }
