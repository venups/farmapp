from fastapi import APIRouter, Depends, status
from typing import List
from pydantic import BaseModel

from app.models.user import User
from app.schemas.packing import PackingItemCreate, PackingItemUpdate
from app.services import packing_service
from app.utils.auth_deps import get_current_user

router = APIRouter()


def _packing_to_dict(item) -> dict:
    return {
        "id": str(item.id),
        "trip_id": str(item.trip_id),
        "name": item.name,
        "category": item.category.value if hasattr(item.category, "value") else str(item.category),
        "quantity": item.quantity,
        "is_packed": item.is_packed,
        "is_essential": item.is_essential,
        "notes": item.notes,
        "created_at": item.created_at,
        "updated_at": item.updated_at,
    }


class BulkCreateRequest(BaseModel):
    items: List[PackingItemCreate]


@router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_packing_item(data: PackingItemCreate, current_user: User = Depends(get_current_user)):
    item = await packing_service.create_packing_item(str(current_user.id), data)
    return _packing_to_dict(item)


@router.get("/trip/{trip_id}", response_model=dict)
async def get_packing_list(trip_id: str, current_user: User = Depends(get_current_user)):
    result = await packing_service.get_packing_list(trip_id, str(current_user.id))
    return result.model_dump()


@router.put("/{item_id}", response_model=dict)
async def update_packing_item(
    item_id: str, data: PackingItemUpdate, current_user: User = Depends(get_current_user)
):
    item = await packing_service.update_packing_item(item_id, str(current_user.id), data)
    return _packing_to_dict(item)


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_packing_item(item_id: str, current_user: User = Depends(get_current_user)):
    await packing_service.delete_packing_item(item_id, str(current_user.id))
    return None


@router.patch("/{item_id}/toggle", response_model=dict)
async def toggle_packed(item_id: str, current_user: User = Depends(get_current_user)):
    item = await packing_service.toggle_packed(item_id, str(current_user.id))
    return _packing_to_dict(item)


@router.post("/trip/{trip_id}/bulk", response_model=List[dict], status_code=status.HTTP_201_CREATED)
async def bulk_create_items(
    trip_id: str, data: BulkCreateRequest, current_user: User = Depends(get_current_user)
):
    items = await packing_service.bulk_create_packing_items(
        str(current_user.id), trip_id, data.items
    )
    return [_packing_to_dict(i) for i in items]
