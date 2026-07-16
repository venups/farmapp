import pytest
from bson import ObjectId

from app.repositories.budget import BudgetRepository
from app.schemas.budget import BudgetItemCreate, BudgetItemUpdate


class TestBudgetCRUD:
    """Test budget item operations."""

    @pytest.mark.asyncio
    async def test_create_budget_item(self, sample_trip_data):
        """Test creating a new budget item."""
        from app.repositories.trip import TripRepository
        from app.schemas.trip import TripCreate
        
        trip = await TripRepository.create(TripCreate(**sample_trip_data))
        
        item = await BudgetRepository.create(BudgetItemCreate(
            trip_id=trip.id,
            category='lodging',
            description='Hotel Paris',
            planned_amount=1500.00,
            currency='USD'
        ))
        
        assert item.category == 'lodging'
        assert item.planned_amount == 1500.00

    @pytest.mark.asyncio
    async def test_get_budget_items_by_trip(self, sample_trip_data):
        """Test retrieving all budget items for a trip."""
        from app.repositories.trip import TripRepository
        from app.schemas.trip import TripCreate
        
        trip = await TripRepository.create(TripCreate(**sample_trip_data))
        
        # Create multiple items
        categories = ['lodging', 'food', 'transport']
        for cat in categories:
            await BudgetRepository.create(BudgetItemCreate(
                trip_id=trip.id,
                category=cat,
                description=f'{cat} cost',
                planned_amount=100.00
            ))
        
        items = await BudgetRepository.get_by_trip_id(trip.id)
        
        assert len(items) == 3

    @pytest.mark.asyncio
    async def test_update_budget_item(self, sample_trip_data):
        """Test updating a budget item."""
        from app.repositories.trip import TripRepository
        from app.schemas.trip import TripCreate
        
        trip = await TripRepository.create(TripCreate(**sample_trip_data))
        
        item = await BudgetRepository.create(BudgetItemCreate(
            trip_id=trip.id,
            category='food',
            description='Meals',
            planned_amount=500.00
        ))
        
        update_data = BudgetItemUpdate(actual_amount=480.00)
        updated = await BudgetRepository.update(item.id, update_data)
        
        assert updated.actual_amount == 480.00

    @pytest.mark.asyncio
    async def test_delete_budget_item(self, sample_trip_data):
        """Test deleting a budget item."""
        from app.repositories.trip import TripRepository
        from app.schemas.trip import TripCreate
        
        trip = await TripRepository.create(TripCreate(**sample_trip_data))
        
        item = await BudgetRepository.create(BudgetItemCreate(
            trip_id=trip.id,
            category='transport',
            description='Flights',
            planned_amount=800.00
        ))
        
        deleted = await BudgetRepository.delete(item.id)
        assert deleted is True

    @pytest.mark.asyncio
    async def test_invalid_category(self, sample_trip_data):
        """Test that invalid category raises an error."""
        from app.repositories.trip import TripRepository
        from app.schemas.trip import TripCreate
        
        trip = await TripRepository.create(TripCreate(**sample_trip_data))
        
        with pytest.raises(Exception):
            await BudgetRepository.create(BudgetItemCreate(
                trip_id=trip.id,
                category='invalid',
                description='Test',
                planned_amount=100.00
            ))
