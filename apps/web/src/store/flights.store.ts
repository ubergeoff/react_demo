import { create } from 'zustand';
import type { Flight } from '@flight-booking/models';
import { flightsApi } from '../lib/api';

interface FlightsState {
  flights: Flight[];
  isLoading: boolean;
  error: string | null;
  fetchFlights: () => Promise<void>;
}

export const useFlightsStore = create<FlightsState>((set) => ({
  flights: [],
  isLoading: false,
  error: null,

  fetchFlights: async () => {
    set({ isLoading: true, error: null });
    try {
      const flights = await flightsApi.getAll();
      set({ flights, isLoading: false });
    } catch {
      set({ error: 'Failed to load flights', isLoading: false });
    }
  },
}));
