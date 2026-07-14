import httpx
import asyncio

async def test_api():
    base_url = "http://127.0.0.1:8000/api/trips/"
    async with httpx.AsyncClient(follow_redirects=True) as client:
        # 1. Create a trip
        print("Creating trip...")
        trip_data = {
            "destination": "Paris",
            "start_date": "2026-08-01",
            "end_date": "2026-08-10",
            "description": "Summer in Paris"
        }
        resp = await client.post(base_url, json=trip_data)
        print(f"Status: {resp.status_code}, Data: {resp.json()}")
        trip = resp.json()
        trip_id = trip["id"]

        # 2. List trips
        print("\nListing trips...")
        resp = await client.get(base_url)
        print(f"Status: {resp.status_code}, Count: {len(resp.json())}")

        # 3. Add itinerary
        print("\nAdding itinerary...")
        itinerary_data = {
            "date": "2026-08-01",
            "activity": "Eiffel Tower Visit",
            "location": "Paris"
        }
        resp = await client.post(f"{base_url}{trip_id}/itineraries/", json=itinerary_data)
        print(f"Status: {resp.status_code}, Data: {resp.json()['itineraries']}")

        # 4. Add budget
        print("\nAdding budget...")
        budget_data = {
            "category": "Food",
            "amount": 500.0,
            "description": "Daily meals"
        }
        resp = await client.post(f"{base_url}{trip_id}/budgets/", json=budget_data)
        print(f"Status: {resp.status_code}, Data: {resp.json()['budgets']}")

        # 5. Add checklist
        print("\nAdding checklist...")
        checklist_data = {
            "content": "Passport",
            "is_completed": False
        }
        resp = await client.post(f"{base_url}{trip_id}/checklists/", json=checklist_data)
        print(f"Status: {resp.status_code}, Data: {resp.json()['checklists']}")

        # 6. Toggle checklist
        print("\nToggling checklist...")
        item_id = resp.json()["checklists"][0]["id"]
        resp = await client.patch(f"{base_url}{trip_id}/checklists/{item_id}")
        print(f"Status: {resp.status_code}, Data: {resp.json()['checklists'][0]['is_completed']}")

        # 7. Get trip details
        print("\nGetting trip details...")
        resp = await client.get(f"{base_url}{trip_id}")
        print(f"Status: {resp.status_code}, Data: {resp.json()}")

        # 8. Delete trip
        print("\nDeleting trip...")
        resp = await client.delete(f"{base_url}{trip_id}")
        print(f"Status: {resp.status_code}, Data: {resp.json()}")

if __name__ == "__main__":
    asyncio.run(test_api())
