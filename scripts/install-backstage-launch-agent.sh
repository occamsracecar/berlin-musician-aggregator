#!/usr/bin/env bash
set -euo pipefail

# Installs a macOS LaunchAgent that watches screen unlock and runs Backstage scrape once per day.
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WRAPPER="${ROOT_DIR}/scripts/scrape-backstage.sh"
WATCHER_SRC="${ROOT_DIR}/scripts/backstage-unlock-watcher.swift"
WATCHER_BIN="${ROOT_DIR}/scripts/.build/backstage-unlock-watcher"
LABEL="com.berlinmusicians.scrape-backstage"
PLIST_PATH="${HOME}/Library/LaunchAgents/${LABEL}.plist"
LOG_DIR="${HOME}/Library/Logs/berlin-musicians"
STAMP_FILE="${LOG_DIR}/backstage-scrape-last-success.date"

usage() {
  cat <<EOF
Usage: $(basename "$0") [install|uninstall|status]

  install    Run Backstage scrape on screen unlock (once per day max)
  uninstall  Remove the unlock watcher
  status     Show whether the agent is loaded

Requires: .env.local with Supabase keys, npm dependencies, Playwright chromium, swiftc (Xcode CLT).
Runs when you unlock your Mac (password after lock). Also checks once when the watcher starts.
Force a rerun: BACKSTAGE_SCRAPE_FORCE=1 bash scripts/scrape-backstage.sh
EOF
}

# Unloads the LaunchAgent from the current GUI session if present.
unload_agent() {
  if launchctl print "gui/$(id -u)/${LABEL}" &>/dev/null; then
    launchctl bootout "gui/$(id -u)" "$PLIST_PATH" 2>/dev/null || true
  fi
}

# Compiles the Swift unlock watcher binary used by the LaunchAgent.
compile_watcher() {
  if ! command -v swiftc &>/dev/null; then
    echo "ERROR: swiftc not found. Install Xcode Command Line Tools: xcode-select --install"
    exit 1
  fi

  mkdir -p "$(dirname "$WATCHER_BIN")"
  swiftc -O -o "$WATCHER_BIN" "$WATCHER_SRC"
  chmod +x "$WATCHER_BIN"
}

# Writes the plist and loads the persistent unlock watcher.
install_agent() {
  if [[ ! -x "$WRAPPER" ]]; then
    chmod +x "$WRAPPER"
  fi

  if [[ ! -f "${ROOT_DIR}/.env.local" ]]; then
    echo "ERROR: Create ${ROOT_DIR}/.env.local first (copy from .env.example)."
    exit 1
  fi

  compile_watcher
  mkdir -p "$LOG_DIR" "${HOME}/Library/LaunchAgents"

  unload_agent
  rm -f "$PLIST_PATH"

  cat >"$PLIST_PATH" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>${LABEL}</string>
  <key>ProgramArguments</key>
  <array>
    <string>${WATCHER_BIN}</string>
  </array>
  <key>WorkingDirectory</key>
  <string>${ROOT_DIR}</string>
  <key>EnvironmentVariables</key>
  <dict>
    <key>BACKSTAGE_SCRAPE_WRAPPER</key>
    <string>${WRAPPER}</string>
  </dict>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <true/>
  <key>StandardOutPath</key>
  <string>${LOG_DIR}/unlock-watcher-stdout.log</string>
  <key>StandardErrorPath</key>
  <string>${LOG_DIR}/unlock-watcher-stderr.log</string>
</dict>
</plist>
EOF

  launchctl bootstrap "gui/$(id -u)" "$PLIST_PATH"
  echo "Installed Backstage scrape on screen unlock."
  echo "Plist: ${PLIST_PATH}"
  echo "Watcher log: ${LOG_DIR}/backstage-unlock-watcher.log"
  echo "Scrape log:  ${LOG_DIR}/backstage-scrape.log"
  echo ""
  echo "Lock your screen (Cmd+Ctrl+Q), unlock with your password — scrape runs if not done today."
  echo "Test now: ${WRAPPER}"
}

# Removes the LaunchAgent plist and unloads it.
uninstall_agent() {
  unload_agent
  rm -f "$PLIST_PATH"
  echo "Removed ${LABEL}."
}

# Prints load state, last success date, and recent log lines.
show_status() {
  if [[ -f "$PLIST_PATH" ]]; then
    echo "Plist: ${PLIST_PATH}"
    if plutil -p "$PLIST_PATH" 2>/dev/null | grep -q "unlock-watcher"; then
      echo "Trigger: screen unlock (+ once when watcher starts)"
    elif plutil -p "$PLIST_PATH" 2>/dev/null | grep -q "scrape-backstage.sh"; then
      echo "Trigger: legacy login-only (re-run install to switch to unlock watcher)"
    fi
  else
    echo "Plist: not installed"
  fi

  if [[ -f "$STAMP_FILE" ]]; then
    echo "Last success: $(cat "$STAMP_FILE")"
  else
    echo "Last success: never"
  fi

  if launchctl print "gui/$(id -u)/${LABEL}" &>/dev/null; then
    echo "Status: loaded"
    launchctl print "gui/$(id -u)/${LABEL}" | grep -E "state =|last exit|runs =" || true
  else
    echo "Status: not loaded"
  fi

  if [[ -f "${LOG_DIR}/backstage-unlock-watcher.log" ]]; then
    echo ""
    echo "Watcher log (last lines):"
    tail -3 "${LOG_DIR}/backstage-unlock-watcher.log"
  fi

  if [[ -f "${LOG_DIR}/backstage-scrape.log" ]]; then
    echo ""
    echo "Scrape log (last lines):"
    tail -5 "${LOG_DIR}/backstage-scrape.log"
  fi
}

ACTION="${1:-install}"

case "$ACTION" in
  install) install_agent ;;
  uninstall) uninstall_agent ;;
  status) show_status ;;
  *) usage; exit 1 ;;
esac
