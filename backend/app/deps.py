from fastapi import HTTPException, Request

from .repository import Repository


def get_repo(request: Request) -> Repository:
    return request.app.state.repo


def require_trip(repo: Repository, trip_id: str) -> dict:
    trip = repo.get_trip(trip_id)
    if trip is None:
        raise HTTPException(status_code=404, detail="Trip not found")
    return trip
