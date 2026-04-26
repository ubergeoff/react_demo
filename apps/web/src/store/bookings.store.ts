import { create } from 'zustand';
import type { Booking, CreateBookingDto, UpdateBookingDto } from '@flight-booking/models';
import { bookingsApi } from '../lib/api';

interface BookingsState {
  bookings: Booking[];
  selectedBooking: Booking | null;
  isLoading: boolean;
  error: string | null;

  fetchBookings: () => Promise<void>;
  selectBooking: (booking: Booking | null) => void;
  createBooking: (dto: CreateBookingDto) => Promise<void>;
  updateBooking: (id: string, dto: UpdateBookingDto) => Promise<void>;
  deleteBooking: (id: string) => Promise<void>;
}

export const useBookingsStore = create<BookingsState>((set) => ({
  bookings: [],
  selectedBooking: null,
  isLoading: false,
  error: null,

  fetchBookings: async () => {
    set({ isLoading: true, error: null });
    try {
      const bookings = await bookingsApi.getAll();
      set({ bookings, isLoading: false });
    } catch {
      set({ error: 'Failed to load bookings', isLoading: false });
    }
  },

  selectBooking: (booking) => set({ selectedBooking: booking }),

  createBooking: async (dto) => {
    set({ isLoading: true, error: null });
    try {
      const created = await bookingsApi.create(dto);
      set((state) => ({
        bookings: [created, ...state.bookings],
        isLoading: false,
      }));
    } catch {
      set({ error: 'Failed to create booking', isLoading: false });
      throw new Error('Failed to create booking');
    }
  },

  updateBooking: async (id, dto) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await bookingsApi.update(id, dto);
      set((state) => ({
        bookings: state.bookings.map((b) => (b.id === id ? updated : b)),
        selectedBooking: null,
        isLoading: false,
      }));
    } catch {
      set({ error: 'Failed to update booking', isLoading: false });
      throw new Error('Failed to update booking');
    }
  },

  deleteBooking: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await bookingsApi.remove(id);
      set((state) => ({
        bookings: state.bookings.filter((b) => b.id !== id),
        selectedBooking: null,
        isLoading: false,
      }));
    } catch {
      set({ error: 'Failed to delete booking', isLoading: false });
    }
  },
}));
