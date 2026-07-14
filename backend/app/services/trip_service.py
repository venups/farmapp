from typing import Optional, List, Tuple
from beanie import PydanticObjectId
from app.models.trip import Trip
from app.models.user import User
from app.schemas.trip import TripCreate, TripUpdate
from app.utils.exceptions import NotFoundException, ForbiddenException, ConflictException

async def create_trip(owner_id: str, trip_data: TripCreate) -> Trip:
    """Create a new trip. Sets owner_id, created_at, updated_at. Also increments User.trip_count."""
    user = await User.get(PydanticObjectId(owner_id))
    if not user:
        raise NotFoundException("User not found")
    
    trip = Trip(**trip_data.model_dump(), owner_id=PydanticObjectId(owner_id))
    await trip.insert()
    
    user.trip_count += 1
    await user.save()
    
    return trip

async def get_trip(trip_id: str, user_id: str) -> Trip:
    """Get a single trip by ID. Verify user is owner or collaborator."""
    trip = await Trip.get(PydanticObjectId(trip_id))
    if not trip:
        raise NotFoundException("Trip not found")
    
    user_oid = PydanticObjectId(user_id)
    if trip.owner_id != user_oid and user_oid not in trip.collaborator_ids:
        raise ForbiddenException("You do not have access to this trip")
    
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
    user_oid = PydanticObjectId(user_id)
    query = Trip.find_one_of([
        {"owner_id": user_oid},
        {"collaborator_ids": {"$in": [user_oid]}}
    ])
    
    if status:
        query = query.find({"status": status})
    
    total_count = await query.count()
    
    # Sorting
    direction = -1 if sort_order == "desc" else 1
    trips = await query.sort({sort_by: direction}).skip((page - 1) * per_page).limit(per_page).to_list()
    
    return trips, total_count

async def update_trip(trip_id: str, user_id: str, trip_data: TripUpdate) -> Trip:
    """Update a trip. Only owner can update."""
    trip = await Trip.get(PydanticObjectId(trip_id))
    if not trip:
        raise NotFoundException("Trip not found")
    
    if trip.owner_id != PydanticObjectId(user_id):
        raise ForbiddenException("Only the owner can update this trip")
    
    update_data = trip_data.model_dump(exclude_unset=True)
    await trip.set(update_data)
    return trip

async def delete_trip(trip_id: str, user_id: str) -> bool:
    """Delete a trip and all associated data. Only owner can delete."""
    trip = await Trip.get(PydanticObjectId(trip_id))
    if not trip:
        raise NotFoundException("Trip not found")
    
    if trip.owner_id != PydanticObjectId(user_id):
        raise ForbiddenException("Only the owner can delete this trip")
    
    # Delete associated data
    from app.models.activity import Activity
    from app.models.expense import Expense
    from app.models.packing_item import PackingItem
    
    await Activity.find({"trip_id": trip.id}).delete()
    await Expense.find({"trip_id": trip.id}).delete()
    await PackingItem.find({"trip_id": trip.id}).delete()
    
    # Decrement user trip count
    user = await User.get(trip.owner_id)
    if user:
        user.trip_count = max(0, user.trip_count - 1)
        await user.save()
    
    await trip.delete()
    return True

async def add_collaborator(trip_id: str, owner_id: str, collaborator_email: str) -> Trip:
    """Add a collaborator to a trip by their email."""
    trip = await Trip.get(PydanticObjectId(trip_id))
    if not trip:
        raise NotFoundException("Trip not found")
    
    if trip.owner_id != PydanticObjectId(owner_id):
        raise ForbiddenException("Only the owner can add collaborators")
    
    collaborator = await User.find_one({"email": collaborator_email})
    if not collaborator:
        raise NotFoundException("User with this email not found")
    
    if collaborator.id in trip.collaborator_ids:
        raise ConflictException("User is already a collaborator")
    
    trip.collaborator_ids.append(collaborator.id)
    await trip.save()
    return trip

async def remove_collaborator(trip_id: str, owner_id: str, collaborator_id: str) -> Trip:
    """Remove a collaborator from a trip."""
    trip = await Trip.get(PydanticObjectId(trip_id))
    if not trip:
        raise NotFoundException("Trip not found")
    
    if trip.owner_id != PydanticObjectId(owner_id):
        raise ForbiddenException("Only the owner can remove collaborators")
    
    collab_oid = PydanticObjectId(collaborator_id)
    if collab_oid not in trip.collaborator_ids:
        raise NotFoundException("Collaborator not found on this trip")
    
    trip.collaborator_ids.remove(collab_oid)
    await trip.save()
    return trip
