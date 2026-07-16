"""
MongoDB repository implementations for Travel Planner.
"""
from typing import List, Optional
from bson import ObjectId
from pymongo.collection import Collection
from models.schemas import Trip, TripCreate, ItineraryDay, ItineraryDayCreate, BudgetItem, BudgetItemCreate, ChecklistItem, ChecklistItemCreate
from repositories.base import BaseRepository, TripRepository
import asyncio

def run_sync(coroutine):
    """Run a sync function in an async context."""
    try:
        loop = asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    return loop.run_until_complete(coroutine)


class MongoTripRepository(TripRepository):
    """MongoDB implementation of trip repository."""
    
    def __init__(self, collection: Collection):
        self.collection = collection
    
    async def create(self, trip: TripCreate) -> Trip:
        """Create a new trip."""
        trip_dict = trip.model_dump(by_alias=True)
        try:
            # Try async insert (PyMongo async)
            result = await self.collection.insert_one(trip_dict)
            created_trip = await self.collection.find_one({"_id": result.inserted_id})
        except AttributeError:
            # Fallback to sync (mongomock)
            result = self.collection.insert_one(trip_dict)
            created_trip = self.collection.find_one({"_id": result.inserted_id})
        return Trip(**created_trip)
    
    async def get_by_id(self, id: str) -> Optional[Trip]:
        """Get trip by ID."""
        try:
            # Try async find (PyMongo async)
            trip_dict = await self.collection.find_one({"_id": ObjectId(id)})
        except AttributeError:
            # Fallback to sync find (mongomock)
            trip_dict = self.collection.find_one({"_id": ObjectId(id)})
        if trip_dict:
            return Trip(**trip_dict)
        return None
    
    async def get_all(self) -> List[Trip]:
        """Get all trips."""
        trips = []
        try:
            # Try async find (PyMongo async)
            cursor = self.collection.find()
            if hasattr(cursor, '__aiter__'):
                async for trip_dict in cursor:
                    trips.append(Trip(**trip_dict))
            else:
                # Sync cursor
                for trip_dict in cursor:
                    trips.append(Trip(**trip_dict))
        except AttributeError:
            # Fallback to sync find (mongomock)
            for trip_dict in self.collection.find():
                trips.append(Trip(**trip_dict))
        return trips
    
    async def update(self, id: str, trip: TripCreate) -> Optional[Trip]:
        """Update an existing trip."""
        trip_dict = trip.model_dump(by_alias=True)
        try:
            # Try async update (PyMongo async)
            result = await self.collection.update_one(
                {"_id": ObjectId(id)},
                {"$set": trip_dict}
            )
            updated_trip = await self.collection.find_one({"_id": ObjectId(id)})
        except AttributeError:
            # Fallback to sync update (mongomock)
            result = self.collection.update_one(
                {"_id": ObjectId(id)},
                {"$set": trip_dict}
            )
            updated_trip = self.collection.find_one({"_id": ObjectId(id)})
        if result.modified_count > 0:
            return Trip(**updated_trip)
        return None
    
    async def delete(self, id: str) -> bool:
        """Delete a trip."""
        try:
            # Try async delete (PyMongo async)
            result = await self.collection.delete_one({"_id": ObjectId(id)})
        except AttributeError:
            # Fallback to sync delete (mongomock)
            result = self.collection.delete_one({"_id": ObjectId(id)})
        return result.deleted_count > 0


class MongoItineraryDayRepository(BaseRepository):
    """MongoDB implementation of itinerary day repository."""
    
    def __init__(self, collection: Collection):
        self.collection = collection
    
    async def create(self, itinerary_day: ItineraryDayCreate) -> ItineraryDay:
        """Create a new itinerary day."""
        day_dict = itinerary_day.model_dump(by_alias=True)
        try:
            # Try async insert (PyMongo async)
            result = await self.collection.insert_one(day_dict)
            created_day = await self.collection.find_one({"_id": result.inserted_id})
        except AttributeError:
            # Fallback to sync insert (mongomock)
            result = self.collection.insert_one(day_dict)
            created_day = self.collection.find_one({"_id": result.inserted_id})
        return ItineraryDay(**created_day)
    
    async def get_by_id(self, id: str) -> Optional[ItineraryDay]:
        """Get itinerary day by ID."""
        day_dict = await self.collection.find_one({"_id": ObjectId(id)})
        if day_dict:
            return ItineraryDay(**day_dict)
        return None
    
    async def get_all(self) -> List[ItineraryDay]:
        """Get all itinerary days."""
        days = []
        async for day_dict in self.collection.find():
            days.append(ItineraryDay(**day_dict))
        return days
    
    async def get_by_trip_id(self, trip_id: str) -> List[ItineraryDay]:
        """Get itinerary days by trip ID."""
        days = []
        try:
            # Try async find (PyMongo async)
            cursor = self.collection.find({"tripId": trip_id})
            if hasattr(cursor, '__aiter__'):
                async for day_dict in cursor:
                    days.append(ItineraryDay(**day_dict))
            else:
                # Sync cursor
                for day_dict in cursor:
                    days.append(ItineraryDay(**day_dict))
        except AttributeError:
            # Fallback to sync find (mongomock)
            for day_dict in self.collection.find({"tripId": trip_id}):
                days.append(ItineraryDay(**day_dict))
        return days
    
    async def update(self, id: str, itinerary_day: ItineraryDayCreate) -> Optional[ItineraryDay]:
        """Update an existing itinerary day."""
        day_dict = itinerary_day.model_dump(by_alias=True)
        result = await self.collection.update_one(
            {"_id": ObjectId(id)},
            {"$set": day_dict}
        )
        if result.modified_count > 0:
            updated_day = await self.collection.find_one({"_id": ObjectId(id)})
            return ItineraryDay(**updated_day)
        return None
    
    async def delete(self, id: str) -> bool:
        """Delete an itinerary day."""
        result = await self.collection.delete_one({"_id": ObjectId(id)})
        return result.deleted_count > 0


