from fastapi import APIRouter, HTTPException, status

from app.repositories.checklist import ChecklistRepository
from app.schemas.checklist import ChecklistItemCreate, ChecklistItemUpdate, ChecklistItemResponse


router = APIRouter(prefix="/checklist", tags=["Checklist"])


@router.post("/", response_model=ChecklistItemResponse, status_code=status.HTTP_201_CREATED)
async def create_checklist_item(item: ChecklistItemCreate):
    return await ChecklistRepository.create(item)


@router.get("/trip/{trip_id}", response_model=list[ChecklistItemResponse])
async def list_checklist_items(trip_id: str):
    return await ChecklistRepository.get_by_trip_id(trip_id)


@router.get("/{item_id}", response_model=ChecklistItemResponse)
async def get_checklist_item(item_id: str):
    item = await ChecklistRepository.get_by_id(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Checklist item not found")
    return item


@router.patch("/{item_id}", response_model=ChecklistItemResponse)
async def update_checklist_item(item_id: str, item: ChecklistItemUpdate):
    updated = await ChecklistRepository.update(item_id, item)
    if not updated:
        raise HTTPException(status_code=404, detail="Checklist item not found")
    return updated


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_checklist_item(item_id: str):
    deleted = await ChecklistRepository.delete(item_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Checklist item not found")
