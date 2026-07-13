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
