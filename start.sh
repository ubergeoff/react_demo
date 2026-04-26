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
  [[ -n "$WEB_PID" ]] && kill "$WEB_PID" 2>/dev/null && ok "React stopped"
  [[ -n "$API_PID" ]] && kill "$API_PID" 2>/dev/null && ok "NestJS stopped"
}
trap cleanup EXIT INT TERM

# ── 1. Start Postgres via Rancher / Docker ─────────────────────────────────────
log "Starting Postgres (Docker / Rancher)…"

# Prefer 'rdctl' (Rancher Desktop CLI) if available, fall back to plain docker compose
if command -v rdctl &>/dev/null; then
  COMPOSE_CMD="rdctl shell -- docker compose"
elif command -v docker &>/dev/null; then
  COMPOSE_CMD="docker compose"
else
  err "Neither 'rdctl' nor 'docker' is available. Please start Rancher Desktop first."
fi

cd "$ROOT_DIR"
$COMPOSE_CMD up -d --build postgres
ok "Postgres container started"

# ── 2. Wait for Postgres to be healthy ────────────────────────────────────────
log "Waiting for Postgres to be ready…"
RETRIES=30
until $COMPOSE_CMD exec -T postgres pg_isready -U postgres -d flight_booking &>/dev/null; do
  RETRIES=$((RETRIES - 1))
  [[ $RETRIES -eq 0 ]] && err "Postgres did not become ready in time."
  sleep 2
done
ok "Postgres is ready"

# ── 3. Start NestJS API ────────────────────────────────────────────────────────
log "Starting NestJS API on :3333…"
cd "$ROOT_DIR"
npx nx serve api &
API_PID=$!
ok "NestJS starting (PID $API_PID)"

# ── 4. Start React frontend ────────────────────────────────────────────────────
log "Starting React frontend on :5173…"
npx nx serve web &
WEB_PID=$!
ok "React starting (PID $WEB_PID)"

# ── 5. Done ───────────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  SkyBook Flight Booking App is starting up!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "  Frontend : ${CYAN}http://localhost:5173${NC}"
echo -e "  API      : ${CYAN}http://localhost:3333/api${NC}"
echo -e "  Postgres : ${CYAN}localhost:5432 / flight_booking${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

wait
