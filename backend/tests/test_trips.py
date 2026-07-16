import pytest
from bson import ObjectId
from datetime import date, timedelta

from app.repositories.trip import TripRepository
from app.schemas.trip import TripCreate, TripUpdate


class TestTripCRUD:
    """Test trip creation, retrieval, update, and deletion."""

    @pytest.mark.asyncio
    async def test_create_trip(self, sample_trip_data):
        """Test creating a new trip."""
        trip = await TripRepository.create(TripCreate(**sample_trip_data))
        
        assert trip.name == 'Test Trip'
        assert len(trip.destinations) == 2
        assert trip.destinations[0] == 'Paris'
        assert trip.start_date == sample_trip_data['start_date']
        assert trip.end_date == sample_trip_data['end_date']
        assert ObjectId.is_valid(trip.id)

    @pytest.mark.asyncio
    async def test_get_all_trips(self, sample_trip_data):
        """Test retrieving all trips."""
        # Create multiple trips
        await TripRepository.create(TripCreate(**sample_trip_data))
        
        trip2_data = {
            'name': 'Another Trip',
            'destinations': ['Rome'],
            'start_date': date.today() + timedelta(days=60),
            'end_date': date.today() + timedelta(days=70),
            'notes': None
        }
        await TripRepository.create(TripCreate(**trip2_data))
        
        trips = await TripRepository.get_all()
        
        assert len(trips) == 2

    @pytest.mark.asyncio
    async def test_get_trip_by_id(self, sample_trip_data):
        """Test retrieving a trip by ID."""
        created = await TripRepository.create(TripCreate(**sample_trip_data))
        retrieved = await TripRepository.get_by_id(created.id)
        
        assert retrieved is not None
        assert retrieved.name == 'Test Trip'

    @pytest.mark.asyncio
    async def test_get_nonexistent_trip(self):
        """Test retrieving a trip that doesn't exist."""
        result = await TripRepository.get_by_id('000000000000000000000000')
        assert result is None

    @pytest.mark.asyncio
    async def test_update_trip(self, sample_trip_data):
        """Test updating a trip."""
        created = await TripRepository.create(TripCreate(**sample_trip_data))
        
        update_data = TripUpdate(name='Updated Trip Name', notes='New notes')
        updated = await TripRepository.update(created.id, update_data)
        
        assert updated.name == 'Updated Trip Name'
        assert updated.notes == 'New notes'

    @pytest.mark.asyncio
    async def test_delete_trip(self, sample_trip_data):
        """Test deleting a trip."""
        created = await TripRepository.create(TripCreate(**sample_trip_data))
        
        deleted = await TripRepository.delete(created.id)
        assert deleted is True
        
        # Verify it's gone
        retrieved = await TripRepository.get_by_id(created.id)
        assert retrieved is None

    @pytest.mark.asyncio
    async def test_delete_nonexistent_trip(self):
        """Test deleting a trip that doesn't exist."""
        result = await TripRepository.delete('000000000000000000000000')
        assert result is False


class TestTripValidation:
    """Test trip validation rules."""

    @pytest.mark.asyncio
    async def test_trip_end_date_before_start_date(self, sample_trip_data_invalid):
        """Test that a trip with end date before start date raises an error."""
        with pytest.raises(ValueError) as exc_info:
            TripCreate(**sample_trip_data_invalid)
        
        assert 'End date must be after or equal to start date' in str(exc_info.value)

    @pytest.mark.asyncio
    async def test_trip_empty_name(self):
        """Test that a trip with empty name raises an error."""
        from datetime import date, timedelta
        
        invalid_data = {
            'name': '',
            'destinations': ['Paris'],
            'start_date': date.today() + timedelta(days=30),
            'end_date': date.today() + timedelta(days=40),
            'notes': None
        }
        
        with pytest.raises(Exception):
            TripCreate(**invalid_data)

    @pytest.mark.asyncio
    async def test_trip_empty_destinations(self, sample_trip_data):
        """Test that a trip can have empty destinations list."""
        sample_trip_data['destinations'] = []
        trip = await TripRepository.create(TripCreate(**sample_trip_data))
        
        assert len(trip.destinations) == 0
