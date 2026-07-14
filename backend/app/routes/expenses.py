from fastapi import APIRouter, Depends, status, Query
from typing import Optional, List
from fastapi import HTTPException

from app.schemas.expense import ExpenseCreate, ExpenseUpdate, ExpenseResponse, ExpenseListResponse, ExpenseSummary
from app.services import expense_service
from app.utils.auth_deps import get_current_user
from app.utils.exceptions import TripForgeException

router = APIRouter()

@router.post("/", response_model=ExpenseResponse, status_code=status.HTTP_201_CREATED)
async def create_expense(data: ExpenseCreate, current_user: dict = Depends(get_current_user)):
    try:
        return await expense_service.create_expense(current_user["id"], data)
    except TripForgeException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)

@router.get("/trip/{trip_id}", response_model=ExpenseListResponse)
async def list_expenses(
    trip_id: str, 
    category: Optional[str] = None, 
    sort_by: str = "date", 
    sort_order: str = "desc", 
    current_user: dict = Depends(get_current_user)
):
    try:
        expenses = await expense_service.get_trip_expenses(trip_id, current_user["id"], category, sort_by, sort_order)
        return {
            "expenses": expenses,
            "total": len(expenses)
        }
    except TripForgeException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)

@router.get("/{expense_id}", response_model=ExpenseResponse)
async def get_expense(expense_id: str, current_user: dict = Depends(get_current_user)):
    try:
        return await expense_service.get_expense(expense_id, current_user["id"])
    except TripForgeException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)

@router.put("/{expense_id}", response_model=ExpenseResponse)
async def update_expense(expense_id: str, data: ExpenseUpdate, current_user: dict = Depends(get_current_user)):
    try:
        return await expense_service.update_expense(expense_id, current_user["id"], data)
    except TripForgeException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)

@router.delete("/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_expense(expense_id: str, current_user: dict = Depends(get_current_user)):
    try:
        await expense_service.delete_expense(expense_id, current_user["id"])
        return None
    except TripForgeException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)

@router.get("/trip/{trip_id}/summary", response_model=ExpenseSummary)
async def get_expense_summary(trip_id: str, current_user: dict = Depends(get_current_user)):
    try:
        return await expense_service.get_expense_summary(trip_id, current_user["id"])
    except TripForgeException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)
