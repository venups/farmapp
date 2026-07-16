import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TripForm from '../pages/TripForm';

const renderWithRouter = (component) => {
  return render(
    <MemoryRouter initialEntries={['/trips/new']}>
      {component}
    </MemoryRouter>
  );
};

describe('Trip Creation Flow', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    delete global.fetch;
  });

  test('renders trip form with all required fields', () => {
    renderWithRouter(<TripForm />);
    
    expect(screen.getByLabelText(/trip name/i)).toBeInTheDocument();
    expect(screen.getByText(/destinations/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/end date/i)).toBeInTheDocument();
  });

  test('shows validation error when submitting empty form', async () => {
    renderWithRouter(<TripForm />);
    
    fireEvent.click(screen.getByRole('button', { name: /create trip/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/trip name is required/i)).toBeInTheDocument();
    });
  });

  test('allows adding multiple destinations', () => {
    renderWithRouter(<TripForm />);
    
    const addDestBtn = screen.getByRole('button', { name: /add destination/i });
    fireEvent.click(addDestBtn);
    
    expect(screen.getAllByPlaceholderText(/destination/i)).toHaveLength(2);
    
    fireEvent.click(addDestBtn);
    expect(screen.getAllByPlaceholderText(/destination/i)).toHaveLength(3);
  });

  test('submits valid trip data', async () => {
    const mockCreatedTrip = { _id: '123', name: 'Test Trip' };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCreatedTrip,
    });

    renderWithRouter(<TripForm />);
    
    // Fill in form fields
    fireEvent.change(screen.getByLabelText(/trip name/i), {
      target: { value: 'Summer Vacation' },
    });
    
    fireEvent.change(screen.getAllByPlaceholderText(/destination/i)[0], {
      target: { value: 'Paris' },
    });
    
    const today = new Date();
    const start = new Date(today);
    start.setDate(start.getDate() + 30);
    const end = new Date(today);
    end.setDate(end.getDate() + 40);
    
    fireEvent.change(screen.getByLabelText(/start date/i), {
      target: { value: start.toISOString().split('T')[0] },
    });
    
    fireEvent.change(screen.getByLabelText(/end date/i), {
      target: { value: end.toISOString().split('T')[0] },
    });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /create trip/i }));
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/trips/',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('Summer Vacation'),
        })
      );
    });
  });

  test('shows error when end date is before start date', async () => {
    renderWithRouter(<TripForm />);
    
    fireEvent.change(screen.getByLabelText(/trip name/i), {
      target: { value: 'Test Trip' },
    });
    
    fireEvent.change(screen.getAllByPlaceholderText(/destination/i)[0], {
      target: { value: 'Paris' },
    });
    
    const today = new Date();
    const start = new Date(today);
    start.setDate(start.getDate() + 40);
    const end = new Date(today);
    end.setDate(end.getDate() + 30);
    
    fireEvent.change(screen.getByLabelText(/start date/i), {
      target: { value: start.toISOString().split('T')[0] },
    });
    
    fireEvent.change(screen.getByLabelText(/end date/i), {
      target: { value: end.toISOString().split('T')[0] },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /create trip/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/end date must be after start date/i)).toBeInTheDocument();
    });
  });
});
