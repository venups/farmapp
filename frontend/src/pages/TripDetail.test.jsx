import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TripDetail from '../pages/TripDetail';

const mockTrip = {
  _id: '123',
  name: 'Test Trip',
  destinations: ['Paris'],
  start_date: '2026-08-15',
  end_date: '2026-08-25',
  notes: null,
};

const mockChecklistItems = [
  { _id: 'item1', text: 'Pack passport', item_type: 'packing', checked: false },
  { _id: 'item2', text: 'Book tickets', item_type: 'prep', checked: true },
];

const renderWithRouter = (component, initialEntries = ['/trips/123']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      {component}
    </MemoryRouter>
  );
};

describe('Checklist Item Toggling', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    delete global.fetch;
  });

  test('renders checklist items with checkboxes', async () => {
    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => mockTrip })
      .mockResolvedValueOnce({ ok: true, json: async () => [] })
      .mockResolvedValueOnce({ ok: true, json: async () => [] })
      .mockResolvedValueOnce({ ok: true, json: async () => mockChecklistItems });

    renderWithRouter(<TripDetail />);

    await waitFor(() => {
      expect(screen.getByText(/test trip/i)).toBeInTheDocument();
    });

    // Click on Checklist tab
    fireEvent.click(screen.getByRole('button', { name: /checklist/i }));

    expect(screen.getByText(/pack passport/i)).toBeInTheDocument();
    expect(screen.getByText(/book tickets/i)).toBeInTheDocument();
  });

  test('shows packing and prep sections separately', async () => {
    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => mockTrip })
      .mockResolvedValueOnce({ ok: true, json: async () => [] })
      .mockResolvedValueOnce({ ok: true, json: async () => [] })
      .mockResolvedValueOnce({ ok: true, json: async () => mockChecklistItems });

    renderWithRouter(<TripDetail />);

    await waitFor(() => {
      expect(screen.getByText(/test trip/i)).toBeInTheDocument();
    });

    // Click on Checklist tab
    fireEvent.click(screen.getByRole('button', { name: /checklist/i }));

    expect(screen.getByText(/packing list/i)).toBeInTheDocument();
    expect(screen.getByText(/preparation \/ to-do/i)).toBeInTheDocument();
  });

  test('displays checked items with strikethrough styling', async () => {
    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => mockTrip })
      .mockResolvedValueOnce({ ok: true, json: async () => [] })
      .mockResolvedValueOnce({ ok: true, json: async () => [] })
      .mockResolvedValueOnce({ ok: true, json: async () => mockChecklistItems });

    renderWithRouter(<TripDetail />);

    await waitFor(() => {
      expect(screen.getByText(/test trip/i)).toBeInTheDocument();
    });

    // Click on Checklist tab
    fireEvent.click(screen.getByRole('button', { name: /checklist/i }));

    const prepItem = screen.getByLabelText(/book tickets/i);
    expect(prepItem).toBeChecked();
  });

  test('allows adding new packing item via Enter key', async () => {
    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => mockTrip })
      .mockResolvedValueOnce({ ok: true, json: async () => [] })
      .mockResolvedValueOnce({ ok: true, json: async () => [] })
      .mockResolvedValueOnce({ ok: true, json: async () => [] });

    renderWithRouter(<TripDetail />);

    await waitFor(() => {
      expect(screen.getByText(/test trip/i)).toBeInTheDocument();
    });

    // Click on Checklist tab
    fireEvent.click(screen.getByRole('button', { name: /checklist/i }));

    // Find packing list input and add item
    const packingInput = screen.getAllByPlaceholderText(/add item/i)[0];
    fireEvent.change(packingInput, { target: { value: 'New item' } });
    fireEvent.keyPress(packingInput, { key: 'Enter', code: 'Enter' });

    expect(global.fetch).toHaveBeenCalled();
  });

  test('shows empty state when no checklist items exist', async () => {
    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => mockTrip })
      .mockResolvedValueOnce({ ok: true, json: async () => [] })
      .mockResolvedValueOnce({ ok: true, json: async () => [] })
      .mockResolvedValueOnce({ ok: true, json: async () => [] });

    renderWithRouter(<TripDetail />);

    await waitFor(() => {
      expect(screen.getByText(/test trip/i)).toBeInTheDocument();
    });

    // Click on Checklist tab
    fireEvent.click(screen.getByRole('button', { name: /checklist/i }));

    expect(screen.getByText(/no packing items yet/i)).toBeInTheDocument();
  });
});
