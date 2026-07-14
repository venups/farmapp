import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import TripForm from '../pages/TripForm';
import { tripService } from '../services/api';

vi.mock('../services/api', () => ({
  tripService: {
    create: vi.fn(),
  },
}));

describe('TripForm', () => {
  it('renders form fields correctly', () => {
    render(
      <BrowserRouter>
        <TripForm />
      </BrowserRouter>
    );
    expect(screen.getByLabelText(/Trip Name/i)).toBeDefined();
    expect(screen.getByLabelText(/Destinations/i)).toBeDefined();
  });

  it('calls tripService.create on submit', async () => {
    tripService.create.mockResolvedValue({ data: {} });
    render(
      <BrowserRouter>
        <TripForm />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/Trip Name/i), { target: { value: 'Test Trip' } });
    fireEvent.change(screen.getByLabelText(/Destinations/i), { target: { value: 'Paris, London' } });
    fireEvent.change(screen.getByLabelText(/Start Date/i), { target: { value: '2026-01-01' } });
    fireEvent.change(screen.getByLabelText(/End Date/i), { target: { value: '2026-01-10' } });

    fireEvent.click(screen.getByText(/Create Trip/i));

    expect(tripService.create).toHaveBeenCalledWith({
      name: 'Test Trip',
      destinations: ['Paris', 'London'],
      start_date: '2026-01-01',
      end_date: '2026-01-10',
      notes: ''
    });
  });
});
