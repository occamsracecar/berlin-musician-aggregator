# Backstage PRO local scrape

GitHub Actions cannot scrape Backstage reliably — Cloudflare blocks datacenter IPs with a **“Nur einen Moment…”** page. Run Backstage from **your Mac** instead (your home IP usually works).

## One-off manual run

```bash
npm run scrape:backstage
```

Uses incremental mode: new listings plus a daily refresh of page 1 (dates/metadata). Bypasses the once-per-day guard.

## Automatic run on screen unlock (macOS)

Install a **LaunchAgent** that watches for **screen unlock** (when you enter your password after locking):

```bash
npm run scrape:backstage:install
```

Behavior:

- Runs when you **unlock** your Mac (Cmd+Ctrl+Q lock, then password)
- Runs **at most once per calendar day** — later unlocks the same day are skipped
- Also checks once when the watcher starts (covers days you never lock the screen)

Check status or recent log lines:

```bash
npm run scrape:backstage:status
```

Remove the unlock watcher:

```bash
npm run scrape:backstage:uninstall
```

Force another run the same day:

```bash
BACKSTAGE_SCRAPE_FORCE=1 bash scripts/scrape-backstage.sh
```

### Requirements

- `.env.local` with `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
- `npm ci` and `npx playwright install chromium` already done
- **Xcode Command Line Tools** (`swiftc`) — `xcode-select --install` if missing
- Mac **logged in** to your user account (watcher starts at login and stays running)

### Logs

- Scrape: `~/Library/Logs/berlin-musicians/backstage-scrape.log`
- Unlock watcher: `~/Library/Logs/berlin-musicians/backstage-unlock-watcher.log`

Test immediately without locking:

```bash
bash scripts/scrape-backstage.sh
```

Test the unlock hook: lock screen → unlock → check `npm run scrape:backstage:status`.

## Split with GitHub Actions

| Source | Boards |
|--------|--------|
| GitHub Actions (06:00 UTC) | berlinmusiker, musiker-sucht, noisy-rooms, bandmix |
| Your Mac (on unlock) | **backstagepro.de** |
