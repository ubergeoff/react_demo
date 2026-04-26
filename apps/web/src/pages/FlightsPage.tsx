import { useEffect } from 'react';
import { useFlightsStore } from '../store/flights.store';

export function FlightsPage() {
  const { flights, isLoading, error, fetchFlights } = useFlightsStore();

  useEffect(() => {
    fetchFlights();
  }, [fetchFlights]);

  const fmt = (iso: string) =>
    new Date(iso).toLocaleString('en-ZA', { dateStyle: 'medium', timeStyle: 'short' });

  if (isLoading && flights.length === 0) {
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
        <h1>Available Flights</h1>
        <p className="subtitle">{flights.length} flights</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

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
            </tr>
          </thead>
          <tbody>
            {flights.map((f) => (
              <tr key={f.id}>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
