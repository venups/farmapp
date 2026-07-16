"""
Tests for trip creation functionality.
"""
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CreateTripPage from "./pages/CreateTripPage";
import { tripsApi } from "./api/client";

// Mock the API client
vi.mock("./api/client");

describe("CreateTripPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the create trip form", () => {
    render(
      <MemoryRouter>
        <CreateTripPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Create New Trip")).toBeInTheDocument();
    expect(screen.getByLabelText("Trip Name*")).toBeInTheDocument();
    expect(screen.getByLabelText("Start Date*")).toBeInTheDocument();
    expect(screen.getByLabelText("End Date*")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create Trip" })).toBeInTheDocument();
  });

  it("shows validation errors for empty required fields", async () => {
    render(
      <MemoryRouter>
        <CreateTripPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: "Create Trip" }));

    expect(await screen.findByText("Trip name is required")).toBeInTheDocument();
    expect(await screen.findByText("Start date is required")).toBeInTheDocument();
    expect(await screen.findByText("End date is required")).toBeInTheDocument();
  });

  it("shows validation error when end date is before start date", async () => {
    render(
      <MemoryRouter>
        <CreateTripPage />
      </MemoryRouter>
    );

    const startDateInput = screen.getByLabelText("Start Date*");
    const endDateInput = screen.getByLabelText("End Date*");
    
    fireEvent.change(startDateInput, { target: { value: "2024-12-15" } });
    fireEvent.change(endDateInput, { target: { value: "2024-12-01" } });
    fireEvent.click(screen.getByRole("button", { name: "Create Trip" }));

    expect(await screen.findByText("End date must be after start date")).toBeInTheDocument();
  });

  it("calls tripsApi.create when form is valid and submitted", async () => {
    const mockCreate = vi.mocked(tripsApi.create).mockResolvedValue({ id: "123" });
    
    render(
      <MemoryRouter>
        <CreateTripPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText("Trip Name*", { name: "name" }), {
      target: { value: "Test Trip" }
    });
    
    const destinationInput = screen.getByPlaceholderText("Destination 1");
    fireEvent.change(destinationInput, { target: { value: "Paris" } });
    
    fireEvent.change(screen.getByLabelText("Start Date*", { name: "start_date" }), {
      target: { value: "2024-12-01" }
    });
    
    fireEvent.change(screen.getByLabelText("End Date*", { name: "end_date" }), {
      target: { value: "2024-12-15" }
    });

    fireEvent.click(screen.getByRole("button", { name: "Create Trip" }));

    expect(mockCreate).toHaveBeenCalledWith({
      name: "Test Trip",
      destinations: ["Paris"],
      start_date: "2024-12-01",
      end_date: "2024-12-15",
      notes: ""
    });
  });
});