import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.database import get_db, reset
from app.config import MONGO_DB


@pytest.fixture(autouse=True)
def clean_db():
    """Reset motor client and clean DB before/after each test."""
    reset()
    from pymongo import MongoClient
    from app.config import MONGO_URL
    sync_client = MongoClient(MONGO_URL)
    sync_db = sync_client[MONGO_DB]
    sync_db.trips.delete_many({})
    yield
    sync_db.trips.delete_many({})
    sync_client.close()
    reset()


@pytest.mark.asyncio
async def test_health_check():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test", follow_redirects=True) as ac:
        response = await ac.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


@pytest.mark.asyncio
async def test_create_trip():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test", follow_redirects=True) as ac:
        response = await ac.post("/api/trips", json={
            "title": "Test Trip",
            "destination": "Paris",
            "start_date": "2025-06-01",
            "end_date": "2025-06-10",
            "description": "A test trip",
        })
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Test Trip"
    assert data["destination"] == "Paris"
    assert "id" in data


@pytest.mark.asyncio
async def test_list_trips():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test", follow_redirects=True) as ac:
        await ac.post("/api/trips", json={
            "title": "Trip 1",
            "destination": "London",
            "start_date": "2025-07-01",
            "end_date": "2025-07-05",
        })
        await ac.post("/api/trips", json={
            "title": "Trip 2",
            "destination": "Tokyo",
            "start_date": "2025-08-01",
            "end_date": "2025-08-10",
        })
        response = await ac.get("/api/trips")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2


@pytest.mark.asyncio
async def test_get_trip_by_id():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        create_res = await ac.post("/api/trips", json={
            "title": "Get Trip Test",
            "destination": "Rome",
            "start_date": "2025-09-01",
            "end_date": "2025-09-07",
        })
        create_data = create_res.json()
        trip_id = create_data.get("id")
        assert trip_id is not None, f"trip_id is None: {create_data.keys()}"
        url = f"/api/trips/{trip_id}"
        response = await ac.get(url)
        assert response.status_code == 200, f"Got {response.status_code} for URL: {url}, trip_id: {trip_id}"
    assert response.json()["title"] == "Get Trip Test"


@pytest.mark.asyncio
async def test_get_trip_not_found():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test", follow_redirects=True) as ac:
        response = await ac.get("/api/trips/nonexistent-id")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_update_trip():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test", follow_redirects=True) as ac:
        create_res = await ac.post("/api/trips", json={
            "title": "Update Test",
            "destination": "Berlin",
            "start_date": "2025-10-01",
            "end_date": "2025-10-05",
        })
        trip_id = create_res.json().get("id")
        update_res = await ac.put(f"/api/trips/{trip_id}", json={
            "title": "Updated Trip",
            "status": "confirmed",
        })
    assert update_res.status_code == 200
    assert update_res.json()["title"] == "Updated Trip"
    assert update_res.json()["status"] == "confirmed"


@pytest.mark.asyncio
async def test_delete_trip():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test", follow_redirects=True) as ac:
        create_res = await ac.post("/api/trips", json={
            "title": "Delete Test",
            "destination": "Madrid",
            "start_date": "2025-11-01",
            "end_date": "2025-11-05",
        })
        trip_id = create_res.json().get("id")
        delete_res = await ac.delete(f"/api/trips/{trip_id}")
        get_res = await ac.get(f"/api/trips/{trip_id}")
    assert delete_res.status_code == 200
    assert get_res.status_code == 404


@pytest.mark.asyncio
async def test_add_checklist_item():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test", follow_redirects=True) as ac:
        create_res = await ac.post("/api/trips", json={
            "title": "Checklist Test",
            "destination": "Amsterdam",
            "start_date": "2025-12-01",
            "end_date": "2025-12-05",
        })
        trip_id = create_res.json().get("id")
        add_res = await ac.post(f"/api/trips/{trip_id}/checklist", json={
            "text": "Pack passport",
            "completed": False,
            "category": "documents",
        })
    assert add_res.status_code == 200
    assert add_res.json()["text"] == "Pack passport"


@pytest.mark.asyncio
async def test_toggle_checklist_item():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        create_res = await ac.post("/api/trips", json={
            "title": "Toggle Test",
            "destination": "Vienna",
            "start_date": "2025-01-01",
            "end_date": "2025-01-05",
        })
        trip_id = create_res.json().get("id")
        await ac.post(f"/api/trips/{trip_id}/checklist", json={
            "text": "Book hotel",
            "completed": False,
        })
        trip_res = await ac.get(f"/api/trips/{trip_id}")
        trip_data = trip_res.json()
        checklist = trip_data["checklist"]
        item_keys = list(checklist[0].keys()) if checklist else []
        item_id = checklist[0].get("id", "") if checklist else ""
        toggle_res = await ac.put(f"/api/trips/{trip_id}/checklist/{item_id}/toggle")
    assert toggle_res.status_code == 200, f"Got {toggle_res.status_code}, keys={item_keys}, item_id={item_id}, checklist={checklist}"


@pytest.mark.asyncio
async def test_add_budget_item():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test", follow_redirects=True) as ac:
        create_res = await ac.post("/api/trips", json={
            "title": "Budget Test",
            "destination": "Barcelona",
            "start_date": "2025-03-01",
            "end_date": "2025-03-05",
        })
        trip_id = create_res.json().get("id")
        add_res = await ac.post(f"/api/trips/{trip_id}/budget", json={
            "category": "Flight",
            "amount": 500.00,
            "description": "Round trip flight",
        })
    assert add_res.status_code == 200
    assert add_res.json()["category"] == "Flight"
    assert add_res.json()["amount"] == 500.00


@pytest.mark.asyncio
async def test_dashboard():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test", follow_redirects=True) as ac:
        await ac.post("/api/trips", json={
            "title": "Dashboard Trip 1",
            "destination": "Dubai",
            "start_date": "2025-04-01",
            "end_date": "2025-04-05",
        })
        await ac.post("/api/trips", json={
            "title": "Dashboard Trip 2",
            "destination": "Singapore",
            "start_date": "2025-05-01",
            "end_date": "2025-05-07",
        })
        response = await ac.get("/api/trips/dashboard")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert "checklist_total" in data[0]
    assert "budget_total" in data[0]


@pytest.mark.asyncio
async def test_add_itinerary_day():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test", follow_redirects=True) as ac:
        create_res = await ac.post("/api/trips", json={
            "title": "Itinerary Test",
            "destination": "Bangkok",
            "start_date": "2025-06-01",
            "end_date": "2025-06-05",
        })
        trip_id = create_res.json().get("id")
        add_res = await ac.post(f"/api/trips/{trip_id}/itinerary", json={
            "day_number": 1,
            "date": "2025-06-01",
            "activities": [
                {
                    "title": "Arrive at airport",
                    "description": "Flight lands at 10am",
                    "time": "10:00",
                    "location": "Airport",
                    "cost": 0,
                }
            ],
        })
    assert add_res.status_code == 200
    assert add_res.json()["day_number"] == 1
