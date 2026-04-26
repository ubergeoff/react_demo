# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**SkyBook** — a flight booking app built as an NX monorepo with:
- `apps/web` — React 19 frontend (Vite, React Router v7, Zustand, TanStack Query, Axios)
- `apps/api` — NestJS backend (TypeORM, Postgres)
- `libs/models` — shared TypeScript interfaces/enums imported by both apps as `@flight-booking/models`

## Commands

```bash
# Start everything (Postgres via Docker + API + Web)
bash start.sh

# Run individual apps
npm run start:api    # NestJS on :3333
npm run start:web    # React on :5173

# NX targets
npx nx run web:test          # Vitest (frontend unit tests)
npx nx run api-e2e:e2e       # Playwright e2e
npx nx run web:lint
npx nx run api:lint
npx nx run web:build
npx nx run api:build
```

## Infrastructure

Postgres runs in Docker. `start.sh` handles starting the container, waiting for readiness, then launching both servers. DB config via env vars: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` (defaults: `localhost:5432/flight_booking`, user/pass `postgres`). TypeORM `synchronize: true` — schema is auto-managed, no migrations.

The API seeds the database on first boot (`SeedService.onApplicationBootstrap`) only when the flights table is empty.

## Architecture

### Shared models (`libs/models`)
All domain types (`Flight`, `Booking`, `Passenger`, `CreateBookingDto`, `UpdateBookingDto`, `BookingStatus`, `CabinClass`, `ApiResponse`) live here and are imported by both the API and web with the `@flight-booking/models` path alias. Changes here affect both apps.

### API (`apps/api`)
- NestJS modules: `FlightsModule`, `BookingsModule`, `SeedModule`
- Each module follows the pattern: `*.entity.ts` (TypeORM) → `*.service.ts` → `*.controller.ts`
- All routes are prefixed `/api`
- CORS allows `http://localhost:5173` (or `CORS_ORIGIN` env var)

### Web (`apps/web`)
- **State**: Zustand stores (`bookings.store.ts`, `flights.store.ts`) own async operations and call `apps/web/src/lib/api.ts` directly
- **API client**: single Axios instance in `src/lib/api.ts`, base URL from `VITE_API_URL` env var
- **Routing**: two pages — `/` (BookingsPage) and `/flights` (FlightsPage)
- **Styling**: plain CSS in `src/styles.css` (no CSS-in-JS, no Tailwind)
