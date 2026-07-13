from fastapi import APIRouter, Depends, HTTPException, status
from typing import Optional

from app.schemas.expense import ExpenseCreate, ExpenseUpdate, ExpenseResponse, ExpenseListResponse, ExpenseSummary
from app.services.expense_service import create_expense, get_trip_expenses, get_expense, update_expense, delete_expense, get_expense_summary
from app.utils.auth_deps import get_current_user

router = APIRouter()


@router.post("/", response_model=ExpenseResponse, status_code=status.HTTP_201_CREATED)
async def create_expense_route(data: ExpenseCreate, current_user = Depends(get_current_user)):
    """Create a new expense."""
    try:
        expense = await create_expense(str(current_user.id), data)
        return expense
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/trip/{trip_id}", response_model=ExpenseListResponse)
async def list_expenses(
    trip_id: str,
    category: Optional[str] = None,
    sort_by: str = "date",
    sort_order: str = "desc",
    page: int = 1,
    per_page: int = 20,
    current_user = Depends(get_current_user)
):
    """Get all expenses for a trip."""
    try:
        expenses = await get_trip_expenses(trip_id, str(current_user.id), category, sort_by, sort_order)
        return ExpenseListResponse(expenses=expenses, total=len(expenses), page=page, per_page=per_page)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{expense_id}", response_model=ExpenseResponse)
async def get_expense_route(expense_id: str, current_user = Depends(get_current_user)):
    """Get single expense."""
    try:
        expense = await get_expense(expense_id, str(current_user.id))
        return expense
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.put("/{expense_id}", response_model=ExpenseResponse)
async def update_expense_route(expense_id: str, data: ExpenseUpdate, current_user = Depends(get_current_user)):
    """Update expense."""
    try:
        expense = await update_expense(expense_id, str(current_user.id), data)
        return expense
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=403, detail=str(e))


@router.delete("/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_expense_route(expense_id: str, current_user = Depends(get_current_user)):
    """Delete expense."""
    try:
        await delete_expense(expense_id, str(current_user.id))
        return None
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=403, detail=str(e))


@router.get("/trip/{trip_id}/summary", response_model=ExpenseSummary)
async def get_expense_summary_route(trip_id: str, current_user = Depends(get_current_user)):
    """Get expense summary for a trip."""
    try:
        summary = await get_expense_summary(trip_id, str(current_user.id))
        return summary
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))
