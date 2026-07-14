from typing import List
from beanie import PydanticObjectId
from app.models.packing_item import PackingItem
from app.models.trip import Trip
from app.schemas.packing import PackingItemCreate, PackingItemUpdate, PackingListResponse
from app.utils.exceptions import NotFoundException, ForbiddenException

async def create_packing_item(user_id: str, data: PackingItemCreate) -> PackingItem:
    """Create packing item. Verify trip access."""
    trip = await Trip.get(PydanticObjectId(data.trip_id))
    if not trip:
        raise NotFoundException("Trip not found")
    
    user_oid = PydanticObjectId(user_id)
    if trip.owner_id != user_oid and user_oid not in trip.collaborator_ids:
        raise ForbiddenException("You do not have access to this trip")
    
    item = PackingItem(**data.model_dump())
    await item.insert()
    return item

async def get_packing_list(trip_id: str, user_id: str) -> PackingListResponse:
    """Get full packing list for a trip with stats."""
    trip = await Trip.get(PydanticObjectId(trip_id))
    if not trip:
        raise NotFoundException("Trip not found")
    
    user_oid = PydanticObjectId(user_id)
    if trip.owner_id != user_oid and user_oid not in trip.collaborator_ids:
        raise ForbiddenException("You do not have access to this trip")
    
    items = await PackingItem.find({"trip_id": trip.id}).to_list()
    total = len(items)
    packed = len([i for i in items if i.is_packed])
    progress = (packed / total * 100) if total > 0 else 0.0
    
    by_category = {}
    for item in items:
        cat = item.category
        if cat not in by_category:
            by_category[cat] = []
        by_category[cat].append(item)
    
    return PackingListResponse(
        items=items,
        total_items=total,
        packed_items=packed,
        progress_percent=progress,
        by_category=by_category
    )

async def update_packing_item(item_id: str, user_id: str, data: PackingItemUpdate) -> PackingItem:
    """Update packing item. Verify trip access."""
    item = await PackingItem.get(PydanticObjectId(item_id))
    if not item:
        raise NotFoundException("Packing item not found")
    
    trip = await Trip.get(item.trip_id)
    user_oid = PydanticObjectId(user_id)
    if trip.owner_id != user_oid and user_oid not in trip.collaborator_ids:
        raise ForbiddenException("You do not have access to this trip")
    
    update_data = data.model_dump(exclude_unset=True)
    await item.set(update_data)
    return item

async def delete_packing_item(item_id: str, user_id: str) -> bool:
    """Delete packing item. Verify trip access."""
    item = await PackingItem.get(PydanticObjectId(item_id))
    if not item:
        raise NotFoundException("Packing item not found")
    
    trip = await Trip.get(item.trip_id)
    user_oid = PydanticObjectId(user_id)
    if trip.owner_id != user_oid and user_oid not in trip.collaborator_ids:
        raise ForbiddenException("You do not have access to this trip")
    
    await item.delete()
    return True

async def toggle_packed(item_id: str, user_id: str) -> PackingItem:
    """Toggle is_packed status."""
    item = await PackingItem.get(PydanticObjectId(item_id))
    if not item:
        raise NotFoundException("Packing item not found")
    
    trip = await Trip.get(item.trip_id)
    user_oid = PydanticObjectId(user_id)
    if trip.owner_id != user_oid and user_oid not in trip.collaborator_ids:
        raise ForbiddenException("You do not have access to this trip")
    
    item.is_packed = not item.is_packed
    await item.save()
    return item

async def bulk_create_packing_items(user_id: str, trip_id: str, items_data: List[PackingItemCreate]) -> List[PackingItem]:
    """Create multiple packing items at once."""
    trip = await Trip.get(PydanticObjectId(trip_id))
    if not trip:
        raise NotFoundException("Trip not found")
    
    user_oid = PydanticObjectId(user_id)
    if trip.owner_id != user_oid and user_oid not in trip.collaborator_ids:
        raise ForbiddenException("You do not have access to this trip")
    
    created_items = []
    for data in items_data:
        item = PackingItem(**data.model_dump())
        await item.insert()
        created_items.append(item)
    
    return created_items
