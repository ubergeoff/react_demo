# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A full-stack **flight booking** application built as an NX 22 monorepo. The NestJS API talks to PostgreSQL via TypeORM; the React frontend fetches data with TanStack Query and uses Zustand for local state. A shared `libs/models` library provides TypeScript interfaces consumed by both apps.

## Commands

```bash
# Start everything for development (API + Web concurrently)
npm start

# Individual dev servers
npm run start:api     # NestJS on :3333
npm run start:web     # Vite on :5173

# Build
nx run api:build
nx run web:build

# Test
nx run api:test
nx run web:test

# Lint
nx run api:lint
nx run web:lint
```

### Database

Requires a running PostgreSQL instance. Use Docker Compose:

```bash
docker compose up -d
```

Default connection: `postgres:postgres@localhost:5432/flight_booking`. Override with env vars `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`. TypeORM `synchronize: true` is on — schema is kept in sync automatically in dev.

The seed service (`apps/api/src/seed/`) populates initial flight data on startup.

## Architecture

### Monorepo layout

```
apps/api        NestJS REST API
apps/api-e2e    Playwright E2E tests for the API
apps/web        React SPA
apps/web-e2e    Playwright E2E tests for the web app
libs/models     Shared TypeScript interfaces (Flight, Booking, Passenger, etc.)
```

The path alias `@flight-booking/models` resolves to `libs/models/src/index.ts` — use it in both apps instead of relative imports.

### API (`apps/api`)

NestJS modules: `AppModule` → `FlightsModule`, `BookingsModule`, `SeedModule`.

- **FlightsModule**: `FlightEntity` (TypeORM), `FlightsService`, `FlightsController`. Endpoints: `GET /api/flights`, `GET /api/flights/:id`.
- **BookingsModule**: `BookingEntity`, `BookingsService`, `BookingsController`. Endpoints: `GET /api/bookings`, `GET /api/bookings/:id`, `POST /api/bookings`, `PUT /api/bookings/:id`, `DELETE /api/bookings/:id`.

CORS is configured to allow `http://localhost:5173` (the Vite dev server). Global prefix: `/api`.

### Web (`apps/web`)

React 19 + React Router 7 SPA. Key patterns:

- **Data fetching**: TanStack Query (`@tanstack/react-query`) via custom hooks in `src/hooks/` (e.g. `useBookings`). Axios is the HTTP client pointing to `http://localhost:3333`.
- **State**: Zustand for UI/local state.
- **Pages**: `FlightsPage`, `BookingsPage` in `src/pages/`.
- **Components**: `BookingCard`, `CreateBookingModal`, `DeleteConfirmModal`, `FlightTrackerModal` in `src/components/`.
- **Maps**: `react-leaflet` + `leaflet` for flight route visualization.

### Shared models (`libs/models`)

Single source of truth for entity shapes. Both the NestJS DTOs and the React components import from here. When adding fields to a Flight or Booking, update `libs/models/src/lib/models.ts` first.
