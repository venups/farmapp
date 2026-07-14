import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_create_trip():
    payload = {
        "name": "Summer Vacation",
        "destinations": ["Italy", "France"],
        "start_date": "2026-07-01",
        "end_date": "2026-07-15",
        "notes": "Dream trip!"
    }
    response = client.post("/trips", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Summer Vacation"
    assert "id" in data

def test_create_trip_invalid_dates():
    payload = {
        "name": "Invalid Trip",
        "destinations": ["Nowhere"],
        "start_date": "2026-07-15",
        "end_date": "2026-07-01",
    }
    response = client.post("/trips", json=payload)
    assert response.status_code == 400
    assert "End date cannot be before start date" in response.json()["detail"]

def test_get_trips():
    response = client.get("/trips")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_delete_trip():
    # Create a trip first
    payload = {
        "name": "To Delete",
        "destinations": ["Mars"],
        "start_date": "2026-08-01",
        "end_date": "2026-08-10",
    }
    trip = client.post("/trips", json=payload).json()
    trip_id = trip["id"]
    
    response = client.delete(f"/trips/{trip_id}")
    assert response.status_code == 200
    
    # Verify it's gone
    get_res = client.get(f"/trips/{trip_id}")
    assert get_res.status_code == 404
