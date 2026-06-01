# Function Index

## Frontend (`src/`)

| File | Symbol | Description |
|------|--------|-------------|
| `src/app/page.tsx` | `fetchEntries()` | Fetches paginated entries with search, filters, and sort |
| `src/app/page.tsx` | `formatResultRange()` | Formats the visible listing range summary |
| `src/app/page.tsx` | `Home()` | Server page rendering filters and listing grid |
| `src/app/submit/page.tsx` | `SubmitPage()` | Community listing submission page |
| `src/app/actions/submit-listing.ts` | `submitListing()` | Server action to validate and insert community listings |
| `src/lib/supabase/client.ts` | `createSupabaseClient()` | Creates Supabase client for frontend reads |
| `src/lib/classify.ts` | `detectGenres()` | Tags genres from listing text on submit |
| `src/lib/constants.ts` | `getBoardLabel()` | Maps board slug to friendly label |
| `src/lib/constants.ts` | `getListingTypeLabel()` | Maps listing type to friendly label |
| `src/lib/constants.ts` | `parseListingPage()` | Parses a 1-based page number from URL params |
| `src/lib/constants.ts` | `getTimeFilterStart()` | Returns earliest date for a time filter |
| `src/lib/constants.ts` | `isRecentListing()` | Returns whether a listing is newer than one week |
| `src/components/ListingNewBadge.tsx` | `ListingNewBadge()` | Shiny badge for listings from the last 7 days |
| `src/components/ListingPagination.tsx` | `ListingPagination()` | Previous/next page navigation for browse results |
| `src/components/AppNav.tsx` | `AppNav()` | Browse / Submit navigation tabs |
| `src/components/ListingFilters.tsx` | `ListingFilters()` | Search, board, genre, type, and sort controls |
| `src/components/ListingFilters.tsx` | `applyFilters()` | Updates URL query params for server-side filtering |
| `src/components/SubmitListingForm.tsx` | `SubmitListingForm()` | Client form for posting community listings |
| `src/components/ListingCard.tsx` | `ListingCard()` | Renders listing card with preview, Details modal, and outbound link |
| `src/components/ListingDetailDialog.tsx` | `ListingDetailDialog()` | Modal showing full listing description and metadata |
| `src/types/entry.ts` | `Entry` | TypeScript type for database rows |

## Scraper (`scripts/`)

| File | Symbol | Description |
|------|--------|-------------|
| `scripts/scrape.js` | `runScrape()` | Main entry: runs all board scrapers and upserts |
| `scripts/lib/scrape-context.js` | `isIncrementalScrape()` | Whether to skip listings already in the database |
| `scripts/lib/scrape-context.js` | `loadKnownUrlsByBoard()` | Loads existing URLs per board for incremental scrapes |
| `scripts/scrape.js` | `scrapeBoard()` | Runs one board scraper; logs errors without stopping others |
| `scripts/lib/supabase.js` | `createScraperSupabaseClient()` | Admin Supabase client for scraper |
| `scripts/lib/supabase.js` | `upsertEntries()` | Batched upserts on `original_url` conflict |
| `scripts/lib/classify.js` | `detectGenres()` | Tags genres from listing text |
| `scripts/lib/classify.js` | `scoreListingType()` | Weighted band vs musician signal scoring |
| `scripts/lib/classify.js` | `detectListingType()` | Infers listing type from title and description |
| `scripts/lib/classify.js` | `classifyEntry()` | Adds genres and listing_type to entries |
| `scripts/lib/parallel-enrich.js` | `enrichEntriesInParallel()` | Fetches full listing text in parallel browser tabs |
| `scripts/boards/berlinmusiker.js` | `scrapeBerlinmusiker()` | Scrapes Berlinmusiker with category hints |
| `scripts/boards/musiker-sucht.js` | `extractMusikerSuchtDetailText()` | Parses full listing body from a detail page |
| `scripts/boards/musiker-sucht.js` | `enrichMusikerSuchtDetail()` | Fetches full body from musiker-sucht detail pages |
| `scripts/boards/musiker-sucht.js` | `scrapeMusikerSucht()` | Scrapes musiker-sucht with listing hints |
| `scripts/boards/noisy-rooms.js` | `scrapeNoisyRooms()` | Scrapes noisy-rooms.com community |
| `scripts/boards/backstagepro.js` | `buildListingUrl()` | Builds paginated Backstage PRO Berlin URL |
| `scripts/boards/backstagepro.js` | `parseRubrikHint()` | Maps Backstage rubrik to listing type hint |
| `scripts/boards/backstagepro.js` | `loadBackstageproPage()` | Loads index pages with retries until listings appear |
| `scripts/boards/backstagepro.js` | `loadBackstageproDetailPage()` | Loads detail pages with retries for enrichment |
| `scripts/boards/backstagepro.js` | `extractBackstageproDetailText()` | Parses Details and Werdegang from detail pages |
| `scripts/boards/backstagepro.js` | `enrichBackstageproDetail()` | Fetches full text from backstagepro detail pages |
| `scripts/boards/backstagepro.js` | `scrapeBackstagepro()` | Scrapes Berlin listings from backstagepro.de |
| `scripts/boards/bandmix.js` | `loadBandmixPage()` | Loads Bandmix pages through Cloudflare |
| `scripts/boards/bandmix.js` | `enrichBandmixDetail()` | Fetches full SUCHE/ÜBER text from profile pages |
| `scripts/boards/bandmix.js` | `scrapeBandmix()` | Scrapes Berlin profiles from bandmix.de |
| `scripts/boards/noisy-rooms.js` | `isTruncated()` | Detects index snippets that need detail-page enrichment |
| `scripts/boards/noisy-rooms.js` | `extractNoisyRoomsDetailText()` | Parses full listing body from a detail page |
| `scripts/boards/noisy-rooms.js` | `enrichNoisyRoomsDetail()` | Fetches full body from noisy-rooms detail pages |

## Database

| File | Description |
|------|-------------|
| `supabase/migrations/20260530120000_create_entries.sql` | Creates `entries` table |
| `supabase/migrations/20260531130000_add_entry_classification.sql` | Adds `listing_type` and `genres` columns |
| `supabase/migrations/20260531140000_add_community_submissions.sql` | Adds `contact_url` and community insert policy |
| `supabase/migrations/20260531150000_add_board_priority.sql` | Adds generated `board_priority` for browse sort order |

## Automation

| File | Description |
|------|-------------|
| `.github/workflows/scrape.yml` | Daily cron (06:00 UTC) + manual run; scrapes all boards, 120 min timeout |
