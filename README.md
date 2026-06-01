# Berlin Musician Aggregator

Aggregates musician listings from Berlin boards into one searchable directory (Next.js + Supabase).

## Local development

```bash
npm install
npx playwright install chromium
cp .env.example .env.local
# Fill in Supabase URL and keys from your project dashboard
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scraping

Scrape all boards and upsert into Supabase (new listings are inserted; existing URLs are updated):

```bash
npm run scrape
```

Scrape one board only:

```bash
SCRAPE_BOARD=backstagepro.de npm run scrape
```

Boards: `berlinmusiker.de`, `musiker-sucht.de`, `noisy-rooms.com`, `backstagepro.de`, `bandmix.de`.

A full run takes about 20–40 minutes (Bandmix and Noisy Rooms fetch detail pages).

## Daily automated scrape

GitHub Actions runs **every day at 06:00 UTC** (`.github/workflows/scrape.yml`):

1. Installs dependencies and Playwright Chromium
2. Runs `npm run scrape` for **all five boards**
3. Upserts rows on `original_url` so new listings are always added

### One-time setup (GitHub repo)

1. Push this repo to GitHub.
2. In the repo: **Settings → Secrets and variables → Actions → New repository secret**
   - `SUPABASE_URL` — your project URL (same as `NEXT_PUBLIC_SUPABASE_URL`)
   - `SUPABASE_SERVICE_ROLE_KEY` — service role key (not the anon key)
3. **Actions** tab → enable workflows if prompted.
4. Run **Scrape musician listings** manually once via **Run workflow** to verify.

If one board fails (timeout, site change), the workflow still upserts the other boards and exits with a warning.

## Deploy frontend

Deploy the Next.js app to Vercel (or similar). Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in the host environment. Scraping stays on GitHub Actions (Playwright does not run on Vercel serverless by default).
