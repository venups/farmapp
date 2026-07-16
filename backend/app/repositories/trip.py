from datetime import date, datetime
from typing import Optional
from bson import ObjectId

from app.db import get_db
from app.schemas.trip import TripCreate, TripUpdate, TripResponse


def _convert_doc(doc):
    """Convert document for Pydantic response."""
    if doc is None:
        return None
    # Convert ObjectId to string
    doc['_id'] = str(doc['_id'])
    # Convert string dates back to date objects
    if isinstance(doc.get('start_date'), str):
        doc['start_date'] = datetime.fromisoformat(doc['start_date']).date()
    if isinstance(doc.get('end_date'), str):
        doc['end_date'] = datetime.fromisoformat(doc['end_date']).date()
    return doc


class TripRepository:
    @classmethod
    def _collection(cls):
        return get_db().trips

    @classmethod
    async def create(cls, trip_data: TripCreate) -> TripResponse:
        document = trip_data.model_dump()
        # Convert date objects to strings for mongomock compatibility
        if isinstance(document.get('start_date'), date):
            document['start_date'] = document['start_date'].isoformat()
        if isinstance(document.get('end_date'), date):
            document['end_date'] = document['end_date'].isoformat()
        
        result = cls._collection().insert_one(document)
        created = cls._collection().find_one({"_id": result.inserted_id})
        return TripResponse(**_convert_doc(created))

    @classmethod
    async def get_all(cls) -> list[TripResponse]:
        cursor = cls._collection().find()
        trips = []
        for doc in cursor:
            trips.append(TripResponse(**_convert_doc(doc)))
        return trips

    @classmethod
    async def get_by_id(cls, trip_id: str) -> Optional[TripResponse]:
        obj_id = ObjectId(trip_id)
        doc = cls._collection().find_one({"_id": obj_id})
        if doc:
            return TripResponse(**_convert_doc(doc))
        return None

    @classmethod
    async def update(cls, trip_id: str, trip_data: TripUpdate) -> Optional[TripResponse]:
        obj_id = ObjectId(trip_id)
        update_data = {k: v for k, v in trip_data.model_dump().items() if v is not None}
        # Convert date objects to strings
        if isinstance(update_data.get('start_date'), date):
            update_data['start_date'] = update_data['start_date'].isoformat()
        if isinstance(update_data.get('end_date'), date):
            update_data['end_date'] = update_data['end_date'].isoformat()
        
        cls._collection().update_one({"_id": obj_id}, {"$set": update_data})
        doc = cls._collection().find_one({"_id": obj_id})
        if doc:
            return TripResponse(**_convert_doc(doc))
        return None

    @classmethod
    async def delete(cls, trip_id: str) -> bool:
        obj_id = ObjectId(trip_id)
        result = cls._collection().delete_one({"_id": obj_id})
        return result.deleted_count > 0
