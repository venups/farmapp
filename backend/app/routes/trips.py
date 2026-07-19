from datetime import date
from typing import List

from fastapi import APIRouter, Depends, HTTPException, Response

from ..deps import get_repo, require_trip
from ..repository import Repository
from ..schemas import (
    BudgetItemCreate,
    BudgetItemOut,
    ChecklistItemCreate,
    ChecklistItemOut,
    ChecklistItemUpdate,
    DayActivities,
    ItineraryDayOut,
    TripCreate,
    TripOut,
    trip_status,
)

router = APIRouter(prefix="/api/trips", tags=["trips"])


def _to_trip_out(doc: dict) -> TripOut:
    start = date.fromisoformat(doc["start_date"])
    end = date.fromisoformat(doc["end_date"])
    return TripOut(
        id=doc["id"],
        name=doc["name"],
        destinations=doc["destinations"],
        start_date=start,
        end_date=end,
        notes=doc.get("notes"),
        status=trip_status(start, end),
    )


def _trip_payload(body: TripCreate) -> dict:
    return {
        "name": body.name,
        "destinations": body.destinations,
        "start_date": body.start_date.isoformat(),
        "end_date": body.end_date.isoformat(),
        "notes": body.notes,
    }


@router.get("", response_model=List[TripOut])
def list_trips(repo: Repository = Depends(get_repo)):
    return [_to_trip_out(d) for d in repo.list_trips()]


@router.post("", response_model=TripOut, status_code=201)
def create_trip(body: TripCreate, repo: Repository = Depends(get_repo)):
    return _to_trip_out(repo.create_trip(_trip_payload(body)))


@router.get("/{trip_id}", response_model=TripOut)
def get_trip(trip_id: str, repo: Repository = Depends(get_repo)):
    return _to_trip_out(require_trip(repo, trip_id))


@router.put("/{trip_id}", response_model=TripOut)
def update_trip(trip_id: str, body: TripCreate, repo: Repository = Depends(get_repo)):
    require_trip(repo, trip_id)
    return _to_trip_out(repo.update_trip(trip_id, _trip_payload(body)))


@router.delete("/{trip_id}", status_code=204, response_class=Response)
def delete_trip(trip_id: str, repo: Repository = Depends(get_repo)):
    if not repo.delete_trip(trip_id):
        raise HTTPException(status_code=404, detail="Trip not found")


# ---- itinerary ----

def _check_day_in_range(trip: dict, day: date) -> None:
    if not (trip["start_date"] <= day.isoformat() <= trip["end_date"]):
        raise HTTPException(
            status_code=422,
            detail="Date must fall within the trip's start and end dates",
        )


@router.get("/{trip_id}/itinerary", response_model=List[ItineraryDayOut])
def list_itinerary(trip_id: str, repo: Repository = Depends(get_repo)):
    require_trip(repo, trip_id)
    return repo.list_days(trip_id)


@router.put("/{trip_id}/itinerary/{day}", response_model=ItineraryDayOut)
def upsert_itinerary_day(
    trip_id: str, day: date, body: DayActivities, repo: Repository = Depends(get_repo)
):
    trip = require_trip(repo, trip_id)
    _check_day_in_range(trip, day)
    activities = sorted(
        (a.model_dump() for a in body.activities), key=lambda a: a["order"]
    )
    return repo.upsert_day(trip_id, day.isoformat(), activities)


@router.delete("/{trip_id}/itinerary/{day}", status_code=204, response_class=Response)
def delete_itinerary_day(trip_id: str, day: date, repo: Repository = Depends(get_repo)):
    require_trip(repo, trip_id)
    if not repo.delete_day(trip_id, day.isoformat()):
        raise HTTPException(status_code=404, detail="No itinerary saved for that date")


# ---- budget ----

@router.get("/{trip_id}/budget", response_model=List[BudgetItemOut])
def list_budget(trip_id: str, repo: Repository = Depends(get_repo)):
    require_trip(repo, trip_id)
    return repo.list_budget_items(trip_id)


@router.post("/{trip_id}/budget", response_model=BudgetItemOut, status_code=201)
def create_budget_item(
    trip_id: str, body: BudgetItemCreate, repo: Repository = Depends(get_repo)
):
    require_trip(repo, trip_id)
    return repo.create_budget_item(trip_id, body.model_dump())


@router.put("/{trip_id}/budget/{item_id}", response_model=BudgetItemOut)
def update_budget_item(
    trip_id: str, item_id: str, body: BudgetItemCreate, repo: Repository = Depends(get_repo)
):
    require_trip(repo, trip_id)
    updated = repo.update_budget_item(trip_id, item_id, body.model_dump())
    if updated is None:
        raise HTTPException(status_code=404, detail="Budget item not found")
    return updated


@router.delete("/{trip_id}/budget/{item_id}", status_code=204, response_class=Response)
def delete_budget_item(trip_id: str, item_id: str, repo: Repository = Depends(get_repo)):
    require_trip(repo, trip_id)
    if not repo.delete_budget_item(trip_id, item_id):
        raise HTTPException(status_code=404, detail="Budget item not found")


# ---- checklist ----

@router.get("/{trip_id}/checklist", response_model=List[ChecklistItemOut])
def list_checklist(trip_id: str, repo: Repository = Depends(get_repo)):
    require_trip(repo, trip_id)
    return repo.list_checklist_items(trip_id)


@router.post("/{trip_id}/checklist", response_model=ChecklistItemOut, status_code=201)
def create_checklist_item(
    trip_id: str, body: ChecklistItemCreate, repo: Repository = Depends(get_repo)
):
    require_trip(repo, trip_id)
    return repo.create_checklist_item(trip_id, body.model_dump())


@router.patch("/{trip_id}/checklist/{item_id}", response_model=ChecklistItemOut)
def update_checklist_item(
    trip_id: str, item_id: str, body: ChecklistItemUpdate, repo: Repository = Depends(get_repo)
):
    require_trip(repo, trip_id)
    updated = repo.update_checklist_item(
        trip_id, item_id, body.model_dump(exclude_unset=True)
    )
    if updated is None:
        raise HTTPException(status_code=404, detail="Checklist item not found")
    return updated


@router.delete("/{trip_id}/checklist/{item_id}", status_code=204, response_class=Response)
def delete_checklist_item(trip_id: str, item_id: str, repo: Repository = Depends(get_repo)):
    require_trip(repo, trip_id)
    if not repo.delete_checklist_item(trip_id, item_id):
        raise HTTPException(status_code=404, detail="Checklist item not found")
