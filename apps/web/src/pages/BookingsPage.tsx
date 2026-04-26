import { useEffect } from 'react';
import { useBookingsStore } from '../store/bookings.store';
import { BookingCard } from '../components/BookingCard';
import { BookingForm } from '../components/BookingForm';
import type { UpdateBookingDto } from '@flight-booking/models';

export function BookingsPage() {
  const {
    bookings,
    selectedBooking,
    isLoading,
    error,
    fetchBookings,
    selectBooking,
    updateBooking,
    deleteBooking,
  } = useBookingsStore();

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleSave = async (id: string, dto: UpdateBookingDto) => {
    await updateBooking(id, dto);
  };

  if (isLoading && bookings.length === 0) {
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
        <h1>Flight Bookings</h1>
        <p className="subtitle">
          {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
        </p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {bookings.length === 0 ? (
        <div className="empty-state">
          <p>No bookings found.</p>
        </div>
      ) : (
        <div className="bookings-grid">
          {bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onEdit={selectBooking}
              onDelete={deleteBooking}
            />
          ))}
        </div>
      )}

      {selectedBooking && (
        <BookingForm
          booking={selectedBooking}
          onSave={handleSave}
          onCancel={() => selectBooking(null)}
        />
      )}
    </div>
  );
}
