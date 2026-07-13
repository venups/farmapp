from beanie import PydanticObjectId
from datetime import datetime
from typing import List, Optional, Tuple

from app.models.trip import Trip, TripStatus
from app.models.user import User
from app.models.activity import Activity
from app.models.expense import Expense
from app.models.packing_item import PackingItem
from app.schemas.trip import TripCreate, TripUpdate
from app.utils.exceptions import NotFoundException, ForbiddenException, ConflictException, BadRequestException


async def create_trip(owner_id: str, trip_data: TripCreate) -> Trip:
    """Create a new trip and increment user's trip count."""
    trip = Trip(
        id=PydanticObjectId(),
        title=trip_data.title,
        description=trip_data.description,
        destination=trip_data.destination,
        country=trip_data.country,
        start_date=trip_data.start_date,
        end_date=trip_data.end_date,
        owner_id=PydanticObjectId(owner_id),
        budget=trip_data.budget,
        currency=trip_data.currency,
        tags=trip_data.tags,
        is_public=trip_data.is_public,
        notes=trip_data.notes,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    await trip.insert()

    user = await User.get(PydanticObjectId(owner_id))
    if user:
        user.trip_count = user.trip_count + 1
        await user.save()

    return trip


async def get_trip(trip_id: str, user_id: str) -> Trip:
    """Get a single trip by ID. Verify user is owner or collaborator."""
    trip = await Trip.get(PydanticObjectId(trip_id))
    if not trip:
        raise NotFoundException("Trip not found")

    if trip.owner_id != PydanticObjectId(user_id) and PydanticObjectId(user_id) not in trip.collaborator_ids:
        raise ForbiddenException("You do not have access to this trip")

    return trip


async def get_user_trips(
    user_id: str,
    status: Optional[str] = None,
    page: int = 1,
    per_page: int = 10,
    sort_by: str = "created_at",
    sort_order: str = "desc",
) -> Tuple[List[Trip], int]:
    """Get all trips for a user (as owner or collaborator) with filtering, pagination, sorting."""
    oid = PydanticObjectId(user_id)
    query = Trip.find(
        Trip.owner_id == oid | Trip.collaborator_ids.contains(oid)
    )

    if status:
        query = query.find(Trip.status == status)

    total = await query.count()
    sort_direction = -1 if sort_order == "desc" else 1
    query = query.sort(f"{sort_direction} {sort_by}")
    query = query.skip((page - 1) * per_page).limit(per_page)

    trips = await query.to_list()
    return trips, total


async def update_trip(trip_id: str, user_id: str, trip_data: TripUpdate) -> Trip:
    """Update a trip. Only owner can update."""
    trip = await Trip.get(PydanticObjectId(trip_id))
    if not trip:
        raise NotFoundException("Trip not found")

    if trip.owner_id != PydanticObjectId(user_id):
        raise ForbiddenException("Only the trip owner can update this trip")

    update_data = trip_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(trip, key, value)

    trip.updated_at = datetime.utcnow()
    await trip.save()
    return trip


async def delete_trip(trip_id: str, user_id: str) -> bool:
    """Delete a trip and all associated data. Only owner can delete."""
    trip = await Trip.get(PydanticObjectId(trip_id))
    if not trip:
        raise NotFoundException("Trip not found")

    if trip.owner_id != PydanticObjectId(user_id):
        raise ForbiddenException("Only the trip owner can delete this trip")

    oid = PydanticObjectId(trip_id)
    await Activity.find(Activity.trip_id == oid).delete()
    await Expense.find(Expense.trip_id == oid).delete()
    await PackingItem.find(PackingItem.trip_id == oid).delete()
    await trip.delete()

    user = await User.get(trip.owner_id)
    if user and user.trip_count > 0:
        user.trip_count -= 1
        await user.save()

    return True


async def add_collaborator(trip_id: str, owner_id: str, collaborator_email: str) -> Trip:
    """Add a collaborator to a trip by email. Only owner can add."""
    trip = await Trip.get(PydanticObjectId(trip_id))
    if not trip:
        raise NotFoundException("Trip not found")

    if trip.owner_id != PydanticObjectId(owner_id):
        raise ForbiddenException("Only the trip owner can add collaborators")

    user = await User.find(User.email == collaborator_email).first()
    if not user:
        raise NotFoundException(f"No user found with email {collaborator_email}")

    if user.id == trip.owner_id:
        raise ConflictException("Trip owner cannot be added as a collaborator")

    if user.id in trip.collaborator_ids:
        raise ConflictException("User is already a collaborator")

    trip.collaborator_ids.append(user.id)
    trip.updated_at = datetime.utcnow()
    await trip.save()
    return trip


async def remove_collaborator(trip_id: str, owner_id: str, collaborator_id: str) -> Trip:
    """Remove a collaborator from a trip. Only owner can remove."""
    trip = await Trip.get(PydanticObjectId(trip_id))
    if not trip:
        raise NotFoundException("Trip not found")

    if trip.owner_id != PydanticObjectId(owner_id):
        raise ForbiddenException("Only the trip owner can remove collaborators")

    cid = PydanticObjectId(collaborator_id)
    if cid not in trip.collaborator_ids:
        raise NotFoundException("User is not a collaborator on this trip")

    trip.collaborator_ids.remove(cid)
    trip.updated_at = datetime.utcnow()
    await trip.save()
    return trip


async def get_trip_overview(trip_id: str, user_id: str) -> dict:
    """Get trip overview with stats."""
    trip = await get_trip(trip_id, user_id)
    oid = PydanticObjectId(trip_id)

    activity_count = await Activity.find(Activity.trip_id == oid).count()
    expense_docs = await Expense.find(Expense.trip_id == oid).to_list()
    total_spent = sum(e.amount for e in expense_docs)

    packing_docs = await PackingItem.find(PackingItem.trip_id == oid).to_list()
    total_items = len(packing_docs)
    packed_items = sum(1 for p in packing_docs if p.is_packed)
    packing_progress = (packed_items / total_items * 100) if total_items > 0 else 0

    return {
        "trip": trip,
        "activity_count": activity_count,
        "total_spent": round(total_spent, 2),
        "currency": trip.currency,
        "budget": trip.budget,
        "remaining_budget": round((trip.budget - total_spent), 2) if trip.budget else None,
        "packing_progress": round(packing_progress, 1),
        "total_packing_items": total_items,
        "packed_items": packed_items,
    }
