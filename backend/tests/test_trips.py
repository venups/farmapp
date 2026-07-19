def test_create_trip_returns_derived_status(trip):
    assert trip["id"]
    assert trip["status"] == "Upcoming"  # 2030 is in the future
    assert trip["destinations"] == ["Lisbon", "Porto"]


def test_list_and_get_trip(client, trip):
    listed = client.get("/api/trips").json()
    assert [t["id"] for t in listed] == [trip["id"]]
    fetched = client.get(f"/api/trips/{trip['id']}").json()
    assert fetched == trip


def test_update_trip(client, trip):
    res = client.put(
        f"/api/trips/{trip['id']}",
        json={
            "name": "Portugal, revised",
            "destinations": ["Lisbon"],
            "start_date": "2030-10-02",
            "end_date": "2030-10-08",
        },
    )
    assert res.status_code == 200
    body = res.json()
    assert body["name"] == "Portugal, revised"
    assert body["notes"] is None


def test_delete_trip_cascades(client, trip):
    tid = trip["id"]
    client.post(f"/api/trips/{tid}/checklist", json={"text": "Passport", "type": "prep"})
    client.post(
        f"/api/trips/{tid}/budget",
        json={"category": "food", "description": "Meals", "planned_amount": 300},
    )
    assert client.delete(f"/api/trips/{tid}").status_code == 204
    assert client.get(f"/api/trips/{tid}").status_code == 404
    assert client.get(f"/api/trips/{tid}/checklist").status_code == 404


def test_rejects_end_date_before_start_date(client):
    res = client.post(
        "/api/trips",
        json={
            "name": "Backwards",
            "destinations": ["Nowhere"],
            "start_date": "2030-10-10",
            "end_date": "2030-10-01",
        },
    )
    assert res.status_code == 422


def test_rejects_empty_destinations(client):
    res = client.post(
        "/api/trips",
        json={
            "name": "Nowhere",
            "destinations": ["   "],
            "start_date": "2030-10-01",
            "end_date": "2030-10-02",
        },
    )
    assert res.status_code == 422


def test_get_missing_trip_404(client):
    assert client.get("/api/trips/doesnotexist").status_code == 404
