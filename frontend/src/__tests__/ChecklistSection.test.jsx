import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ChecklistSection from "../components/ChecklistSection.jsx";

vi.mock("../api.js", () => ({
  api: {
    addChecklistItem: vi.fn(),
    updateChecklistItem: vi.fn(),
    deleteChecklistItem: vi.fn(),
  },
}));

import { api } from "../api.js";

const items = [
  { id: "p1", trip_id: "t1", text: "Rain jacket", type: "packing", checked: false },
  { id: "p2", trip_id: "t1", text: "Socks", type: "packing", checked: true },
  { id: "q1", trip_id: "t1", text: "Renew passport", type: "prep", checked: false },
];

describe("checklist section", () => {
  beforeEach(() => vi.clearAllMocks());

  it("splits items into packing and prep columns", () => {
    render(<ChecklistSection tripId="t1" items={items} onChange={() => {}} />);
    expect(screen.getByRole("region", { name: "Packing" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Prep" })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: /rain jacket/i })).not.toBeChecked();
    expect(screen.getByRole("checkbox", { name: /socks/i })).toBeChecked();
  });

  it("toggles an item on and off via the API", async () => {
    api.updateChecklistItem.mockResolvedValue({});
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<ChecklistSection tripId="t1" items={items} onChange={onChange} />);

    await user.click(screen.getByRole("checkbox", { name: /rain jacket/i }));
    expect(api.updateChecklistItem).toHaveBeenCalledWith("t1", "p1", { checked: true });

    await user.click(screen.getByRole("checkbox", { name: /socks/i }));
    expect(api.updateChecklistItem).toHaveBeenCalledWith("t1", "p2", { checked: false });
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it("adds a new packing item", async () => {
    api.addChecklistItem.mockResolvedValue({});
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<ChecklistSection tripId="t1" items={items} onChange={onChange} />);

    await user.type(screen.getByLabelText("Add to packing list"), "Sunscreen");
    await user.click(screen.getByRole("button", { name: "Add to packing list" }));
    expect(api.addChecklistItem).toHaveBeenCalledWith("t1", {
      text: "Sunscreen",
      type: "packing",
      checked: false,
    });
    expect(onChange).toHaveBeenCalled();
  });

  it("deletes an item", async () => {
    api.deleteChecklistItem.mockResolvedValue(null);
    const user = userEvent.setup();
    render(<ChecklistSection tripId="t1" items={items} onChange={() => {}} />);

    await user.click(screen.getByRole("button", { name: "Delete Renew passport" }));
    expect(api.deleteChecklistItem).toHaveBeenCalledWith("t1", "q1");
  });
});
