from typing import Optional, List, Dict, Any
from beanie import PydanticObjectId
from app.models.expense import Expense
from app.models.trip import Trip
from app.schemas.expense import ExpenseCreate, ExpenseUpdate, ExpenseSummary
from app.utils.exceptions import NotFoundException, ForbiddenException

async def create_expense(user_id: str, data: ExpenseCreate) -> Expense:
    """Create expense. Verify user has trip access."""
    trip = await Trip.get(PydanticObjectId(data.trip_id))
    if not trip:
        raise NotFoundException("Trip not found")
    
    user_oid = PydanticObjectId(user_id)
    if trip.owner_id != user_oid and user_oid not in trip.collaborator_ids:
        raise ForbiddenException("You do not have access to this trip")
    
    expense = Expense(**data.model_dump(), paid_by=data.paid_by or user_oid)
    await expense.insert()
    return expense

async def get_trip_expenses(trip_id: str, user_id: str, category: Optional[str] = None, sort_by: str = "date", sort_order: str = "desc") -> List[Expense]:
    """Get all expenses for a trip, optionally filtered by category."""
    trip = await Trip.get(PydanticObjectId(trip_id))
    if not trip:
        raise NotFoundException("Trip not found")
    
    user_oid = PydanticObjectId(user_id)
    if trip.owner_id != user_oid and user_oid not in trip.collaborator_ids:
        raise ForbiddenException("You do not have access to this trip")
    
    query = Expense.find({"trip_id": trip.id})
    if category:
        query = query.find({"category": category})
    
    direction = -1 if sort_order == "desc" else 1
    return await query.sort({sort_by: direction}).to_list()

async def get_expense(expense_id: str, user_id: str) -> Expense:
    """Get single expense. Verify trip access."""
    expense = await Expense.get(PydanticObjectId(expense_id))
    if not expense:
        raise NotFoundException("Expense not found")
    
    trip = await Trip.get(expense.trip_id)
    user_oid = PydanticObjectId(user_id)
    if trip.owner_id != user_oid and user_oid not in trip.collaborator_ids:
        raise ForbiddenException("You do not have access to this trip")
    
    return expense

async def update_expense(expense_id: str, user_id: str, data: ExpenseUpdate) -> Expense:
    """Update expense. Verify trip access."""
    expense = await get_expense(expense_id, user_id)
    update_data = data.model_dump(exclude_unset=True)
    await expense.set(update_data)
    return expense

async def delete_expense(expense_id: str, user_id: str) -> bool:
    """Delete expense. Verify trip access."""
    expense = await get_expense(expense_id, user_id)
    await expense.delete()
    return True

async def get_expense_summary(trip_id: str, user_id: str) -> ExpenseSummary:
    """Calculate expense summary using MongoDB aggregation."""
    trip = await Trip.get(PydanticObjectId(trip_id))
    if not trip:
        raise NotFoundException("Trip not found")
    
    user_oid = PydanticObjectId(user_id)
    if trip.owner_id != user_oid and user_oid not in trip.collaborator_ids:
        raise ForbiddenException("You do not have access to this trip")
    
    pipeline = [
        {"$match": {"trip_id": trip.id}},
        {
            "$group": {
                "_id": None,
                "total_amount": {"$sum": "$amount"},
                "expense_count": {"$sum": 1},
                "categories": {
                    "$push": {"category": "$category", "amount": "$amount"}
                },
                "dates": {
                    "$push": {"date": "$date", "amount": "$amount"}
                }
            }
        }
    ]
    
    result = await Expense.aggregate(pipeline).to_list()
    if not result:
        return ExpenseSummary(
            total_amount=0.0, 
            currency=trip.currency, 
            by_category={}, 
            by_date=[], 
            budget=trip.budget, 
            remaining_budget=trip.budget, 
            expense_count=0
        )
    
    data = result[0]
    by_category = {}
    for item in data["categories"]:
        cat = item["category"]
        by_category[cat] = by_category.get(cat, 0.0) + item["amount"]
    
    # Group by date for the chart
    by_date_map = {}
    for item in data["dates"]:
        d = str(item["date"])
        by_date_map[d] = by_date_map.get(d, 0.0) + item["amount"]
    
    by_date = [{"date": k, "amount": v} for k, v in sorted(by_date_map.items())]
    
    total = data["total_amount"]
    remaining = (trip.budget - total) if trip.budget is not None else None
    
    return ExpenseSummary(
        total_amount=total,
        currency=trip.currency,
        by_category=by_category,
        by_date=by_date,
        budget=trip.budget,
        remaining_budget=remaining,
        expense_count=data["expense_count"]
    )
