from datetime import date

from fastapi import APIRouter, Depends

from ..deps import get_repo
from ..repository import Repository
from ..schemas import DashboardOut, trip_status

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("", response_model=DashboardOut)
def dashboard(repo: Repository = Depends(get_repo)):
    status_counts = {"Upcoming": 0, "Active": 0, "Completed": 0}
    trips = []
    for doc in repo.list_trips():
        start = date.fromisoformat(doc["start_date"])
        end = date.fromisoformat(doc["end_date"])
        status = trip_status(start, end)
        status_counts[status] += 1
        trips.append({
            "id": doc["id"],
            "name": doc["name"],
            "destinations": doc["destinations"],
            "start_date": start,
            "end_date": end,
            "status": status,
            "checklist": repo.checklist_progress(doc["id"]),
            "budget": repo.budget_totals(doc["id"]),
        })
    return {
        "status_counts": status_counts,
        "budget_totals": repo.budget_totals(),
        "trips": trips,
    }
