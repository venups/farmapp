from beanie import Document
from bson import ObjectId
from datetime import datetime
from typing import Optional, List

from app.models.packing_item import PackingItem as PackingItemModel
from app.schemas.packing import PackingItemCreate, PackingListResponse


async def create_packing_item(user_id: str, data: PackingItemCreate) -> PackingItemModel:
    """Create packing item. Verify trip access."""
    from app.services.trip_service import get_trip
    
    await get_trip(data.trip_id, user_id)
    
    packing_item = PackingItemModel(
        trip_id=data.trip_id,
        name=data.name,
        category=data.category,
        quantity=data.quantity,
        is_packed=data.is_packed,
        is_essential=data.is_essential,
        notes=data.notes,
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )
    
    await packing_item.insert()
    return packing_item


async def get_packing_list(trip_id: str, user_id: str) -> PackingListResponse:
    """Get full packing list for a trip with stats."""
    from app.services.trip_service import get_trip
    from app.models.packing_item import PackingItem
    
    await get_trip(trip_id, user_id)
    
    items = await PackingItem.find({"trip_id": trip_id}).to_list()
    
    total_items = len(items)
    packed_items = sum(1 for item in items if item.is_packed)
    progress_percent = (packed_items / total_items * 100) if total_items > 0 else 0
    
    by_category: dict = {}
    for item in items:
        if item.category not in by_category:
            by_category[item.category] = []
        by_category[item.category].append(item)
    
    return PackingListResponse(
        items=items,
        total_items=total_items,
        packed_items=packed_items,
        progress_percent=progress_percent,
        by_category=by_category,
    )


async def update_packing_item(item_id: str, user_id: str, data) -> PackingItemModel:
    """Update packing item. Verify trip access."""
    from app.services.trip_service import get_trip
    
    try:
        packing_item = await PackingItem.find_one({"_id": ObjectId(item_id)})
    except Exception:
        raise Exception("Packing item not found")
    
    if not packing_item:
        raise Exception("Packing item not found")
    
    # Get trip to verify access
    await get_trip(packing_item.trip_id, user_id)
    
    update_data = {}
    for field in ["name", "category", "quantity", "is_packed",
                  "is_essential", "notes"]:
        value = getattr(data, field)
        if value is not None:
            update_data[field] = value
    
    if update_data:
        update_data["updated_at"] = datetime.now()
        await packing_item.update({"$set": update_data})
    
    return packing_item


async def delete_packing_item(item_id: str, user_id: str) -> bool:
    """Delete packing item. Verify trip access."""
    from app.services.trip_service import get_trip
    
    packing_item = await PackingItem.find_one({"_id": ObjectId(item_id)})
    
    if not packing_item:
        raise Exception("Packing item not found")
    
    # Get trip to verify access
    await get_trip(packing_item.trip_id, user_id)
    
    await packing_item.delete()
    return True


async def toggle_packed(item_id: str, user_id: str) -> PackingItemModel:
    """Toggle is_packed status."""
    from app.services.trip_service import get_trip
    
    packing_item = await PackingItem.find_one({"_id": ObjectId(item_id)})
    
    if not packing_item:
        raise Exception("Packing item not found")
    
    # Get trip to verify access
    await get_trip(packing_item.trip_id, user_id)
    
    packing_item.is_packed = not packing_item.is_packed
    packing_item.updated_at = datetime.now()
    
    await packing_item.update({"$set": {"is_packed": packing_item.is_packed, "updated_at": datetime.now()}})
    
    return packing_item


async def bulk_create_packing_items(user_id: str, trip_id: str, items: List[PackingItemCreate]) -> List[PackingItemModel]:
    """Create multiple packing items at once."""
    from app.services.trip_service import get_trip
    
    await get_trip(trip_id, user_id)
    
    packing_items = []
    for item_data in items:
        item = PackingItemModel(
            trip_id=trip_id,
            name=item_data.name,
            category=item_data.category,
            quantity=item_data.quantity,
            is_packed=item_data.is_packed,
            is_essential=item_data.is_essential,
            notes=item_data.notes,
            created_at=datetime.now(),
            updated_at=datetime.now(),
        )
        packing_items.append(item)
    
    await PackingItem.insert_many(packing_items)
    return packing_items
