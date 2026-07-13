from bson import ObjectId
from datetime import datetime, date as date_type
from typing import Optional, Tuple, List

from app.models.trip import Trip
from app.models.user import User
from app.schemas.trip import TripCreate, TripUpdate


async def create_trip(owner_id: str, trip_data: TripCreate) -> Trip:
    """Create a new trip. Sets owner_id, created_at, updated_at."""
    trip = Trip(
        title=trip_data.title,
        description=trip_data.description,
        destination=trip_data.destination,
        country=trip_data.country,
        start_date=trip_data.start_date,
        end_date=trip_data.end_date,
        budget=trip_data.budget,
        currency=trip_data.currency,
        tags=trip_data.tags,
        is_public=trip_data.is_public,
        notes=trip_data.notes,
        owner_id=owner_id,
        collaborator_ids=[],
        status="planning",
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )
    
    await trip.insert()
    
    # Increment user's trip count
    await User.find_one({"_id": ObjectId(owner_id)}).update({"$inc": {"trip_count": 1}})
    
    return trip


async def get_trip(trip_id: str, user_id: str) -> Trip:
    """Get a single trip by ID. Verify user is owner or collaborator."""
    try:
        trip = await Trip.find_one({"_id": ObjectId(trip_id)})
    except Exception:
        raise Exception("Trip not found")
    
    if not trip:
        raise Exception("Trip not found")
    
    if str(trip.owner_id) != user_id and user_id not in trip.collaborator_ids:
        raise Exception("Access denied")
    
    return trip


async def get_user_trips(
    user_id: str,
    status: Optional[str] = None,
    page: int = 1,
    per_page: int = 10,
    sort_by: str = "created_at",
    sort_order: str = "desc"
) -> Tuple[List[Trip], int]:
    """Get all trips for a user (as owner or collaborator)."""
    skip = (page - 1) * per_page
    
    # Build query - match owner_id OR collaborator_ids
    query = {"$or": [{"owner_id": user_id}, {"collaborator_ids": user_id}]}
    
    if status:
        query["status"] = status
    
    # Build sort
    order = -1 if sort_order == "desc" else 1
    sort_field = f"${sort_by}" if sort_by in ["created_at", "start_date", "title"] else "created_at"
    
    # Get total count
    total = await Trip.find(query).count()
    
    # Get trips with pagination and sorting
    trips = await Trip.find(query).sort((sort_by, order)).skip(skip).limit(per_page).to_list()
    
    return trips, total


async def update_trip(trip_id: str, user_id: str, trip_data: TripUpdate) -> Trip:
    """Update a trip. Only owner can update."""
    trip = await get_trip(trip_id, user_id)
    
    # Only owner can update
    if str(trip.owner_id) != user_id:
        raise Exception("Only owner can update trip")
    
    update_data = {}
    for field in ["title", "description", "destination", "country",
                  "start_date", "end_date", "status", "budget",
                  "currency", "tags", "is_public", "notes", "cover_image_url"]:
        value = getattr(trip_data, field)
        if value is not None:
            update_data[field] = value
    
    if update_data:
        update_data["updated_at"] = datetime.now()
        await trip.update({"$set": update_data})
    
    return trip


async def delete_trip(trip_id: str, user_id: str) -> bool:
    """Delete a trip and all associated data. Only owner can delete."""
    from app.models.activity import Activity
    from app.models.expense import Expense
    from app.models.packing_item import PackingItem
    
    trip = await get_trip(trip_id, user_id)
    
    # Only owner can delete
    if str(trip.owner_id) != user_id:
        raise Exception("Only owner can delete trip")
    
    # Delete associated data
    await Activity.find({"trip_id": str(trip.id)}).delete()
    await Expense.find({"trip_id": str(trip.id)}).delete()
    await PackingItem.find({"trip_id": str(trip.id)}).delete()
    
    # Decrement user's trip count
    await User.find_one({"_id": ObjectId(user_id)}).update({"$inc": {"trip_count": -1}})
    
    # Delete trip
    await trip.delete()
    
    return True


async def add_collaborator(trip_id: str, owner_id: str, collaborator_email: str) -> Trip:
    """Add a collaborator to a trip by email. Only owner can add."""
    trip = await get_trip(trip_id, owner_id)
    
    if str(trip.owner_id) != owner_id:
        raise Exception("Only owner can add collaborators")
    
    collaborator = await User.find_one({"email": collaborator_email})
    if not collaborator:
        raise Exception(f"User with email {collaborator_email} not found")
    
    collaborator_id = str(collaborator.id)
    if collaborator_id in trip.collaborator_ids:
        raise Exception("User is already a collaborator")
    
    await trip.update({"$push": {"collaborator_ids": collaborator_id}})
    
    return await get_trip(trip_id, owner_id)


async def remove_collaborator(trip_id: str, owner_id: str, collaborator_id: str) -> Trip:
    """Remove a collaborator from a trip. Only owner can remove."""
    trip = await get_trip(trip_id, owner_id)
    
    if str(trip.owner_id) != owner_id:
        raise Exception("Only owner can remove collaborators")
    
    await trip.update({"$pull": {"collaborator_ids": collaborator_id}})
    
    return await get_trip(trip_id, owner_id)
