"""
Repository interfaces for database operations.
"""
from abc import ABC, abstractmethod
from typing import List, Optional
from models.schemas import Trip, TripCreate, ItineraryDay, ItineraryDayCreate, BudgetItem, BudgetItemCreate, ChecklistItem, ChecklistItemCreate


class BaseRepository(ABC):
    """Base repository interface."""
    
    @abstractmethod
    async def create(self, item: object) -> object:
        pass
    
    @abstractmethod
    async def get_by_id(self, id: str) -> Optional[object]:
        pass
    
    @abstractmethod
    async def get_all(self) -> List[object]:
        pass
    
    @abstractmethod
    async def update(self, id: str, item: object) -> Optional[object]:
        pass
    
    @abstractmethod
    async def delete(self, id: str) -> bool:
        pass


class TripRepository(BaseRepository):
    """Trip repository interface."""
    
    @abstractmethod
    async def get_by_trip_id(self, trip_id: str) -> List[object]:
        """Get items by trip ID."""
        pass
