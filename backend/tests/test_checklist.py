import pytest
from bson import ObjectId

from app.repositories.checklist import ChecklistRepository
from app.schemas.checklist import ChecklistItemCreate, ChecklistItemUpdate


class TestChecklistCRUD:
    """Test checklist item operations."""

    @pytest.mark.asyncio
    async def test_create_checklist_item(self, sample_trip_data):
        """Test creating a new checklist item."""
        from app.repositories.trip import TripRepository
        from app.schemas.trip import TripCreate
        
        trip = await TripRepository.create(TripCreate(**sample_trip_data))
        
        item = await ChecklistRepository.create(ChecklistItemCreate(
            trip_id=trip.id,
            text='Pack passport',
            item_type='packing'
        ))
        
        assert item.text == 'Pack passport'
        assert item.item_type == 'packing'
        assert item.checked is False

    @pytest.mark.asyncio
    async def test_get_checklist_items_by_trip(self, sample_trip_data):
        """Test retrieving all checklist items for a trip."""
        from app.repositories.trip import TripRepository
        from app.schemas.trip import TripCreate
        
        trip = await TripRepository.create(TripCreate(**sample_trip_data))
        
        # Create multiple items
        for text in ['Pack clothes', 'Book tickets', 'Check passport']:
            await ChecklistRepository.create(ChecklistItemCreate(
                trip_id=trip.id,
                text=text,
                item_type='packing' if 'Pack' in text else 'prep'
            ))
        
        items = await ChecklistRepository.get_by_trip_id(trip.id)
        
        assert len(items) == 3

    @pytest.mark.asyncio
    async def test_update_checklist_item_toggle(self, sample_trip_data):
        """Test toggling a checklist item."""
        from app.repositories.trip import TripRepository
        from app.schemas.trip import TripCreate
        
        trip = await TripRepository.create(TripCreate(**sample_trip_data))
        
        item = await ChecklistRepository.create(ChecklistItemCreate(
            trip_id=trip.id,
            text='Test item',
            item_type='packing'
        ))
        
        update_data = ChecklistItemUpdate(checked=True)
        updated = await ChecklistRepository.update(item.id, update_data)
        
        assert updated.checked is True

    @pytest.mark.asyncio
    async def test_delete_checklist_item(self, sample_trip_data):
        """Test deleting a checklist item."""
        from app.repositories.trip import TripRepository
        from app.schemas.trip import TripCreate
        
        trip = await TripRepository.create(TripCreate(**sample_trip_data))
        
        item = await ChecklistRepository.create(ChecklistItemCreate(
            trip_id=trip.id,
            text='Delete me',
            item_type='prep'
        ))
        
        deleted = await ChecklistRepository.delete(item.id)
        assert deleted is True
