from fastapi import APIRouter, Depends, status, Query
from typing import Optional, List

from app.models.user import User
from app.schemas.expense import ExpenseCreate, ExpenseUpdate
from app.services import expense_service
from app.utils.auth_deps import get_current_user

router = APIRouter()


def _expense_to_dict(expense) -> dict:
    return {
        "id": str(expense.id),
        "trip_id": str(expense.trip_id),
        "title": expense.title,
        "amount": expense.amount,
        "currency": expense.currency,
        "category": expense.category.value if hasattr(expense.category, "value") else str(expense.category),
        "date": expense.date,
        "paid_by": str(expense.paid_by) if expense.paid_by else None,
        "split_between": [str(s) for s in expense.split_between],
        "notes": expense.notes,
        "receipt_url": expense.receipt_url,
        "is_paid": expense.is_paid,
        "payment_method": expense.payment_method,
        "created_at": expense.created_at,
        "updated_at": expense.updated_at,
    }


@router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_expense(data: ExpenseCreate, current_user: User = Depends(get_current_user)):
    expense = await expense_service.create_expense(str(current_user.id), data)
    return _expense_to_dict(expense)


@router.get("/trip/{trip_id}", response_model=List[dict])
async def list_expenses(
    trip_id: str,
    category: Optional[str] = Query(None),
    sort_by: str = Query("date"),
    sort_order: str = Query("desc"),
    current_user: User = Depends(get_current_user),
):
    expenses = await expense_service.get_trip_expenses(
        trip_id, str(current_user.id), category, sort_by, sort_order
    )
    return [_expense_to_dict(e) for e in expenses]


@router.get("/{expense_id}", response_model=dict)
async def get_expense(expense_id: str, current_user: User = Depends(get_current_user)):
    expense = await expense_service.get_expense(expense_id, str(current_user.id))
    return _expense_to_dict(expense)


@router.put("/{expense_id}", response_model=dict)
async def update_expense(
    expense_id: str, data: ExpenseUpdate, current_user: User = Depends(get_current_user)
):
    expense = await expense_service.update_expense(expense_id, str(current_user.id), data)
    return _expense_to_dict(expense)


@router.delete("/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_expense(expense_id: str, current_user: User = Depends(get_current_user)):
    await expense_service.delete_expense(expense_id, str(current_user.id))
    return None


@router.get("/trip/{trip_id}/summary", response_model=dict)
async def get_expense_summary(trip_id: str, current_user: User = Depends(get_current_user)):
    summary = await expense_service.get_expense_summary(trip_id, str(current_user.id))
    return summary.model_dump()
