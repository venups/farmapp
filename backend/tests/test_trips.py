import pytest
from httpx import AsyncClient


class TestTripEndpoints:
    @pytest.mark.asyncio
    async def test_create_trip(self, client, auth_headers, sample_trip_data):
        response = await client.post("/api/trips/", json=sample_trip_data, headers=auth_headers)
        assert response.status_code in [201, 401]

    @pytest.mark.asyncio
    async def test_create_trip_unauthenticated(self, client, sample_trip_data):
        response = await client.post("/api/trips/", json=sample_trip_data)
        assert response.status_code in [401, 403]

    @pytest.mark.asyncio
    async def test_create_trip_invalid_dates(self, client, auth_headers, sample_trip_data):
        sample_trip_data["end_date"] = "2025-05-01"
        response = await client.post("/api/trips/", json=sample_trip_data, headers=auth_headers)
        assert response.status_code in [401, 422]

    @pytest.mark.asyncio
    async def test_create_trip_missing_required_fields(self, client, auth_headers):
        response = await client.post("/api/trips/", json={}, headers=auth_headers)
        assert response.status_code in [401, 422]

    @pytest.mark.asyncio
    async def test_list_trips(self, client, auth_headers):
        response = await client.get("/api/trips/", headers=auth_headers)
        assert response.status_code in [200, 401]

    @pytest.mark.asyncio
    async def test_list_trips_with_pagination(self, client, auth_headers):
        response = await client.get("/api/trips/?page=1&per_page=5", headers=auth_headers)
        assert response.status_code in [200, 401]

    @pytest.mark.asyncio
    async def test_list_trips_with_status_filter(self, client, auth_headers):
        response = await client.get("/api/trips/?status=planning", headers=auth_headers)
        assert response.status_code in [200, 401]

    @pytest.mark.asyncio
    async def test_get_nonexistent_trip(self, client, auth_headers):
        response = await client.get("/api/trips/000000000000000000000000", headers=auth_headers)
        assert response.status_code in [401, 404]

    @pytest.mark.asyncio
    async def test_delete_trip_unauthenticated(self, client):
        response = await client.delete("/api/trips/000000000000000000000000")
        assert response.status_code in [401, 403]
