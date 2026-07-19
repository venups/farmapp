"""All data access goes through Repository so route handlers never touch
the underlying store directly. Dates are stored as ISO YYYY-MM-DD strings;
ids are uuid4 hex strings kept in _id (see DECISIONS_LOG D4/D5)."""

from datetime import date
from typing import Any, Dict, List, Optional
from uuid import uuid4

from .store import DocumentStore


def _public(doc: Dict[str, Any]) -> Dict[str, Any]:
    out = dict(doc)
    out["id"] = out.pop("_id")
    return out


class Repository:
    def __init__(self, store: DocumentStore):
        self.store = store
        self.db = store.db

    # ---- trips ----

    def list_trips(self) -> List[Dict[str, Any]]:
        return [_public(d) for d in self.db.trips.find({}).sort("start_date", 1)]

    def get_trip(self, trip_id: str) -> Optional[Dict[str, Any]]:
        doc = self.db.trips.find_one({"_id": trip_id})
        return _public(doc) if doc else None

    def create_trip(self, data: Dict[str, Any]) -> Dict[str, Any]:
        doc = {"_id": uuid4().hex, **data}
        self.db.trips.insert_one(doc)
        self.store.persist()
        return _public(doc)

    def update_trip(self, trip_id: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        result = self.db.trips.update_one({"_id": trip_id}, {"$set": data})
        if result.matched_count == 0:
            return None
        # prune itinerary days that fell outside the new date range (D8)
        self.db.itinerary_days.delete_many({
            "trip_id": trip_id,
            "$or": [
                {"date": {"$lt": data["start_date"]}},
                {"date": {"$gt": data["end_date"]}},
            ],
        })
        self.store.persist()
        return self.get_trip(trip_id)

    def delete_trip(self, trip_id: str) -> bool:
        result = self.db.trips.delete_one({"_id": trip_id})
        if result.deleted_count == 0:
            return False
        for coll in ("itinerary_days", "budget_items", "checklist_items"):
            self.db[coll].delete_many({"trip_id": trip_id})
        self.store.persist()
        return True

    # ---- itinerary ----

    def list_days(self, trip_id: str) -> List[Dict[str, Any]]:
        return [_public(d) for d in self.db.itinerary_days.find({"trip_id": trip_id}).sort("date", 1)]

    def upsert_day(self, trip_id: str, day: str, activities: List[Dict[str, Any]]) -> Dict[str, Any]:
        existing = self.db.itinerary_days.find_one({"trip_id": trip_id, "date": day})
        if existing:
            self.db.itinerary_days.update_one(
                {"_id": existing["_id"]}, {"$set": {"activities": activities}}
            )
            doc = {**existing, "activities": activities}
        else:
            doc = {"_id": uuid4().hex, "trip_id": trip_id, "date": day, "activities": activities}
            self.db.itinerary_days.insert_one(doc)
        self.store.persist()
        return _public(doc)

    def delete_day(self, trip_id: str, day: str) -> bool:
        result = self.db.itinerary_days.delete_one({"trip_id": trip_id, "date": day})
        if result.deleted_count:
            self.store.persist()
        return bool(result.deleted_count)

    # ---- budget ----

    def list_budget_items(self, trip_id: str) -> List[Dict[str, Any]]:
        return [_public(d) for d in self.db.budget_items.find({"trip_id": trip_id})]

    def create_budget_item(self, trip_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        doc = {"_id": uuid4().hex, "trip_id": trip_id, **data}
        self.db.budget_items.insert_one(doc)
        self.store.persist()
        return _public(doc)

    def update_budget_item(self, trip_id: str, item_id: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        result = self.db.budget_items.update_one(
            {"_id": item_id, "trip_id": trip_id}, {"$set": data}
        )
        if result.matched_count == 0:
            return None
        self.store.persist()
        return _public(self.db.budget_items.find_one({"_id": item_id}))

    def delete_budget_item(self, trip_id: str, item_id: str) -> bool:
        result = self.db.budget_items.delete_one({"_id": item_id, "trip_id": trip_id})
        if result.deleted_count:
            self.store.persist()
        return bool(result.deleted_count)

    # ---- checklist ----

    def list_checklist_items(self, trip_id: str) -> List[Dict[str, Any]]:
        return [_public(d) for d in self.db.checklist_items.find({"trip_id": trip_id})]

    def create_checklist_item(self, trip_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        doc = {"_id": uuid4().hex, "trip_id": trip_id, **data}
        self.db.checklist_items.insert_one(doc)
        self.store.persist()
        return _public(doc)

    def update_checklist_item(self, trip_id: str, item_id: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        if not data:
            doc = self.db.checklist_items.find_one({"_id": item_id, "trip_id": trip_id})
            return _public(doc) if doc else None
        result = self.db.checklist_items.update_one(
            {"_id": item_id, "trip_id": trip_id}, {"$set": data}
        )
        if result.matched_count == 0:
            return None
        self.store.persist()
        return _public(self.db.checklist_items.find_one({"_id": item_id}))

    def delete_checklist_item(self, trip_id: str, item_id: str) -> bool:
        result = self.db.checklist_items.delete_one({"_id": item_id, "trip_id": trip_id})
        if result.deleted_count:
            self.store.persist()
        return bool(result.deleted_count)

    # ---- dashboard ----

    def checklist_progress(self, trip_id: str) -> Dict[str, int]:
        items = list(self.db.checklist_items.find({"trip_id": trip_id}))
        total = len(items)
        done = sum(1 for i in items if i.get("checked"))
        percent = round(done * 100 / total) if total else 0
        return {"total": total, "done": done, "percent": percent}

    def budget_totals(self, trip_id: Optional[str] = None) -> Dict[str, float]:
        query = {"trip_id": trip_id} if trip_id else {}
        items = list(self.db.budget_items.find(query))
        planned = sum(i.get("planned_amount") or 0 for i in items)
        actual = sum(i.get("actual_amount") or 0 for i in items)
        return {"planned": round(planned, 2), "actual": round(actual, 2)}
