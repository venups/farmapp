from bson import ObjectId
from datetime import datetime, date as date_type
from typing import Optional, List

from app.models.expense import Expense
from app.schemas.expense import ExpenseCreate, ExpenseUpdate, ExpenseSummary


async def create_expense(user_id: str, data: ExpenseCreate) -> Expense:
    """Create expense. Verify user has trip access."""
    from app.services.trip_service import get_trip
    
    # Get trip to verify access
    await get_trip(data.trip_id, user_id)
    
    if not data.paid_by:
        data.paid_by = user_id
    
    expense = Expense(
        trip_id=data.trip_id,
        title=data.title,
        amount=data.amount,
        currency=data.currency,
        category=data.category,
        date=data.date,
        paid_by=data.paid_by,
        split_between=data.split_between,
        notes=data.notes,
        receipt_url=data.receipt_url,
        is_paid=data.is_paid,
        payment_method=data.payment_method,
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )
    
    await expense.insert()
    return expense


async def get_trip_expenses(
    trip_id: str,
    user_id: str,
    category: Optional[str] = None,
    sort_by: str = "date",
    sort_order: str = "desc"
) -> List[Expense]:
    """Get all expenses for a trip, optionally filtered by category."""
    from app.services.trip_service import get_trip
    
    await get_trip(trip_id, user_id)
    
    query = {"trip_id": trip_id}
    if category:
        query["category"] = category
    
    order = -1 if sort_order == "desc" else 1
    expenses = await Expense.find(query).sort((sort_by, order)).to_list()
    return expenses


async def get_expense(expense_id: str, user_id: str) -> Expense:
    """Get single expense. Verify trip access."""
    from app.services.trip_service import get_trip
    
    try:
        expense = await Expense.find_one({"_id": ObjectId(expense_id)})
    except Exception:
        raise Exception("Expense not found")
    
    if not expense:
        raise Exception("Expense not found")
    
    # Verify access to parent trip
    await get_trip(expense.trip_id, user_id)
    
    return expense


async def update_expense(expense_id: str, user_id: str, data: ExpenseUpdate) -> Expense:
    """Update expense. Verify trip access."""
    from app.services.trip_service import get_trip
    
    expense = await get_expense(expense_id, user_id)
    
    # Get trip to verify access
    await get_trip(expense.trip_id, user_id)
    
    update_data = {}
    for field in ["title", "amount", "currency", "category",
                  "date", "paid_by", "split_between", "notes",
                  "receipt_url", "is_paid", "payment_method"]:
        value = getattr(data, field)
        if value is not None:
            update_data[field] = value
    
    if update_data:
        update_data["updated_at"] = datetime.now()
        await expense.update({"$set": update_data})
    
    return expense


async def delete_expense(expense_id: str, user_id: str) -> bool:
    """Delete expense. Verify trip access."""
    from app.services.trip_service import get_trip
    
    expense = await get_expense(expense_id, user_id)
    
    # Get trip to verify access
    await get_trip(expense.trip_id, user_id)
    
    await expense.delete()
    return True


async def get_expense_summary(trip_id: str, user_id: str) -> ExpenseSummary:
    """Calculate expense summary: total, by category, by date, budget remaining."""
    from app.services.trip_service import get_trip
    from app.models.expense import Expense
    
    await get_trip(trip_id, user_id)
    
    # Get all expenses for trip
    expenses = await Expense.find({"trip_id": trip_id}).to_list()
    
    # Calculate totals
    total_amount = sum(e.amount for e in expenses)
    
    # By category using aggregation pipeline
    by_category_result = await Expense.find({"trip_id": trip_id}).group(
        {"_id": "$category", "total": {"$sum": "$amount"}}
    ).to_list()
    
    by_category = {item["_id"]: item["total"] for item in by_category_result}
    
    # By date
    by_date_result = await Expense.find({"trip_id": trip_id}).group(
        {"_id": {"$dateToString": {"format": "%Y-%m-%d", "date": "$date"}}, "amount": {"$sum": "$amount"}}
    ).to_list()
    
    by_date = [{"date": str(item["_id"]), "amount": item["amount"]} for item in by_date_result]
    
    # Get trip budget
    from app.models.trip import Trip
    trip = await Trip.find_one({"_id": ObjectId(trip_id)})
    
    remaining_budget = None
    if trip and trip.budget is not None:
        remaining_budget = trip.budget - total_amount
    
    return ExpenseSummary(
        total_amount=total_amount,
        currency="USD",
        by_category=by_category,
        by_date=by_date,
        budget=trip.budget if trip else None,
        remaining_budget=remaining_budget,
        expense_count=len(expenses),
    )