class MongoBudgetItemRepository(BaseRepository):
    """MongoDB implementation of budget item repository."""
    
    def __init__(self, collection: Collection):
        self.collection = collection
    
    async def create(self, budget_item: BudgetItemCreate) -> BudgetItem:
        """Create a new budget item."""
        item_dict = budget_item.model_dump(by_alias=True)
        try:
            # Try async insert (PyMongo async)
            result = await self.collection.insert_one(item_dict)
            created_item = await self.collection.find_one({"_id": result.inserted_id})
        except AttributeError:
            # Fallback to sync insert (mongomock)
            result = self.collection.insert_one(item_dict)
            created_item = self.collection.find_one({"_id": result.inserted_id})
        return BudgetItem(**created_item)
    
    async def get_by_id(self, id: str) -> Optional[BudgetItem]:
        """Get budget item by ID."""
        item_dict = await self.collection.find_one({"_id": ObjectId(id)})
        if item_dict:
            return BudgetItem(**item_dict)
        return None
    
    async def get_all(self) -> List[BudgetItem]:
        """Get all budget items."""
        items = []
        async for item_dict in self.collection.find():
            items.append(BudgetItem(**item_dict))
        return items
    
    async def get_by_trip_id(self, trip_id: str) -> List[BudgetItem]:
        """Get budget items by trip ID."""
        items = []
        try:
            # Try async find (PyMongo async)
            cursor = self.collection.find({"tripId": trip_id})
            if hasattr(cursor, '__aiter__'):
                async for item_dict in cursor:
                    items.append(BudgetItem(**item_dict))
            else:
                # Sync cursor
                for item_dict in cursor:
                    items.append(BudgetItem(**item_dict))
        except AttributeError:
            # Fallback to sync find (mongomock)
            for item_dict in self.collection.find({"tripId": trip_id}):
                items.append(BudgetItem(**item_dict))
        return items
    
    async def update(self, id: str, budget_item: BudgetItemCreate) -> Optional[BudgetItem]:
        """Update an existing budget item."""
        item_dict = budget_item.model_dump(by_alias=True)
        result = await self.collection.update_one(
            {"_id": ObjectId(id)},
            {"$set": item_dict}
        )
        if result.modified_count > 0:
            updated_item = await self.collection.find_one({"_id": ObjectId(id)})
            return BudgetItem(**updated_item)
        return None
    
    async def delete(self, id: str) -> bool:
        """Delete a budget item."""
        result = await self.collection.delete_one({"_id": ObjectId(id)})
        return result.deleted_count > 0


class MongoChecklistItemRepository(BaseRepository):
    """MongoDB implementation of checklist item repository."""
    
    def __init__(self, collection: Collection):
        self.collection = collection
    
    async def create(self, checklist_item: ChecklistItemCreate) -> ChecklistItem:
        """Create a new checklist item."""
        item_dict = checklist_item.model_dump(by_alias=True)
        try:
            # Try async insert (PyMongo async)
            result = await self.collection.insert_one(item_dict)
            created_item = await self.collection.find_one({"_id": result.inserted_id})
        except AttributeError:
            # Fallback to sync insert (mongomock)
            result = self.collection.insert_one(item_dict)
            created_item = self.collection.find_one({"_id": result.inserted_id})
        return ChecklistItem(**created_item)
    
    async def get_by_id(self, id: str) -> Optional[ChecklistItem]:
        """Get checklist item by ID."""
        item_dict = await self.collection.find_one({"_id": ObjectId(id)})
        if item_dict:
            return ChecklistItem(**item_dict)
        return None
    
    async def get_all(self) -> List[ChecklistItem]:
        """Get all checklist items."""
        items = []
        async for item_dict in self.collection.find():
            items.append(ChecklistItem(**item_dict))
        return items
    
    async def get_by_trip_id(self, trip_id: str) -> List[ChecklistItem]:
        """Get checklist items by trip ID."""
        items = []
        try:
            # Try async find (PyMongo async)
            cursor = self.collection.find({"tripId": trip_id})
            if hasattr(cursor, '__aiter__'):
                async for item_dict in cursor:
                    items.append(ChecklistItem(**item_dict))
            else:
                # Sync cursor
                for item_dict in cursor:
                    items.append(ChecklistItem(**item_dict))
        except AttributeError:
            # Fallback to sync find (mongomock)
            for item_dict in self.collection.find({"tripId": trip_id}):
                items.append(ChecklistItem(**item_dict))
        return items
    
    async def update(self, id: str, checklist_item: ChecklistItemCreate) -> Optional[ChecklistItem]:
        """Update an existing checklist item."""
        item_dict = checklist_item.model_dump(by_alias=True)
        result = await self.collection.update_one(
            {"_id": ObjectId(id)},
            {"$set": item_dict}
        )
        if result.modified_count > 0:
            updated_item = await self.collection.find_one({"_id": ObjectId(id)})
            return ChecklistItem(**updated_item)
        return None
    
    async def delete(self, id: str) -> bool:
        """Delete a checklist item."""
        result = await self.collection.delete_one({"_id": ObjectId(id)})
        return result.deleted_count > 0
