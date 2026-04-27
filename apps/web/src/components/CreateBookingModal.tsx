import { useState } from 'react';
import type { CreateBookingDto } from '@flight-booking/models';
import { BookingStatus, CabinClass } from '@flight-booking/models';
import { useFlights } from '../hooks/useFlights';

interface Props {
  onSave: (dto: CreateBookingDto) => Promise<void>;
  onCancel: () => void;
}

export function CreateBookingModal({ onSave, onCancel }: Props) {
  const { data: flights = [] } = useFlights();

  const [flightId, setFlightId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [seatNumber, setSeatNumber] = useState('');
  const [cabinClass, setCabinClass] = useState<CabinClass>(CabinClass.ECONOMY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSave({
        flightId,
        passenger: { firstName, lastName, email, passportNumber },
        seatNumber,
        cabinClass,
      });
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Failed to create booking. Please try again.';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>New Booking</h2>
        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-row">
            <label style={{ gridColumn: '1 / -1' }}>
              Flight
              <select value={flightId} onChange={(e) => setFlightId(e.target.value)} required>
                <option value="">— Select a flight —</option>
                {flights.map((f) => {
                  const full = (f.bookingCount ?? 0) >= f.availableSeats;
                  return (
                    <option key={f.id} value={f.id} disabled={full}>
                      {f.flightNumber} · {f.origin} → {f.destination} ({f.airline}){full ? ' — Full' : ''}
                    </option>
                  );
                })}
              </select>
            </label>
          </div>
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
              Cabin Class
              <select value={cabinClass} onChange={(e) => setCabinClass(e.target.value as CabinClass)}>
                {Object.values(CabinClass).map((c) => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {error && <div className="error-banner">{error}</div>}
          <div className="form-actions">
            <button type="button" className="btn btn--secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary" disabled={saving}>
              {saving ? 'Creating…' : 'Create Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
