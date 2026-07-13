from fastapi import APIRouter, Depends, HTTPException, status
from typing import List

from app.schemas.packing import PackingItemCreate, PackingItemUpdate, PackingItemResponse, PackingListResponse
from app.services.packing_service import create_packing_item, get_packing_list, update_packing_item, delete_packing_item, toggle_packed, bulk_create_packing_items
from app.utils.auth_deps import get_current_user

router = APIRouter()


@router.post("/", response_model=PackingItemResponse, status_code=status.HTTP_201_CREATED)
async def create_packing_item_route(data: PackingItemCreate, current_user = Depends(get_current_user)):
    """Create a new packing item."""
    try:
        item = await create_packing_item(str(current_user.id), data)
        return item
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/trip/{trip_id}", response_model=PackingListResponse)
async def get_packing_list_route(trip_id: str, current_user = Depends(get_current_user)):
    """Get packing list for a trip."""
    try:
        list_response = await get_packing_list(trip_id, str(current_user.id))
        return list_response
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{item_id}", response_model=PackingItemResponse)
async def update_packing_item_route(item_id: str, data: PackingItemUpdate, current_user = Depends(get_current_user)):
    """Update packing item."""
    try:
        item = await update_packing_item(item_id, str(current_user.id), data)
        return item
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=403, detail=str(e))


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_packing_item_route(item_id: str, current_user = Depends(get_current_user)):
    """Delete packing item."""
    try:
        await delete_packing_item(item_id, str(current_user.id))
        return None
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=403, detail=str(e))


@router.patch("/{item_id}/toggle", response_model=PackingItemResponse)
async def toggle_packed_route(item_id: str, current_user = Depends(get_current_user)):
    """Toggle packing item status."""
    try:
        item = await toggle_packed(item_id, str(current_user.id))
        return item
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=403, detail=str(e))


@router.post("/trip/{trip_id}/bulk", response_model=List[PackingItemResponse])
async def bulk_create_packing_items_route(trip_id: str, items: List[PackingItemCreate], current_user = Depends(get_current_user)):
    """Bulk create packing items."""
    try:
        item_list = await bulk_create_packing_items(str(current_user.id), trip_id, items)
        return item_list
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
