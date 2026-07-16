from typing import Optional
from bson import ObjectId

from app.db import get_db
from app.schemas.checklist import ChecklistItemCreate, ChecklistItemUpdate, ChecklistItemResponse


def _convert_doc(doc):
    """Convert document for Pydantic response."""
    if doc is None:
        return None
    # Convert ObjectId to string
    doc['_id'] = str(doc['_id'])
    return doc


class ChecklistRepository:
    @classmethod
    def _collection(cls):
        return get_db().checklist_items

    @classmethod
    async def create(cls, item_data: ChecklistItemCreate) -> ChecklistItemResponse:
        document = item_data.model_dump()
        
        result = cls._collection().insert_one(document)
        created = cls._collection().find_one({"_id": result.inserted_id})
        return ChecklistItemResponse(**_convert_doc(created))

    @classmethod
    async def get_by_trip_id(cls, trip_id: str) -> list[ChecklistItemResponse]:
        cursor = cls._collection().find({"trip_id": trip_id})
        items = []
        for doc in cursor:
            items.append(ChecklistItemResponse(**_convert_doc(doc)))
        return items

    @classmethod
    async def get_by_id(cls, item_id: str) -> Optional[ChecklistItemResponse]:
        obj_id = ObjectId(item_id)
        doc = cls._collection().find_one({"_id": obj_id})
        if doc:
            return ChecklistItemResponse(**_convert_doc(doc))
        return None

    @classmethod
    async def update(cls, item_id: str, item_data: ChecklistItemUpdate) -> Optional[ChecklistItemResponse]:
        obj_id = ObjectId(item_id)
        update_data = {k: v for k, v in item_data.model_dump().items() if v is not None}
        
        cls._collection().update_one({"_id": obj_id}, {"$set": update_data})
        doc = cls._collection().find_one({"_id": obj_id})
        if doc:
            return ChecklistItemResponse(**_convert_doc(doc))
        return None

    @classmethod
    async def delete(cls, item_id: str) -> bool:
        obj_id = ObjectId(item_id)
        result = cls._collection().delete_one({"_id": obj_id})
        return result.deleted_count > 0
