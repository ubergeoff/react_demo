import { useState } from 'react';
import type { Booking, CreateBookingDto, UpdateBookingDto } from '@flight-booking/models';
import { useBookings, useBookingsByFlight, useCreateBooking, useUpdateBooking, useDeleteBooking } from '../hooks/useBookings';
import { BookingCard } from '../components/BookingCard';
import { BookingForm } from '../components/BookingForm';
import { CreateBookingModal } from '../components/CreateBookingModal';
import { FlightFilterDropdown } from '../components/FlightFilterDropdown';

export function BookingsPage() {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [flightFilter, setFlightFilter] = useState<string>('');

  const { data: allBookings = [], isPending: allPending, error: allError } = useBookings();
  const { data: filteredBookings = [], isPending: filteredPending, error: filteredError } =
    useBookingsByFlight(flightFilter);
  const createBooking = useCreateBooking();
  const updateBooking = useUpdateBooking();
  const deleteBooking = useDeleteBooking();

  const flightOptions = Array.from(
    new Map(
      allBookings
        .filter((b) => b.flight)
        .map((b) => [b.flight!.id, b.flight!])
    ).values()
  ).sort((a, b) => a.flightNumber.localeCompare(b.flightNumber));

  const visibleBookings = flightFilter ? filteredBookings : allBookings;
  const isPending = flightFilter ? filteredPending : allPending;
  const error = flightFilter ? filteredError : allError;

  const handleSave = async (id: string, dto: UpdateBookingDto) => {
    await updateBooking.mutateAsync({ id, dto });
    setSelectedBooking(null);
  };

  const handleCreate = async (dto: CreateBookingDto) => {
    await createBooking.mutateAsync(dto);
    setShowCreateModal(false);
  };

  if (isPending) {
    return (
      <div className="loading">
        <div className="spinner" />
        <p>Loading bookings…</p>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Flight Bookings</h1>
          <p className="subtitle">
            {visibleBookings.length} of {allBookings.length} booking{allBookings.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="page-header__controls">
          <FlightFilterDropdown
            value={flightFilter}
            onChange={setFlightFilter}
            options={flightOptions}
          />
          <button className="btn btn--primary" onClick={() => setShowCreateModal(true)}>
            + New Booking
          </button>
        </div>
      </div>

      {error && <div className="error-banner">Failed to load bookings</div>}

      {visibleBookings.length === 0 ? (
        <div className="empty-state">
          <p>{flightFilter ? 'No bookings for this flight.' : 'No bookings found.'}</p>
        </div>
      ) : (
        <div className="bookings-grid">
          {visibleBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onEdit={setSelectedBooking}
              onDelete={(id) => deleteBooking.mutate(id)}
            />
          ))}
        </div>
      )}

      {selectedBooking && (
        <BookingForm
          booking={selectedBooking}
          onSave={handleSave}
          onCancel={() => setSelectedBooking(null)}
        />
      )}

      {showCreateModal && (
        <CreateBookingModal
          onSave={handleCreate}
          onCancel={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
}
