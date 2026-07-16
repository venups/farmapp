"""
Checklist API routes.
"""
from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from models.schemas import ChecklistItem, ChecklistItemCreate
from repositories.mongo import MongoChecklistItemRepository
from main import db

router = APIRouter()

def get_checklist_repository():
    """Get checklist repository with database connection."""
    return MongoChecklistItemRepository(db["checklist_items"])

@router.post("/", response_model=ChecklistItem, status_code=status.HTTP_201_CREATED)
async def create_checklist_item(checklist_item: ChecklistItemCreate, repo: MongoChecklistItemRepository = Depends(get_checklist_repository)):
    """Create a new checklist item."""
    try:
        created_item = await repo.create(checklist_item)
        return created_item
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to create checklist item: {str(e)}"
        )

@router.get("/", response_model=List[ChecklistItem])
async def get_all_checklist_items(repo: MongoChecklistItemRepository = Depends(get_checklist_repository)):
    """Get all checklist items."""
    try:
        items = await repo.get_all()
        return items
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve checklist items: {str(e)}"
        )

@router.get("/trip/{trip_id}", response_model=List[ChecklistItem])
async def get_checklist_items_by_trip(trip_id: str, repo: MongoChecklistItemRepository = Depends(get_checklist_repository)):
    """Get checklist items for a specific trip."""
    try:
        items = await repo.get_by_trip_id(trip_id)
        return items
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve checklist items: {str(e)}"
        )

@router.get("/{item_id}", response_model=ChecklistItem)
async def get_checklist_item(item_id: str, repo: MongoChecklistItemRepository = Depends(get_checklist_repository)):
    """Get a specific checklist item by ID."""
    try:
        item = await repo.get_by_id(item_id)
        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Checklist item not found"
            )
        return item
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve checklist item: {str(e)}"
        )

@router.put("/{item_id}", response_model=ChecklistItem)
async def update_checklist_item(item_id: str, checklist_item: ChecklistItemCreate, repo: MongoChecklistItemRepository = Depends(get_checklist_repository)):
    """Update an existing checklist item."""
    try:
        updated_item = await repo.update(item_id, checklist_item)
        if not updated_item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Checklist item not found"
            )
        return updated_item
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update checklist item: {str(e)}"
        )

@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_checklist_item(item_id: str, repo: MongoChecklistItemRepository = Depends(get_checklist_repository)):
    """Delete a checklist item."""
    try:
        success = await repo.delete(item_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Checklist item not found"
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete checklist item: {str(e)}"
        )
