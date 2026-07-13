from beanie import PydanticObjectId
from datetime import datetime
from typing import List, Optional, Dict, Any

from app.models.trip import Trip
from app.models.expense import Expense
from app.schemas.expense import ExpenseCreate, ExpenseUpdate, ExpenseSummary
from app.utils.exceptions import NotFoundException, ForbiddenException


async def _verify_trip_access(trip_id: str, user_id: str) -> Trip:
    """Verify user has access to a trip."""
    trip = await Trip.get(PydanticObjectId(trip_id))
    if not trip:
        raise NotFoundException("Trip not found")
    if trip.owner_id != PydanticObjectId(user_id) and PydanticObjectId(user_id) not in trip.collaborator_ids:
        raise ForbiddenException("You do not have access to this trip")
    return trip


async def create_expense(user_id: str, data: ExpenseCreate) -> Expense:
    """Create expense. Verify user has trip access."""
    await _verify_trip_access(data.trip_id, user_id)

    expense = Expense(
        id=PydanticObjectId(),
        trip_id=PydanticObjectId(data.trip_id),
        title=data.title,
        amount=data.amount,
        currency=data.currency,
        category=data.category,
        date=data.date,
        paid_by=PydanticObjectId(data.paid_by) if data.paid_by else PydanticObjectId(user_id),
        split_between=[PydanticObjectId(uid) for uid in data.split_between],
        notes=data.notes,
        receipt_url=data.receipt_url,
        is_paid=data.is_paid,
        payment_method=data.payment_method,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    await expense.insert()
    return expense


async def get_trip_expenses(
    trip_id: str,
    user_id: str,
    category: Optional[str] = None,
    sort_by: str = "date",
    sort_order: str = "desc",
) -> List[Expense]:
    """Get all expenses for a trip, optionally filtered by category."""
    await _verify_trip_access(trip_id, user_id)

    query = Expense.find(Expense.trip_id == PydanticObjectId(trip_id))
    if category:
        query = query.find(Expense.category == category)

    direction = -1 if sort_order == "desc" else 1
    query = query.sort(f"{direction} {sort_by}")
    return await query.to_list()


async def get_expense(expense_id: str, user_id: str) -> Expense:
    """Get single expense. Verify trip access."""
    expense = await Expense.get(PydanticObjectId(expense_id))
    if not expense:
        raise NotFoundException("Expense not found")
    await _verify_trip_access(str(expense.trip_id), user_id)
    return expense


async def update_expense(expense_id: str, user_id: str, data: ExpenseUpdate) -> Expense:
    """Update expense. Verify trip access."""
    expense = await Expense.get(PydanticObjectId(expense_id))
    if not expense:
        raise NotFoundException("Expense not found")
    await _verify_trip_access(str(expense.trip_id), user_id)

    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(expense, key, value)

    expense.updated_at = datetime.utcnow()
    await expense.save()
    return expense


async def delete_expense(expense_id: str, user_id: str) -> bool:
    """Delete expense. Verify trip access."""
    expense = await Expense.get(PydanticObjectId(expense_id))
    if not expense:
        raise NotFoundException("Expense not found")
    await _verify_trip_access(str(expense.trip_id), user_id)
    await expense.delete()
    return True


async def get_expense_summary(trip_id: str, user_id: str) -> ExpenseSummary:
    """Calculate expense summary with totals by category, by date, budget remaining."""
    trip = await _verify_trip_access(trip_id, user_id)
    expenses = await Expense.find(Expense.trip_id == PydanticObjectId(trip_id)).to_list()

    total_amount = sum(e.amount for e in expenses)
    currency = trip.currency

    by_category: Dict[str, float] = {}
    for e in expenses:
        cat = e.category.value if hasattr(e.category, "value") else str(e.category)
        by_category[cat] = round(by_category.get(cat, 0) + e.amount, 2)

    by_date: Dict[str, float] = {}
    for e in expenses:
        date_str = str(e.date)
        by_date[date_str] = round(by_date.get(date_str, 0) + e.amount, 2)

    by_date_list = [{"date": d, "amount": a} for d, a in sorted(by_date.items())]

    remaining_budget = None
    if trip.budget is not None:
        remaining_budget = round(trip.budget - total_amount, 2)

    return ExpenseSummary(
        total_amount=round(total_amount, 2),
        currency=currency,
        by_category=by_category,
        by_date=by_date_list,
        budget=trip.budget,
        remaining_budget=remaining_budget,
        expense_count=len(expenses),
    )
