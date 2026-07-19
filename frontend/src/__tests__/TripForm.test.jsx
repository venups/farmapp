import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import TripForm from "../pages/TripForm.jsx";

vi.mock("../api.js", () => ({
  api: {
    createTrip: vi.fn(),
  },
}));

import { api } from "../api.js";

function renderForm() {
  return render(
    <MemoryRouter initialEntries={["/trips/new"]}>
      <Routes>
        <Route path="/trips/new" element={<TripForm />} />
        <Route path="/trips/:tripId" element={<p>Trip detail page</p>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("trip creation flow", () => {
  beforeEach(() => vi.clearAllMocks());

  it("submits the form and navigates to the new trip", async () => {
    api.createTrip.mockResolvedValue({ id: "abc123" });
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(/trip name/i), "Autumn in Portugal");
    await user.type(screen.getByLabelText("Destination 1"), "Lisbon");
    fireEvent.change(screen.getByLabelText(/start date/i), {
      target: { value: "2030-10-01" },
    });
    fireEvent.change(screen.getByLabelText(/end date/i), {
      target: { value: "2030-10-10" },
    });
    await user.click(screen.getByRole("button", { name: /create trip/i }));

    expect(api.createTrip).toHaveBeenCalledWith({
      name: "Autumn in Portugal",
      destinations: ["Lisbon"],
      start_date: "2030-10-01",
      end_date: "2030-10-10",
      notes: null,
    });
    expect(await screen.findByText("Trip detail page")).toBeInTheDocument();
  });

  it("blocks submission when the end date precedes the start date", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(/trip name/i), "Backwards");
    await user.type(screen.getByLabelText("Destination 1"), "Nowhere");
    fireEvent.change(screen.getByLabelText(/start date/i), {
      target: { value: "2030-10-10" },
    });
    fireEvent.change(screen.getByLabelText(/end date/i), {
      target: { value: "2030-10-01" },
    });
    await user.click(screen.getByRole("button", { name: /create trip/i }));

    expect(api.createTrip).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent(/can't be before/i);
  });

  it("supports multiple destinations", async () => {
    api.createTrip.mockResolvedValue({ id: "xyz" });
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(/trip name/i), "Iberia");
    await user.type(screen.getByLabelText("Destination 1"), "Lisbon");
    await user.click(screen.getByRole("button", { name: /add another stop/i }));
    await user.type(screen.getByLabelText("Destination 2"), "Madrid");
    fireEvent.change(screen.getByLabelText(/start date/i), {
      target: { value: "2030-05-01" },
    });
    fireEvent.change(screen.getByLabelText(/end date/i), {
      target: { value: "2030-05-09" },
    });
    await user.click(screen.getByRole("button", { name: /create trip/i }));

    expect(api.createTrip).toHaveBeenCalledWith(
      expect.objectContaining({ destinations: ["Lisbon", "Madrid"] })
    );
  });
});
