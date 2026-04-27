import { useState } from 'react';
import type { Booking } from '@flight-booking/models';
import { StatusBadge } from './StatusBadge';
import { DeleteConfirmModal } from './DeleteConfirmModal';

interface Props {
  booking: Booking;
  onEdit: (booking: Booking) => void;
  onDelete: (id: string) => void;
}

export function BookingCard({ booking, onEdit, onDelete }: Props) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const flight = booking.flight;

  const fmt = (iso: string) =>
    new Date(iso).toLocaleString('en-ZA', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

  return (
    <div className="booking-card">
      <div className="booking-card__header">
        <div>
          <span className="booking-ref">{booking.bookingReference}</span>
          <StatusBadge status={booking.status} />
        </div>
        <div className="booking-card__actions">
          <button className="btn btn--secondary" onClick={() => onEdit(booking)}>
            Edit
          </button>
          <button
            className="btn btn--danger"
            onClick={() => setShowDeleteModal(true)}
          >
            Delete
          </button>
        </div>
      </div>

      {flight && (
        <div className="flight-info">
          <div className="route">
            <span className="origin">{flight.origin}</span>
            <span className="arrow">✈</span>
            <span className="destination">{flight.destination}</span>
          </div>
          <div className="flight-meta">
            <span>{flight.airline}</span>
            <span>{flight.flightNumber}</span>
            <span className="cabin">{flight.cabinClass.toUpperCase()}</span>
          </div>
          <div className="times">
            <span>{fmt(flight.departureTime)}</span>
            <span>→</span>
            <span>{fmt(flight.arrivalTime)}</span>
          </div>
        </div>
      )}

      <div className="passenger-info">
        <div className="passenger-name">
          {booking.passenger.firstName} {booking.passenger.lastName}
        </div>
        <div className="passenger-meta">
          <span>{booking.passenger.email}</span>
          <span>Seat: {booking.seatNumber}</span>
          <span>
            R {Number(booking.totalPrice).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {showDeleteModal && (
        <DeleteConfirmModal
          bookingReference={booking.bookingReference}
          onConfirm={() => {
            setShowDeleteModal(false);
            onDelete(booking.id);
          }}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
}
