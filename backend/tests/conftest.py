import mongomock
import pytest
from fastapi.testclient import TestClient

from app.config import Settings
from app.main import create_app
from app.store import DocumentStore


@pytest.fixture
def client():
    """A TestClient backed by a fresh in-memory store — never dev data."""
    store = DocumentStore(mongomock.MongoClient()["test_db"])
    app = create_app(Settings(), store)
    with TestClient(app) as c:
        yield c


@pytest.fixture
def trip(client):
    res = client.post(
        "/api/trips",
        json={
            "name": "Autumn in Portugal",
            "destinations": ["Lisbon", "Porto"],
            "start_date": "2030-10-01",
            "end_date": "2030-10-10",
            "notes": "Shoulder season",
        },
    )
    assert res.status_code == 201
    return res.json()
