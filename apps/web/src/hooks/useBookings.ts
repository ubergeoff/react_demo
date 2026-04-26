import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateBookingDto, UpdateBookingDto } from '@flight-booking/models';
import { bookingsApi } from '../lib/api';

export function useBookings() {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: bookingsApi.getAll,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateBookingDto) => bookingsApi.create(dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookings'] }),
  });
}

export function useUpdateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateBookingDto }) =>
      bookingsApi.update(id, dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookings'] }),
  });
}

export function useDeleteBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bookingsApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookings'] }),
  });
}
