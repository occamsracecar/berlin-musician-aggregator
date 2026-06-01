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

**Daily GitHub Action (default):** only **new** listings — skips URLs already in the database and stops each board’s index crawl when it hits a page of known listings. Usually a few minutes unless many new posts appeared.

**Full scrape** (all boards, all detail pages, ~30–60 min):

```bash
npm run scrape:full
```

**Incremental scrape** (same as daily cron):

```bash
SCRAPE_INCREMENTAL=true npm run scrape
```

**Default local run** (`npm run scrape`) still scrapes everything for development.

Scrape one board only:

```bash
SCRAPE_BOARD=backstagepro.de npm run scrape
```

Boards: `berlinmusiker.de`, `musiker-sucht.de`, `noisy-rooms.com`, `backstagepro.de`, `bandmix.de`.

## Daily automated scrape

GitHub Actions runs **every day at 06:00 UTC** in **incremental** mode (new listings only).

Manual run in GitHub: **Actions → Scrape musician listings → Run workflow**. Leave **full scrape** unchecked for a fast daily-style run; check it only when you need to refresh every listing.

## Deploy frontend

Deploy the Next.js app to Vercel (or similar). Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in the host environment. Scraping stays on GitHub Actions (Playwright does not run on Vercel serverless by default).
