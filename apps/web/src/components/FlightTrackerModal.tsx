import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Polyline, Marker, useMap, CircleMarker, Tooltip } from 'react-leaflet';
import { useEffect } from 'react';
import type { Flight } from '@flight-booking/models';

const AIRPORT_COORDS: Record<string, [number, number]> = {
  JNB: [-26.1392, 28.246],
  CPT: [-33.9648, 18.6017],
  LHR: [51.4775, -0.4614],
  JFK: [40.6413, -73.7781],
  DXB: [25.2532, 55.3657],
  SYD: [-33.9399, 151.1753],
  DOH: [25.2731, 51.6083],
  CDG: [49.0097, 2.5479],
  FRA: [50.0379, 8.5622],
  NRT: [35.772, 140.3929],
  LAX: [33.9425, -118.4081],
  MIA: [25.7959, -80.287],
};

function extractIATA(location: string): string {
  const m = location.match(/\(([A-Z]{3})\)/);
  return m ? m[1] : '';
}

function lerp(a: [number, number], b: [number, number], t: number): [number, number] {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

function bearing(from: [number, number], to: [number, number]): number {
  const lat1 = (from[0] * Math.PI) / 180;
  const lat2 = (to[0] * Math.PI) / 180;
  const dLon = ((to[1] - from[1]) * Math.PI) / 180;
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

function makePlaneIcon(angle: number) {
  return L.divIcon({
    html: `<div style="width:36px;height:36px;display:flex;align-items:center;justify-content:center;transform:rotate(${angle}deg);">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
        <path fill="#1d4ed8" stroke="#fff" stroke-width="0.5"
          d="M21 16v-2l-8-5V3.5C13 2.67 12.33 2 11.5 2S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"/>
      </svg>
    </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    className: '',
  });
}

function FitBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(L.latLngBounds(positions), { padding: [50, 50] });
  }, [map]);
  return null;
}

interface Props {
  flight: Flight;
  onClose: () => void;
}

export function FlightTrackerModal({ flight, onClose }: Props) {
  const originCode = extractIATA(flight.origin);
  const destCode = extractIATA(flight.destination);
  const originCoords = AIRPORT_COORDS[originCode];
  const destCoords = AIRPORT_COORDS[destCode];

  const now = Date.now();
  const dep = new Date(flight.departureTime).getTime();
  const arr = new Date(flight.arrivalTime).getTime();
  const raw = (now - dep) / (arr - dep);
  const progress = Math.min(1, Math.max(0, raw));

  let status: string;
  let statusClass: string;
  if (raw < 0) {
    status = 'Scheduled — not yet departed';
    statusClass = 'tracker-status tracker-status--scheduled';
  } else if (raw > 1) {
    status = 'Landed';
    statusClass = 'tracker-status tracker-status--landed';
  } else {
    const pct = Math.round(progress * 100);
    status = `In flight — ${pct}% of route completed`;
    statusClass = 'tracker-status tracker-status--inflight';
  }

  if (!originCoords || !destCoords) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <h2>Flight Tracker — {flight.flightNumber}</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: 12 }}>
            Airport coordinates not available for this route.
          </p>
          <div className="form-actions" style={{ marginTop: 20 }}>
            <button className="btn btn--secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    );
  }

  const planePos = lerp(originCoords, destCoords, progress);
  const angle = bearing(originCoords, destCoords);
  const planeIcon = makePlaneIcon(angle);

  const routePositions: [number, number][] = [originCoords, destCoords];
  const flownPositions: [number, number][] = [originCoords, planePos];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal--tracker" onClick={(e) => e.stopPropagation()}>
        <div className="tracker-header">
          <div>
            <h2 className="tracker-title">
              {flight.flightNumber} — {flight.airline}
            </h2>
            <p className="tracker-route">
              {flight.origin} → {flight.destination}
            </p>
          </div>
          <button className="tracker-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className={statusClass}>{status}</div>

        <div className="tracker-map-wrapper">
          <MapContainer
            center={planePos}
            zoom={4}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />

            {/* Full route (faint) */}
            <Polyline positions={routePositions} color="#94a3b8" weight={2} dashArray="6 6" />

            {/* Flown portion */}
            <Polyline positions={flownPositions} color="#1d4ed8" weight={3} />

            {/* Origin */}
            <CircleMarker center={originCoords} radius={7} pathOptions={{ color: '#1d4ed8', fillColor: '#fff', fillOpacity: 1, weight: 2 }}>
              <Tooltip permanent direction="top" offset={[0, -10]}>{originCode}</Tooltip>
            </CircleMarker>

            {/* Destination */}
            <CircleMarker center={destCoords} radius={7} pathOptions={{ color: '#1d4ed8', fillColor: '#fff', fillOpacity: 1, weight: 2 }}>
              <Tooltip permanent direction="top" offset={[0, -10]}>{destCode}</Tooltip>
            </CircleMarker>

            {/* Plane */}
            <Marker position={planePos} icon={planeIcon} />

            <FitBounds positions={routePositions} />
          </MapContainer>
        </div>

        <div className="tracker-footer">
          <span>Dep: {new Date(flight.departureTime).toLocaleString('en-ZA', { dateStyle: 'medium', timeStyle: 'short' })}</span>
          <span>Arr: {new Date(flight.arrivalTime).toLocaleString('en-ZA', { dateStyle: 'medium', timeStyle: 'short' })}</span>
        </div>
      </div>
    </div>
  );
}
