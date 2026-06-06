#!/usr/bin/env bash
set -euo pipefail

# Incremental Backstage PRO scrape for login-triggered scheduling (bypasses GitHub Cloudflare blocks).
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG_DIR="${HOME}/Library/Logs/berlin-musicians"
LOG_FILE="${LOG_DIR}/backstage-scrape.log"
STAMP_FILE="${LOG_DIR}/backstage-scrape-last-success.date"

# Returns whether a successful scrape already completed today (local date).
already_ran_today() {
  [[ -f "$STAMP_FILE" ]] && [[ "$(cat "$STAMP_FILE")" == "$(date +%Y-%m-%d)" ]]
}

# Records today's date after a successful scrape (once-per-login-day guard).
mark_ran_today() {
  date +%Y-%m-%d >"$STAMP_FILE"
}

mkdir -p "$LOG_DIR"

{
  echo "=== $(date -Iseconds) Backstage scrape start ==="

  if [[ "${BACKSTAGE_SCRAPE_FORCE:-}" != "1" ]] && already_ran_today; then
    echo "Skipping: already succeeded today ($(cat "$STAMP_FILE")). Set BACKSTAGE_SCRAPE_FORCE=1 to rerun."
    echo "=== $(date -Iseconds) Backstage scrape skipped ==="
    exit 0
  fi

  cd "$ROOT_DIR"

  if [[ ! -f ".env.local" ]]; then
    echo "ERROR: Missing .env.local in $ROOT_DIR"
    exit 1
  fi

  export PATH="/opt/homebrew/bin:/usr/local/bin:${PATH}"

  if SCRAPE_BOARD=backstagepro.de SCRAPE_INCREMENTAL=true node scripts/scrape.js; then
    mark_ran_today
    echo "=== $(date -Iseconds) Backstage scrape done (success) ==="
  else
    exit_code=$?
    echo "=== $(date -Iseconds) Backstage scrape failed (exit ${exit_code}) ==="
    exit "$exit_code"
  fi
} >>"$LOG_FILE" 2>&1
