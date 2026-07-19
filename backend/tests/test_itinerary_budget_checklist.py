def test_itinerary_upsert_list_delete(client, trip):
    tid = trip["id"]
    acts = [
        {"order": 1, "time": "14:00", "description": "Tram 28"},
        {"order": 0, "time": "09:30", "description": "Pastéis de Belém"},
    ]
    res = client.put(f"/api/trips/{tid}/itinerary/2030-10-02", json={"activities": acts})
    assert res.status_code == 200
    saved = res.json()["activities"]
    assert [a["description"] for a in saved] == ["Pastéis de Belém", "Tram 28"]  # sorted by order

    days = client.get(f"/api/trips/{tid}/itinerary").json()
    assert len(days) == 1 and days[0]["date"] == "2030-10-02"

    # replace wholesale
    res = client.put(f"/api/trips/{tid}/itinerary/2030-10-02", json={"activities": []})
    assert res.json()["activities"] == []

    assert client.delete(f"/api/trips/{tid}/itinerary/2030-10-02").status_code == 204
    assert client.get(f"/api/trips/{tid}/itinerary").json() == []


def test_itinerary_rejects_date_outside_trip(client, trip):
    res = client.put(
        f"/api/trips/{trip['id']}/itinerary/2030-11-01", json={"activities": []}
    )
    assert res.status_code == 422


def test_trip_date_change_prunes_out_of_range_days(client, trip):
    tid = trip["id"]
    client.put(f"/api/trips/{tid}/itinerary/2030-10-09", json={"activities": []})
    client.put(f"/api/trips/{tid}/itinerary/2030-10-03", json={"activities": []})
    client.put(
        f"/api/trips/{tid}",
        json={
            "name": trip["name"],
            "destinations": trip["destinations"],
            "start_date": "2030-10-01",
            "end_date": "2030-10-05",
        },
    )
    days = client.get(f"/api/trips/{tid}/itinerary").json()
    assert [d["date"] for d in days] == ["2030-10-03"]


def test_budget_crud_and_validation(client, trip):
    tid = trip["id"]
    res = client.post(
        f"/api/trips/{tid}/budget",
        json={"category": "lodging", "description": "Hotel", "planned_amount": 900},
    )
    assert res.status_code == 201
    item = res.json()
    assert item["currency"] == "USD" and item["actual_amount"] is None

    res = client.put(
        f"/api/trips/{tid}/budget/{item['id']}",
        json={
            "category": "lodging",
            "description": "Hotel",
            "planned_amount": 900,
            "actual_amount": 845.5,
        },
    )
    assert res.status_code == 200 and res.json()["actual_amount"] == 845.5

    bad = client.post(
        f"/api/trips/{tid}/budget",
        json={"category": "casino", "description": "x", "planned_amount": 1},
    )
    assert bad.status_code == 422

    assert client.delete(f"/api/trips/{tid}/budget/{item['id']}").status_code == 204
    assert client.get(f"/api/trips/{tid}/budget").json() == []


def test_checklist_crud_and_toggle(client, trip):
    tid = trip["id"]
    res = client.post(
        f"/api/trips/{tid}/checklist", json={"text": "Rain jacket", "type": "packing"}
    )
    assert res.status_code == 201
    item = res.json()
    assert item["checked"] is False

    res = client.patch(
        f"/api/trips/{tid}/checklist/{item['id']}", json={"checked": True}
    )
    assert res.status_code == 200 and res.json()["checked"] is True

    res = client.patch(
        f"/api/trips/{tid}/checklist/{item['id']}", json={"checked": False}
    )
    assert res.json()["checked"] is False

    assert client.delete(f"/api/trips/{tid}/checklist/{item['id']}").status_code == 204
    assert client.get(f"/api/trips/{tid}/checklist").json() == []
