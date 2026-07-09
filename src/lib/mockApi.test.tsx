import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useCreateBooking } from './mockApi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export function renderWithClient(ui: React.ReactElement) {
  const testQueryClient = createTestQueryClient();
  const { rerender, ...result } = render(
    <QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>
  );
  return {
    ...result,
    rerender: (rerenderUi: React.ReactElement) =>
      rerender(
        <QueryClientProvider client={testQueryClient}>{rerenderUi}</QueryClientProvider>
      ),
  };
}

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const testQueryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={testQueryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useCreateBooking', () => {
  it('validates that check-out must be after check-in', async () => {
    const { result } = renderHook(() => useCreateBooking(), { wrapper });

    const bookingData = {
      hotelId: 1,
      userId: 1,
      checkIn: '2026-08-10',
      checkOut: '2026-08-05', // Invalid: Checkout before checkin
      guests: 2,
    };

    // The mutation should fail and throw our specific error
    await expect(result.current.mutateAsync({ data: bookingData })).rejects.toMatchObject({
      data: { error: 'Check-out date must be after check-in date' }
    });
  });

  it('allows valid booking dates', async () => {
    const { result } = renderHook(() => useCreateBooking(), { wrapper });

    const bookingData = {
      hotelId: 1,
      userId: 1,
      checkIn: '2026-08-10',
      checkOut: '2026-08-15', // Valid
      guests: 2,
    };

    const response = await result.current.mutateAsync({ data: bookingData });
    expect(response).toMatchObject({
      hotelId: 1,
      guests: 2,
    });
  });
});
