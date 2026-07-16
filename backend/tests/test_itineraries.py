import pytest
from bson import ObjectId
from datetime import date, timedelta

from app.repositories.itinerary import ItineraryRepository
from app.schemas.itinerary import ItineraryDayCreate, ItineraryDayUpdate, Activity


@pytest.fixture
def sample_itinerary_data(sample_trip_data):
    from app.repositories.trip import TripRepository
    
    # Create a trip first
    created = TripRepository.create(TripCreate(**sample_trip_data))
    
    return {
        'trip_id': None,  # Will be set after trip creation
        'date': date.today() + timedelta(days=31),
        'activities': [
            Activity(time='09:00', description='Breakfast at café'),
            Activity(description='Visit museum'),
        ]
    }


class TestItineraryCRUD:
    """Test itinerary day operations."""

    @pytest.mark.asyncio
    async def test_create_itinerary_day(self, sample_trip_data):
        """Test creating a new itinerary day."""
        from app.repositories.trip import TripRepository
        from app.schemas.trip import TripCreate
        
        trip = await TripRepository.create(TripCreate(**sample_trip_data))
        
        day_data = ItineraryDayCreate(
            trip_id=trip.id,
            date=date.today() + timedelta(days=31),
            activities=[Activity(description='Test activity')]
        )
        
        day = await ItineraryRepository.create(day_data)
        
        assert day.trip_id == trip.id
        assert len(day.activities) == 1

    @pytest.mark.asyncio
    async def test_get_itinerary_days_by_trip(self, sample_trip_data):
        """Test retrieving all itinerary days for a trip."""
        from app.repositories.trip import TripRepository
        from app.schemas.trip import TripCreate
        
        trip = await TripRepository.create(TripCreate(**sample_trip_data))
        
        # Create multiple days
        for i in range(3):
            day_data = ItineraryDayCreate(
                trip_id=trip.id,
                date=date.today() + timedelta(days=31+i),
                activities=[]
            )
            await ItineraryRepository.create(day_data)
        
        days = await ItineraryRepository.get_by_trip_id(trip.id)
        
        assert len(days) == 3

    @pytest.mark.asyncio
    async def test_update_itinerary_day(self, sample_trip_data):
        """Test updating an itinerary day."""
        from app.repositories.trip import TripRepository
        from app.schemas.trip import TripCreate
        
        trip = await TripRepository.create(TripCreate(**sample_trip_data))
        
        day = await ItineraryRepository.create(ItineraryDayCreate(
            trip_id=trip.id,
            date=date.today() + timedelta(days=31),
            activities=[]
        ))
        
        update_data = ItineraryDayUpdate(activities=[Activity(description='Updated')])
        updated = await ItineraryRepository.update(day.id, update_data)
        
        assert len(updated.activities) == 1

    @pytest.mark.asyncio
    async def test_delete_itinerary_day(self, sample_trip_data):
        """Test deleting an itinerary day."""
        from app.repositories.trip import TripRepository
        from app.schemas.trip import TripCreate
        
        trip = await TripRepository.create(TripCreate(**sample_trip_data))
        
        day = await ItineraryRepository.create(ItineraryDayCreate(
            trip_id=trip.id,
            date=date.today() + timedelta(days=31),
            activities=[]
        ))
        
        deleted = await ItineraryRepository.delete(day.id)
        assert deleted is True
