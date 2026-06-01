# Function Index

## Frontend (`src/`)

| File | Symbol | Description |
|------|--------|-------------|
| `src/app/page.tsx` | `fetchEntries()` | Fetches paginated entries with search, filters, and sort |
| `src/app/page.tsx` | `formatResultRange()` | Formats the visible listing range summary |
| `src/app/page.tsx` | `Home()` | Server page rendering filters and listing grid |
| `src/app/submit/page.tsx` | `SubmitPage()` | Community listing submission page (signed-in) |
| `src/app/login/page.tsx` | `LoginPage()` | Email and Google sign-in / sign-up |
| `src/app/auth/callback/route.ts` | `GET` | OAuth and email confirmation callback |
| `src/app/actions/submit-listing.ts` | `submitListing()` | Inserts community listing for authenticated user |
| `src/app/actions/send-listing-message.ts` | `sendListingMessage()` | Saves message and emails listing owner |
| `src/lib/supabase/client.ts` | `createSupabaseClient()` | Creates Supabase client for anonymous reads |
| `src/lib/supabase/server.ts` | `createSupabaseServerClient()` | Cookie-based Supabase client for server/actions |
| `src/lib/supabase/browser.ts` | `createSupabaseBrowserClient()` | Browser Supabase client for auth UI |
| `src/lib/supabase/admin.ts` | `createSupabaseAdminClient()` | Service-role client for owner email lookup |
| `src/lib/email.ts` | `sendListingMessageEmail()` | Sends contact message via Resend |
| `src/lib/listings.ts` | `isUserSubmittedListing()` | Whether listing supports in-app messaging |
| `middleware.ts` | `middleware()` | Session refresh; protects `/submit` |
| `src/components/AuthForm.tsx` | `AuthForm()` | Email/password and Google auth form |
| `src/components/NavAuth.tsx` | `NavAuth()` | Sign in / sign out in nav |
| `src/components/ContactListingDialog.tsx` | `ContactListingDialog()` | Message modal for listing authors |
| `src/components/ListingContactActions.tsx` | `ListingContactActions()` | Send message and outbound links |
| `src/app/profile/page.tsx` | `ProfilePage()` | User profile settings page |
| `src/app/actions/update-profile.ts` | `updateProfile()` | Saves profile and social URLs |
| `src/lib/profiles.ts` | `attachAuthorProfiles()` | Joins author profiles onto listings |
| `src/lib/profile-urls.ts` | `validateSocialUrl()` | Validates music platform URLs |
| `src/components/ProfileForm.tsx` | `ProfileForm()` | Profile edit form |
| `src/components/ProfileAvatarUpload.tsx` | `ProfileAvatarUpload()` | Drag-and-drop avatar upload |
| `src/components/ProfileSocialIcons.tsx` | `ProfileSocialIcons()` | Platform icon links on listings |
| `src/components/ProfileAuthorStrip.tsx` | `ProfileAuthorStrip()` | Avatar + social row on listing cards |
| `src/lib/classify.ts` | `parseSubmittedGenres()` | Validates genre tags from submit form |
| `src/lib/classify.ts` | `mergeListingGenres()` | Merges selected and auto-detected genre tags |
| `src/lib/classify.ts` | `detectGenres()` | Tags genres from listing text on submit |
| `src/lib/search.ts` | `parseSearchTokens()` | Normalizes query words for order-free search |
| `src/lib/search.ts` | `buildSearchOrFilter()` | PostgREST OR filter for compact phrase or all words in any order |
| `src/lib/constants.ts` | `getBoardLabel()` | Maps board slug to friendly label |
| `src/lib/constants.ts` | `getBoardFaviconHost()` | Hostname for board favicon lookup |
| `src/lib/constants.ts` | `getBoardFaviconUrl()` | Favicon URL for a board slug |
| `src/components/BoardTag.tsx` | `BoardTag()` | Board pill with favicon and label |
| `src/components/BoardTag.tsx` | `CommunityBoardIcon()` | Inline icon for community listings |
| `src/lib/constants.ts` | `getListingTypeLabel()` | Maps listing type to friendly label |
| `src/lib/constants.ts` | `parseListingPage()` | Parses a 1-based page number from URL params |
| `src/lib/constants.ts` | `getTimeFilterStart()` | Returns earliest date for a time filter |
| `src/lib/constants.ts` | `isRecentListing()` | Returns whether a listing is newer than one week |
| `src/components/ListingNewBadge.tsx` | `ListingNewBadge()` | Shiny badge for listings from the last 7 days |
| `src/components/ListingPagination.tsx` | `ListingPagination()` | Previous/next page navigation for browse results |
| `src/components/AppNav.tsx` | `AppNav()` | Browse / Submit navigation tabs |
| `src/hooks/use-listing-filters.ts` | `useListingFilters()` | Syncs browse filters with URL search params |
| `src/components/BrowseNavControls.tsx` | `BrowseNavControls()` | Nav search bar and filters dropdown |
| `src/components/AppNav.tsx` | `AppNav()` | Top nav tabs; optional sticky bar and children |
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
| `scripts/lib/date-utils.js` | `parseBandmixActivityDate()` | Maps Bandmix “Aktiv …” labels to estimated last-active dates |
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
| `supabase/migrations/20260531150000_add_board_priority.sql` | Adds generated `board_priority` for browse tie-breakers |
| `supabase/migrations/20260601130000_reindex_entries_by_date.sql` | Index for date-first browse sort (board_priority secondary) |
| `supabase/migrations/20260601140000_fix_bandmix_published_at.sql` | Backfill Bandmix published_at from activity labels |
| `supabase/migrations/20260601150000_deprioritize_bandmix_dates.sql` | Subtract 7 days from all Bandmix published_at values |
| `supabase/migrations/20260601120000_add_search_blob.sql` | Adds space-insensitive `search_blob` for generous text search |
| `supabase/migrations/20260602120000_user_profiles_and_messages.sql` | Profiles, `created_by`, listing messages, auth RLS |
| `supabase/migrations/20260602140000_profile_social_and_avatars.sql` | Profile social URLs, avatar storage bucket |

## Automation

| File | Description |
|------|-------------|
| `.github/workflows/scrape.yml` | Daily cron (06:00 UTC) + manual run; scrapes all boards, 120 min timeout |
