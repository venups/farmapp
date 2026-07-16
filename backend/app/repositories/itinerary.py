from datetime import date, datetime
from typing import Optional
from bson import ObjectId

from app.db import get_db
from app.schemas.itinerary import ItineraryDayCreate, ItineraryDayUpdate, ItineraryDayResponse


def _convert_doc(doc):
    """Convert document for Pydantic response."""
    if doc is None:
        return None
    # Convert ObjectId to string
    doc['_id'] = str(doc['_id'])
    # Convert string date back to date object
    if isinstance(doc.get('date'), str):
        doc['date'] = datetime.fromisoformat(doc['date']).date()
    return doc


class ItineraryRepository:
    @classmethod
    def _collection(cls):
        return get_db().itineraries

    @classmethod
    async def create(cls, day_data: ItineraryDayCreate) -> ItineraryDayResponse:
        document = day_data.model_dump()
        # Convert date to string for mongomock compatibility
        if isinstance(document.get('date'), date):
            document['date'] = document['date'].isoformat()
        
        result = cls._collection().insert_one(document)
        created = cls._collection().find_one({"_id": result.inserted_id})
        return ItineraryDayResponse(**_convert_doc(created))

    @classmethod
    async def get_by_trip_id(cls, trip_id: str) -> list[ItineraryDayResponse]:
        cursor = cls._collection().find({"trip_id": trip_id}).sort("date", 1)
        days = []
        for doc in cursor:
            days.append(ItineraryDayResponse(**_convert_doc(doc)))
        return days

    @classmethod
    async def get_by_id(cls, day_id: str) -> Optional[ItineraryDayResponse]:
        obj_id = ObjectId(day_id)
        doc = cls._collection().find_one({"_id": obj_id})
        if doc:
            return ItineraryDayResponse(**_convert_doc(doc))
        return None

    @classmethod
    async def update(cls, day_id: str, day_data: ItineraryDayUpdate) -> Optional[ItineraryDayResponse]:
        obj_id = ObjectId(day_id)
        update_data = {k: v for k, v in day_data.model_dump().items() if v is not None}
        # Convert date to string
        if isinstance(update_data.get('date'), date):
            update_data['date'] = update_data['date'].isoformat()
        
        cls._collection().update_one({"_id": obj_id}, {"$set": update_data})
        doc = cls._collection().find_one({"_id": obj_id})
        if doc:
            return ItineraryDayResponse(**_convert_doc(doc))
        return None

    @classmethod
    async def delete(cls, day_id: str) -> bool:
        obj_id = ObjectId(day_id)
        result = cls._collection().delete_one({"_id": obj_id})
        return result.deleted_count > 0
