"""
Tests for checklist item toggling functionality.
"""
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TripDetailPage from "./pages/TripDetailPage";
import { tripsApi, checklistApi } from "./api/client";

// Mock the API client
vi.mock("./api/client");

describe("TripDetailPage Checklist", () => {
  const mockTrip = {
    id: "trip123",
    name: "Test Trip",
    destinations: ["Paris"],
    start_date: "2024-12-01",
    end_date: "2024-12-15",
    status: "upcoming"
  };

  const mockChecklistItems = [
    { id: "item1", tripId: "trip123", text: "Passport", type: "packing", checked: false },
    { id: "item2", tripId: "trip123", text: "Book hotel", type: "prep", checked: true }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(tripsApi.getById).mockResolvedValue(mockTrip);
    vi.mocked(checklistApi.getByTripId).mockResolvedValue(mockChecklistItems);
    vi.mocked(checklistApi.update).mockResolvedValue({ ...mockChecklistItems[0], checked: true });
  });

  it("displays checklist items with correct initial state", async () => {
    render(
      <MemoryRouter>
        <TripDetailPage />
      </MemoryRouter>
    );

    // Wait for the component to load
    expect(await screen.findByText("Test Trip")).toBeInTheDocument();
    
    // Check that checklist items are displayed
    expect(screen.getByText("Passport")).toBeInTheDocument();
    expect(screen.getByText("Book hotel")).toBeInTheDocument();
  });

  it("toggles checklist item when checkbox is clicked", async () => {
    render(
      <MemoryRouter initialEntries={["/trips/trip123"]}>
        <TripDetailPage />
      </MemoryRouter>
    );

    // Wait for the component to load
    expect(await screen.findByText("Test Trip")).toBeInTheDocument();
    
    const checkbox = screen.getAllByRole("checkbox")[0]; // First checklist item
    expect(checkbox).not.toBeChecked();
    
    fireEvent.click(checkbox);
    
    // Check that the API update was called
    expect(checklistApi.update).toHaveBeenCalledWith("item1", {
      ...mockChecklistItems[0],
      checked: true
    });
  });

  it("shows correct number of packing and prep items", async () => {
    render(
      <MemoryRouter initialEntries={["/trips/trip123"]}>
        <TripDetailPage />
      </MemoryRouter>
    );

    // Wait for the component to load
    expect(await screen.findByText("Test Trip")).toBeInTheDocument();
    
    const packingSection = screen.getByText("Packing List");
    const prepSection = screen.getByText("Preparation To-Dos");
    
    expect(packingSection).toBeInTheDocument();
    expect(prepSection).toBeInTheDocument();
    
    // Should show 1 packing item and 1 prep item
    const packingItems = screen.getAllByText(/Passport|Book hotel/);
    expect(packingItems.length).toBe(2);
  });
});