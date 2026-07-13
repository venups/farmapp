import pytest
from app.schemas.user import UserRegister
from app.schemas.trip import TripCreate
from app.schemas.activity import ActivityCreate
from app.schemas.expense import ExpenseCreate
from pydantic import ValidationError


class TestUserSchemaValidation:
    def test_valid_user(self):
        user = UserRegister(
            email="test@test.com",
            username="testuser",
            password="TestPass123",
            full_name="Test"
        )
        assert user.email == "test@test.com"

    def test_invalid_email(self):
        with pytest.raises(ValidationError):
            UserRegister(
                email="not-email",
                username="test",
                password="TestPass123",
                full_name="Test"
            )

    def test_short_password(self):
        with pytest.raises(ValidationError):
            UserRegister(
                email="test@test.com",
                username="test",
                password="short",
                full_name="Test"
            )

    def test_password_no_uppercase(self):
        with pytest.raises(ValidationError):
            UserRegister(
                email="test@test.com",
                username="test",
                password="nouppercase1",
                full_name="Test"
            )

    def test_password_no_number(self):
        with pytest.raises(ValidationError):
            UserRegister(
                email="test@test.com",
                username="test",
                password="NoNumber",
                full_name="Test"
            )

    def test_short_username(self):
        with pytest.raises(ValidationError):
            UserRegister(
                email="test@test.com",
                username="ab",
                password="TestPass123",
                full_name="Test"
            )


class TestTripSchemaValidation:
    def test_valid_trip(self):
        trip = TripCreate(
            title="Test",
            destination="Tokyo",
            start_date="2025-06-01",
            end_date="2025-06-10"
        )
        assert trip.title == "Test"

    def test_end_before_start(self):
        with pytest.raises(ValidationError):
            TripCreate(
                title="Test",
                destination="Tokyo",
                start_date="2025-06-10",
                end_date="2025-06-01"
            )

    def test_empty_title(self):
        with pytest.raises(ValidationError):
            TripCreate(
                title="",
                destination="Tokyo",
                start_date="2025-06-01",
                end_date="2025-06-10"
            )

    def test_negative_budget(self):
        with pytest.raises(ValidationError):
            TripCreate(
                title="Test",
                destination="Tokyo",
                start_date="2025-06-01",
                end_date="2025-06-10",
                budget=-100
            )


class TestActivitySchemaValidation:
    def test_valid_activity(self):
        act = ActivityCreate(
            trip_id="abc",
            day_number=1,
            title="Visit Temple",
            category="attraction"
        )
        assert act.category == "attraction"

    def test_invalid_category(self):
        with pytest.raises(ValidationError):
            ActivityCreate(
                trip_id="abc",
                day_number=1,
                title="Test",
                category="invalid_category"
            )

    def test_zero_day_number(self):
        with pytest.raises(ValidationError):
            ActivityCreate(
                trip_id="abc",
                day_number=0,
                title="Test",
                category="food"
            )


class TestExpenseSchemaValidation:
    def test_valid_expense(self):
        exp = ExpenseCreate(
            trip_id="abc",
            title="Lunch",
            amount=25.0,
            category="food",
            date="2025-06-01"
        )
        assert exp.amount == 25.0

    def test_zero_amount(self):
        with pytest.raises(ValidationError):
            ExpenseCreate(
                trip_id="abc",
                title="Free",
                amount=0,
                category="food",
                date="2025-06-01"
            )

    def test_negative_amount(self):
        with pytest.raises(ValidationError):
            ExpenseCreate(
                trip_id="abc",
                title="Refund",
                amount=-10,
                category="food",
                date="2025-06-01"
            )
