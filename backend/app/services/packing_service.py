from beanie import PydanticObjectId
from datetime import datetime
from typing import List, Dict

from app.models.trip import Trip
from app.models.packing_item import PackingItem
from app.schemas.packing import PackingItemCreate, PackingItemUpdate, PackingListResponse, PackingItemResponse
from app.utils.exceptions import NotFoundException, ForbiddenException


async def _verify_trip_access(trip_id: str, user_id: str) -> Trip:
    """Verify user has access to a trip."""
    trip = await Trip.get(PydanticObjectId(trip_id))
    if not trip:
        raise NotFoundException("Trip not found")
    if trip.owner_id != PydanticObjectId(user_id) and PydanticObjectId(user_id) not in trip.collaborator_ids:
        raise ForbiddenException("You do not have access to this trip")
    return trip


async def create_packing_item(user_id: str, data: PackingItemCreate) -> PackingItem:
    """Create packing item. Verify trip access."""
    await _verify_trip_access(data.trip_id, user_id)

    item = PackingItem(
        id=PydanticObjectId(),
        trip_id=PydanticObjectId(data.trip_id),
        name=data.name,
        category=data.category,
        quantity=data.quantity,
        is_packed=data.is_packed,
        is_essential=data.is_essential,
        notes=data.notes,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    await item.insert()
    return item


async def get_packing_list(trip_id: str, user_id: str) -> PackingListResponse:
    """Get full packing list with stats and category grouping."""
    await _verify_trip_access(trip_id, user_id)

    items = await PackingItem.find(PackingItem.trip_id == PydanticObjectId(trip_id)).to_list()

    total_items = len(items)
    packed_items = sum(1 for i in items if i.is_packed)
    progress_percent = round((packed_items / total_items * 100), 1) if total_items > 0 else 0.0

    by_category: Dict[str, List] = {}
    for item in items:
        cat = item.category.value if hasattr(item.category, "value") else str(item.category)
        if cat not in by_category:
            by_category[cat] = []
        by_category[cat].append({
            "id": str(item.id),
            "trip_id": str(item.trip_id),
            "name": item.name,
            "category": cat,
            "quantity": item.quantity,
            "is_packed": item.is_packed,
            "is_essential": item.is_essential,
            "notes": item.notes,
            "created_at": item.created_at,
            "updated_at": item.updated_at,
        })

    return PackingListResponse(
        items=[
            {
                "id": str(i.id),
                "trip_id": str(i.trip_id),
                "name": i.name,
                "category": i.category.value if hasattr(i.category, "value") else str(i.category),
                "quantity": i.quantity,
                "is_packed": i.is_packed,
                "is_essential": i.is_essential,
                "notes": i.notes,
                "created_at": i.created_at,
                "updated_at": i.updated_at,
            }
            for i in items
        ],
        total_items=total_items,
        packed_items=packed_items,
        progress_percent=progress_percent,
        by_category=by_category,
    )


async def update_packing_item(item_id: str, user_id: str, data: PackingItemUpdate) -> PackingItem:
    """Update packing item. Verify trip access."""
    item = await PackingItem.get(PydanticObjectId(item_id))
    if not item:
        raise NotFoundException("Packing item not found")
    await _verify_trip_access(str(item.trip_id), user_id)

    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(item, key, value)

    item.updated_at = datetime.utcnow()
    await item.save()
    return item


async def delete_packing_item(item_id: str, user_id: str) -> bool:
    """Delete packing item. Verify trip access."""
    item = await PackingItem.get(PydanticObjectId(item_id))
    if not item:
        raise NotFoundException("Packing item not found")
    await _verify_trip_access(str(item.trip_id), user_id)
    await item.delete()
    return True


async def toggle_packed(item_id: str, user_id: str) -> PackingItem:
    """Toggle is_packed status."""
    item = await PackingItem.get(PydanticObjectId(item_id))
    if not item:
        raise NotFoundException("Packing item not found")
    await _verify_trip_access(str(item.trip_id), user_id)

    item.is_packed = not item.is_packed
    item.updated_at = datetime.utcnow()
    await item.save()
    return item


async def bulk_create_packing_items(
    user_id: str, trip_id: str, items: List[PackingItemCreate]
) -> List[PackingItem]:
    """Create multiple packing items at once."""
    await _verify_trip_access(trip_id, user_id)

    created = []
    for data in items:
        item = PackingItem(
            id=PydanticObjectId(),
            trip_id=PydanticObjectId(trip_id),
            name=data.name,
            category=data.category,
            quantity=data.quantity,
            is_packed=data.is_packed,
            is_essential=data.is_essential,
            notes=data.notes,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )
        await item.insert()
        created.append(item)

    return created
