from fastapi import APIRouter, HTTPException, status

from app.repositories.budget import BudgetRepository
from app.schemas.budget import BudgetItemCreate, BudgetItemUpdate, BudgetItemResponse


router = APIRouter(prefix="/budget", tags=["Budget"])


@router.post("/", response_model=BudgetItemResponse, status_code=status.HTTP_201_CREATED)
async def create_budget_item(item: BudgetItemCreate):
    return await BudgetRepository.create(item)


@router.get("/trip/{trip_id}", response_model=list[BudgetItemResponse])
async def list_budget_items(trip_id: str):
    return await BudgetRepository.get_by_trip_id(trip_id)


@router.get("/{item_id}", response_model=BudgetItemResponse)
async def get_budget_item(item_id: str):
    item = await BudgetRepository.get_by_id(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Budget item not found")
    return item


@router.patch("/{item_id}", response_model=BudgetItemResponse)
async def update_budget_item(item_id: str, item: BudgetItemUpdate):
    updated = await BudgetRepository.update(item_id, item)
    if not updated:
        raise HTTPException(status_code=404, detail="Budget item not found")
    return updated


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_budget_item(item_id: str):
    deleted = await BudgetRepository.delete(item_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Budget item not found")
