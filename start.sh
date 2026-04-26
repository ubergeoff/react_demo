#!/usr/bin/env bash
set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ── Colours ────────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'
log()  { echo -e "${CYAN}[start]${NC} $1"; }
ok()   { echo -e "${GREEN}[✓]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }
err()  { echo -e "${RED}[✗]${NC} $1"; exit 1; }

# ── Cleanup on exit ────────────────────────────────────────────────────────────
API_PID=""
WEB_PID=""

cleanup() {
  echo ""
  log "Shutting down…"
  [[ -n "$WEB_PID" ]] && kill "$WEB_PID" 2>/dev/null && ok "React stopped" || true
  [[ -n "$API_PID" ]] && kill "$API_PID" 2>/dev/null && ok "NestJS stopped" || true
}
trap cleanup EXIT INT TERM

# ── 1. Start Postgres via Rancher / Docker ─────────────────────────────────────
log "Starting Postgres (Docker / Rancher)…"

# Detect how to run docker compose
COMPOSE_CMD=""
if command -v docker &>/dev/null; then
  ok "Found Docker"
  COMPOSE_CMD="docker compose"
elif command -v rdctl &>/dev/null; then
  ok "Found Rancher Desktop (rdctl)"
  # For Windows with Rancher, use rdctl but without the -- syntax
  COMPOSE_CMD="rdctl shell docker compose"
else
  err "Neither 'docker' nor 'rdctl' is available. Please start Docker/Rancher Desktop first."
fi

cd "$ROOT_DIR"
log "Running: $COMPOSE_CMD up -d --build postgres"
if ! eval "$COMPOSE_CMD up -d --build postgres"; then
  err "Failed to start Postgres container. Check that Docker/Rancher is running properly."
fi
ok "Postgres container started"

# ── 2. Wait for Postgres to be healthy ────────────────────────────────────────
log "Waiting for Postgres to be ready…"
RETRIES=30
while [ $RETRIES -gt 0 ]; do
  if eval "$COMPOSE_CMD exec -T postgres pg_isready -U postgres -d flight_booking" &>/dev/null; then
    ok "Postgres is ready"
    break
  fi
  RETRIES=$((RETRIES - 1))
  if [ $RETRIES -eq 0 ]; then
    err "Postgres did not become ready in time (tried 30 times, 60 seconds)"
  fi
  warn "Postgres not ready yet... waiting (${RETRIES} retries left)"
  sleep 2
done

# ── 3. Start NestJS API ────────────────────────────────────────────────────────
log "Starting NestJS API on :3333…"
cd "$ROOT_DIR"
npx nx serve api > api.log 2>&1 &
API_PID=$!
ok "NestJS starting (PID $API_PID) - logs in api.log"

# ── 4. Start React frontend ────────────────────────────────────────────────────
log "Starting React frontend on :5173…"
npx nx serve web > web.log 2>&1 &
WEB_PID=$!
ok "React starting (PID $WEB_PID) - logs in web.log"

# ── 5. Done ───────────────────────────────────────────────────────────────────
sleep 3
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  SkyBook Flight Booking App is starting up!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "  Frontend : ${CYAN}http://localhost:5173${NC}"
echo -e "  API      : ${CYAN}http://localhost:3333/api${NC}"
echo -e "  Postgres : ${CYAN}localhost:5432 / flight_booking${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
warn "View logs: tail -f api.log / tail -f web.log"
echo ""

wait
