import axios from 'axios';
import type { Booking, Flight, CreateBookingDto, UpdateBookingDto } from '@flight-booking/models';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3333/api',
});

export const flightsApi = {
  getAll: () => client.get<Flight[]>('/flights').then((r) => r.data),
  getOne: (id: string) => client.get<Flight>(`/flights/${id}`).then((r) => r.data),
};

export const bookingsApi = {
  getAll: () => client.get<Booking[]>('/bookings').then((r) => r.data),
  getByFlight: (flightId: string) =>
    client.get<Booking[]>('/bookings', { params: { flightId } }).then((r) => r.data),
  getOne: (id: string) => client.get<Booking>(`/bookings/${id}`).then((r) => r.data),
  create: (dto: CreateBookingDto) =>
    client.post<Booking>('/bookings', dto).then((r) => r.data),
  update: (id: string, dto: UpdateBookingDto) =>
    client.put<Booking>(`/bookings/${id}`, dto).then((r) => r.data),
  remove: (id: string) => client.delete(`/bookings/${id}`),
};
