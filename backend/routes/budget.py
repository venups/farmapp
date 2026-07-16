"""
Budget API routes.
"""
from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from models.schemas import BudgetItem, BudgetItemCreate
from repositories.mongo import MongoBudgetItemRepository
from main import db

router = APIRouter()

def get_budget_repository():
    """Get budget repository with database connection."""
    return MongoBudgetItemRepository(db["budget_items"])

@router.post("/", response_model=BudgetItem, status_code=status.HTTP_201_CREATED)
async def create_budget_item(budget_item: BudgetItemCreate, repo: MongoBudgetItemRepository = Depends(get_budget_repository)):
    """Create a new budget item."""
    try:
        created_item = await repo.create(budget_item)
        return created_item
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to create budget item: {str(e)}"
        )

@router.get("/", response_model=List[BudgetItem])
async def get_all_budget_items(repo: MongoBudgetItemRepository = Depends(get_budget_repository)):
    """Get all budget items."""
    try:
        items = await repo.get_all()
        return items
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve budget items: {str(e)}"
        )

@router.get("/trip/{trip_id}", response_model=List[BudgetItem])
async def get_budget_items_by_trip(trip_id: str, repo: MongoBudgetItemRepository = Depends(get_budget_repository)):
    """Get budget items for a specific trip."""
    try:
        items = await repo.get_by_trip_id(trip_id)
        return items
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve budget items: {str(e)}"
        )

@router.get("/{item_id}", response_model=BudgetItem)
async def get_budget_item(item_id: str, repo: MongoBudgetItemRepository = Depends(get_budget_repository)):
    """Get a specific budget item by ID."""
    try:
        item = await repo.get_by_id(item_id)
        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Budget item not found"
            )
        return item
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve budget item: {str(e)}"
        )

@router.put("/{item_id}", response_model=BudgetItem)
async def update_budget_item(item_id: str, budget_item: BudgetItemCreate, repo: MongoBudgetItemRepository = Depends(get_budget_repository)):
    """Update an existing budget item."""
    try:
        updated_item = await repo.update(item_id, budget_item)
        if not updated_item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Budget item not found"
            )
        return updated_item
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update budget item: {str(e)}"
        )

@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_budget_item(item_id: str, repo: MongoBudgetItemRepository = Depends(get_budget_repository)):
    """Delete a budget item."""
    try:
        success = await repo.delete(item_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Budget item not found"
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete budget item: {str(e)}"
        )
