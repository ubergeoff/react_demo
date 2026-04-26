import { useState, useEffect } from 'react';
import type { Booking, UpdateBookingDto } from '@flight-booking/models';
import { BookingStatus } from '@flight-booking/models';

interface Props {
  booking: Booking;
  onSave: (id: string, dto: UpdateBookingDto) => Promise<void>;
  onCancel: () => void;
}

export function BookingForm({ booking, onSave, onCancel }: Props) {
  const [firstName, setFirstName] = useState(booking.passenger.firstName);
  const [lastName, setLastName] = useState(booking.passenger.lastName);
  const [email, setEmail] = useState(booking.passenger.email);
  const [passportNumber, setPassportNumber] = useState(booking.passenger.passportNumber);
  const [seatNumber, setSeatNumber] = useState(booking.seatNumber);
  const [status, setStatus] = useState<BookingStatus>(booking.status);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFirstName(booking.passenger.firstName);
    setLastName(booking.passenger.lastName);
    setEmail(booking.passenger.email);
    setPassportNumber(booking.passenger.passportNumber);
    setSeatNumber(booking.seatNumber);
    setStatus(booking.status);
  }, [booking]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(booking.id, {
        passenger: { firstName, lastName, email, passportNumber },
        seatNumber,
        status,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>
          Edit Booking <span className="booking-ref">{booking.bookingReference}</span>
        </h2>
        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-row">
            <label>
              First Name
              <input value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            </label>
            <label>
              Last Name
              <input value={lastName} onChange={(e) => setLastName(e.target.value)} required />
            </label>
          </div>
          <div className="form-row">
            <label>
              Email
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>
            <label>
              Passport Number
              <input value={passportNumber} onChange={(e) => setPassportNumber(e.target.value)} required />
            </label>
          </div>
          <div className="form-row">
            <label>
              Seat Number
              <input value={seatNumber} onChange={(e) => setSeatNumber(e.target.value)} required />
            </label>
            <label>
              Status
              <select value={status} onChange={(e) => setStatus(e.target.value as BookingStatus)}>
                {Object.values(BookingStatus).map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn--secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
