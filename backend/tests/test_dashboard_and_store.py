import mongomock

from app.repository import Repository
from app.store import DocumentStore


def test_dashboard_aggregates(client, trip):
    tid = trip["id"]
    client.post(f"/api/trips/{tid}/checklist", json={"text": "Passport", "type": "prep"})
    done = client.post(
        f"/api/trips/{tid}/checklist", json={"text": "Socks", "type": "packing"}
    ).json()
    client.patch(f"/api/trips/{tid}/checklist/{done['id']}", json={"checked": True})
    client.post(
        f"/api/trips/{tid}/budget",
        json={"category": "lodging", "description": "Hotel", "planned_amount": 900, "actual_amount": 850},
    )
    client.post(
        f"/api/trips/{tid}/budget",
        json={"category": "food", "description": "Meals", "planned_amount": 300},
    )
    # a second, completed trip
    client.post(
        "/api/trips",
        json={
            "name": "Past weekend",
            "destinations": ["Austin"],
            "start_date": "2020-01-01",
            "end_date": "2020-01-03",
        },
    )

    d = client.get("/api/dashboard").json()
    assert d["status_counts"] == {"Upcoming": 1, "Active": 0, "Completed": 1}
    assert d["budget_totals"] == {"planned": 1200.0, "actual": 850.0}
    main = next(t for t in d["trips"] if t["id"] == tid)
    assert main["checklist"] == {"total": 2, "done": 1, "percent": 50}
    assert main["budget"] == {"planned": 1200.0, "actual": 850.0}


def test_snapshot_survives_restart(tmp_path):
    snap = tmp_path / "store.json"
    repo1 = Repository(DocumentStore(mongomock.MongoClient()["t"], snapshot_path=snap))
    t = repo1.create_trip(
        {"name": "A", "destinations": ["X"], "start_date": "2030-01-01",
         "end_date": "2030-01-02", "notes": None}
    )
    repo1.create_checklist_item(t["id"], {"text": "Socks", "type": "packing", "checked": False})

    # simulate a backend restart: brand-new mongomock client, same snapshot file
    repo2 = Repository(DocumentStore(mongomock.MongoClient()["t"], snapshot_path=snap))
    assert [tr["id"] for tr in repo2.list_trips()] == [t["id"]]
    assert len(repo2.list_checklist_items(t["id"])) == 1
