import os
from pymongo import MongoClient
from bson import ObjectId
from typing import List, Optional
from ..schemas.schemas import TripCreate, TripUpdate, ItineraryDayCreate, BudgetItemCreate, ChecklistItemCreate

try:
    import mongomock
    MOCK_MONGO = True
except ImportError:
    MOCK_MONGO = False

class TravelRepository:
    def __init__(self):
        url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
        db_name = os.getenv("DATABASE_NAME", "travel_planner")
        
        if os.getenv("TESTING") == "True" or MOCK_MONGO:
            self.client = mongomock.MongoClient()
        else:
            self.client = MongoClient(url)
            
        self.db = self.client[db_name]

    def _prepare_for_mongo(self, data):
        if isinstance(data, dict):
            return {k: self._prepare_for_mongo(v) for k, v in data.items()}
        elif isinstance(data, list):
            return [self._prepare_for_mongo(i) for i in data]
        elif hasattr(data, "isoformat") and not isinstance(data, str):
            # Convert date/datetime to string for MongoDB compatibility in some environments/mocks
            return data.isoformat()
        return data

    def _id_to_str(self, doc):
        if doc:
            doc["id"] = str(doc.pop("_id"))
        return doc

    # Trips
    def create_trip(self, trip: TripCreate):
        data = self._prepare_for_mongo(trip.model_dump())
        res = self.db.trips.insert_one(data)
        return self._id_to_str(self.db.trips.find_one({"_id": res.inserted_id}))

    def get_trips(self):
        return [self._id_to_str(doc) for doc in self.db.trips.find()]

    def get_trip(self, trip_id: str):
        return self._id_to_str(self.db.trips.find_one({"_id": ObjectId(trip_id)}))

    def update_trip(self, trip_id: str, trip: TripUpdate):
        update_data = {k: v for k, v in trip.model_dump().items() if v is not None}
        update_data = self._prepare_for_mongo(update_data)
        self.db.trips.update_one({"_id": ObjectId(trip_id)}, {"$set": update_data})
        return self.get_trip(trip_id)

    def delete_trip(self, trip_id: str):
        self.db.trips.delete_one({"_id": ObjectId(trip_id)})
        self.db.itinerary_days.delete_many({"trip_id": trip_id})
        self.db.budget_items.delete_many({"trip_id": trip_id})
        self.db.checklist_items.delete_many({"trip_id": trip_id})
        return True

    # Itinerary Days
    def create_itinerary_day(self, trip_id: str, day: ItineraryDayCreate):
        doc = self._prepare_for_mongo(day.model_dump())
        doc["trip_id"] = trip_id
        res = self.db.itinerary_days.insert_one(doc)
        return self._id_to_str(self.db.itinerary_days.find_one({"_id": res.inserted_id}))

    def get_itinerary_days(self, trip_id: str):
        return [self._id_to_str(doc) for doc in self.db.itinerary_days.find({"trip_id": trip_id})]

    def update_itinerary_day(self, day_id: str, day: ItineraryDayCreate):
        data = self._prepare_for_mongo(day.model_dump())
        self.db.itinerary_days.update_one({"_id": ObjectId(day_id)}, {"$set": data})
        return self._id_to_str(self.db.itinerary_days.find_one({"_id": ObjectId(day_id)}))

    def delete_itinerary_day(self, day_id: str):
        self.db.itinerary_days.delete_one({"_id": ObjectId(day_id)})
        return True

    # Budget Items
    def create_budget_item(self, trip_id: str, item: BudgetItemCreate):
        doc = self._prepare_for_mongo(item.model_dump())
        doc["trip_id"] = trip_id
        res = self.db.budget_items.insert_one(doc)
        return self._id_to_str(self.db.budget_items.find_one({"_id": res.inserted_id}))

    def get_budget_items(self, trip_id: str):
        return [self._id_to_str(doc) for doc in self.db.budget_items.find({"trip_id": trip_id})]

    def update_budget_item(self, item_id: str, item: BudgetItemCreate):
        data = self._prepare_for_mongo(item.model_dump())
        self.db.budget_items.update_one({"_id": ObjectId(item_id)}, {"$set": data})
        return self._id_to_str(self.db.budget_items.find_one({"_id": ObjectId(item_id)}))

    def delete_budget_item(self, item_id: str):
        self.db.budget_items.delete_one({"_id": ObjectId(item_id)})
        return True

    # Checklist Items
    def create_checklist_item(self, trip_id: str, item: ChecklistItemCreate):
        doc = self._prepare_for_mongo(item.model_dump())
        doc["trip_id"] = trip_id
        res = self.db.checklist_items.insert_one(doc)
        return self._id_to_str(self.db.checklist_items.find_one({"_id": res.inserted_id}))

    def get_checklist_items(self, trip_id: str):
        return [self._id_to_str(doc) for doc in self.db.checklist_items.find({"trip_id": trip_id})]

    def update_checklist_item(self, item_id: str, item: ChecklistItemCreate):
        data = self._prepare_for_mongo(item.model_dump())
        self.db.checklist_items.update_one({"_id": ObjectId(item_id)}, {"$set": data})
        return self._id_to_str(self.db.checklist_items.find_one({"_id": ObjectId(item_id)}))

    def delete_checklist_item(self, item_id: str):
        self.db.checklist_items.delete_one({"_id": ObjectId(item_id)})
        return True
