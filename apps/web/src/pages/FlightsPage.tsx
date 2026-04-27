import { useState } from 'react';
import { useFlights } from '../hooks/useFlights';
import { FlightTrackerModal } from '../components/FlightTrackerModal';
import type { Flight } from '@flight-booking/models';

export function FlightsPage() {
  const { data: flights = [], isPending, error } = useFlights();
  const [trackedFlight, setTrackedFlight] = useState<Flight | null>(null);

  const fmt = (iso: string) =>
    new Date(iso).toLocaleString('en-ZA', { dateStyle: 'medium', timeStyle: 'short' });

  if (isPending) {
    return (
      <div className="loading">
        <div className="spinner" />
        <p>Loading flights…</p>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Available Flights</h1>
          <p className="subtitle">{flights.length} flights — click a row to track</p>
        </div>
      </div>

      {error && <div className="error-banner">Failed to load flights</div>}

      <div className="table-wrapper">
        <table className="flights-table">
          <thead>
            <tr>
              <th>Flight</th>
              <th>Airline</th>
              <th>Route</th>
              <th>Departure</th>
              <th>Arrival</th>
              <th>Class</th>
              <th>Price (ZAR)</th>
              <th>Seats</th>
              <th>Bookings</th>
            </tr>
          </thead>
          <tbody>
            {flights.map((f) => (
              <tr key={f.id} onClick={() => setTrackedFlight(f)} className="flights-table__row--clickable">
                <td className="flight-number">{f.flightNumber}</td>
                <td>{f.airline}</td>
                <td>
                  <span className="route-cell">
                    {f.origin} <span className="arrow">→</span> {f.destination}
                  </span>
                </td>
                <td>{fmt(f.departureTime)}</td>
                <td>{fmt(f.arrivalTime)}</td>
                <td>
                  <span className="cabin-badge">{f.cabinClass.toUpperCase()}</span>
                </td>
                <td className="price">R {Number(f.price).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</td>
                <td>{f.availableSeats}</td>
                <td>{f.bookingCount ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {trackedFlight && (
        <FlightTrackerModal flight={trackedFlight} onClose={() => setTrackedFlight(null)} />
      )}
    </div>
  );
}
