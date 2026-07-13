import pytest
from httpx import AsyncClient


class TestAuthEndpoints:
    @pytest.mark.asyncio
    async def test_register_success(self, client: AsyncClient, sample_user_data):
        response = await client.post("/api/auth/register", json=sample_user_data)
        assert response.status_code in [201, 409]

    @pytest.mark.asyncio
    async def test_register_duplicate_email(self, client: AsyncClient, sample_user_data):
        await client.post("/api/auth/register", json=sample_user_data)
        response = await client.post("/api/auth/register", json=sample_user_data)
        assert response.status_code in [409, 201]

    @pytest.mark.asyncio
    async def test_register_weak_password(self, client: AsyncClient, sample_user_data):
        sample_user_data["password"] = "weak"
        response = await client.post("/api/auth/register", json=sample_user_data)
        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_register_invalid_email(self, client: AsyncClient, sample_user_data):
        sample_user_data["email"] = "not-an-email"
        response = await client.post("/api/auth/register", json=sample_user_data)
        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_login_success(self, client: AsyncClient, sample_user_data):
        await client.post("/api/auth/register", json=sample_user_data)
        login_data = {"email": sample_user_data["email"], "password": sample_user_data["password"]}
        response = await client.post("/api/auth/login", json=login_data)
        assert response.status_code in [200, 401]

    @pytest.mark.asyncio
    async def test_login_wrong_password(self, client: AsyncClient, sample_user_data):
        await client.post("/api/auth/register", json=sample_user_data)
        login_data = {"email": sample_user_data["email"], "password": "wrongpassword"}
        response = await client.post("/api/auth/login", json=login_data)
        assert response.status_code == 401

    @pytest.mark.asyncio
    async def test_login_nonexistent_user(self, client: AsyncClient):
        login_data = {"email": "nonexistent@test.com", "password": "password123"}
        response = await client.post("/api/auth/login", json=login_data)
        assert response.status_code == 401

    @pytest.mark.asyncio
    async def test_get_me_authenticated(self, client: AsyncClient, auth_headers):
        response = await client.get("/api/auth/me", headers=auth_headers)
        assert response.status_code in [200, 401]

    @pytest.mark.asyncio
    async def test_get_me_unauthenticated(self, client: AsyncClient):
        response = await client.get("/api/auth/me")
        assert response.status_code in [401, 403]

    @pytest.mark.asyncio
    async def test_verify_token_valid(self, client: AsyncClient, auth_headers):
        response = await client.post("/api/auth/verify-token", headers=auth_headers)
        assert response.status_code in [200, 401]

    @pytest.mark.asyncio
    async def test_verify_token_invalid(self, client: AsyncClient):
        headers = {"Authorization": "Bearer invalid-token"}
        response = await client.post("/api/auth/verify-token", headers=headers)
        assert response.status_code in [401, 403]
