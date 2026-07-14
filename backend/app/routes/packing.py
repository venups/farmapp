from fastapi import APIRouter, Depends, status
from typing import List
from fastapi import HTTPException

from app.schemas.packing import PackingItemCreate, PackingItemUpdate, PackingItemResponse, PackingListResponse
from app.services import packing_service
from app.utils.auth_deps import get_current_user
from app.utils.exceptions import TripForgeException

router = APIRouter()

@router.post("/", response_model=PackingItemResponse, status_code=status.HTTP_201_CREATED)
async def create_packing_item(data: PackingItemCreate, current_user: dict = Depends(get_current_user)):
    try:
        return await packing_service.create_packing_item(current_user["id"], data)
    except TripForgeException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)

@router.get("/trip/{trip_id}", response_model=PackingListResponse)
async def get_packing_list(trip_id: str, current_user: dict = Depends(get_current_user)):
    try:
        return await packing_service.get_packing_list(trip_id, current_user["id"])
    except TripForgeException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)

@router.put("/{item_id}", response_model=PackingItemResponse)
async def update_packing_item(item_id: str, data: PackingItemUpdate, current_user: dict = Depends(get_current_user)):
    try:
        return await packing_service.update_packing_item(item_id, current_user["id"], data)
    except TripForgeException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)

@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_packing_item(item_id: str, current_user: dict = Depends(get_current_user)):
    try:
        await packing_service.delete_packing_item(item_id, current_user["id"])
        return None
    except TripForgeException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)

@router.patch("/{item_id}/toggle", response_model=PackingItemResponse)
async def toggle_packed(item_id: str, current_user: dict = Depends(get_current_user)):
    try:
        return await packing_service.toggle_packed(item_id, current_user["id"])
    except TripForgeException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)

@router.post("/trip/{trip_id}/bulk", response_model=List[PackingItemResponse], status_code=status.HTTP_201_CREATED)
async def bulk_create_packing_items(trip_id: str, items: List[PackingItemCreate], current_user: dict = Depends(get_current_user)):
    try:
        return await packing_service.bulk_create_packing_items(current_user["id"], trip_id, items)
    except TripForgeException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)
