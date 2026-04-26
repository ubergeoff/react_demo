import { useState } from 'react';
import type { Booking, CreateBookingDto, UpdateBookingDto } from '@flight-booking/models';
import { useBookings, useCreateBooking, useUpdateBooking, useDeleteBooking } from '../hooks/useBookings';
import { BookingCard } from '../components/BookingCard';
import { BookingForm } from '../components/BookingForm';
import { CreateBookingModal } from '../components/CreateBookingModal';

export function BookingsPage() {
  const { data: bookings = [], isPending, error } = useBookings();
  const createBooking = useCreateBooking();
  const updateBooking = useUpdateBooking();
  const deleteBooking = useDeleteBooking();

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

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
            {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button className="btn btn--primary" onClick={() => setShowCreateModal(true)}>
          + New Booking
        </button>
      </div>

      {error && <div className="error-banner">Failed to load bookings</div>}

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
