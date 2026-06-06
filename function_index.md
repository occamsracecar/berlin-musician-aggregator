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
| `src/app/actions/update-listing.ts` | `updateListing()` | Updates the signed-in user's community listing |
| `src/app/actions/delete-listing.ts` | `deleteListing()` | Deletes the signed-in user's community listing |
| `src/app/actions/delete-account.ts` | `deleteAccount()` | Permanently deletes user, listings, and avatar |
| `src/components/DeleteAccountSection.tsx` | `DeleteAccountSection()` | Profile danger-zone account deletion form |
| `src/lib/listing-form.ts` | `parseListingFormData()` | Shared validation for create/edit listing forms |
| `src/components/ListingFormFields.tsx` | `ListingFormFields()` | Shared listing form fields |
| `src/components/UserListingsSection.tsx` | `UserListingsSection()` | Profile section listing user's posts |
| `src/components/UserListingEditor.tsx` | `UserListingEditor()` | Single listing row with inline edit |
| `src/app/actions/send-listing-message.ts` | `sendListingMessage()` | Saves message and emails owner via profile contact_email |
| `src/lib/supabase/client.ts` | `createSupabaseClient()` | Creates Supabase client for anonymous reads |
| `src/lib/supabase/server.ts` | `createSupabaseServerClient()` | Cookie-based Supabase client for server/actions |
| `src/lib/supabase/browser.ts` | `createSupabaseBrowserClient()` | Browser Supabase client for auth UI |
| `src/lib/supabase/admin.ts` | `createSupabaseAdminClient()` | Service-role client for account deletion |
| `src/lib/email.ts` | `sendListingMessageEmail()` | Emails listing owner (HTML + reply-to) |
| `src/lib/email.ts` | `sendListingMessageConfirmationEmail()` | Sends sender a copy of their message |
| `src/lib/email.ts` | `isEmailConfigured()` | Whether RESEND_API_KEY is set |
| `src/lib/email.ts` | `sendListingMessageConfirmationEmail()` | Sends sender a copy of their message |
| `src/lib/email.ts` | `isEmailConfigured()` | Whether RESEND_API_KEY is set |
| `src/lib/site-url.ts` | `PRODUCTION_CANONICAL_ORIGIN` | Hardcoded production domain (`berlinbandhub.de`) |
| `src/lib/site-url.ts` | `getCanonicalSiteOrigin()` | Production origin from env or hardcoded fallback |
| `src/lib/site-url.ts` | `buildCanonicalRedirectUrl()` | Canonical redirect; fixes OAuth `?code=` on `/` |
| `src/lib/site-url.ts` | `getAuthRedirectOrigin()` | Auth callback redirect target (custom domain) |
| `src/lib/site-url.ts` | `hostsMatchSiteDomain()` | Compares hosts ignoring www prefix |
| `src/lib/site-url.ts` | `shouldRedirectToCanonicalHost()` | Redirect only `*.vercel.app`, not www ↔ apex |
| `src/lib/site-url.ts` | `buildOAuthCallbackRecoveryUrl()` | Fixes Supabase OAuth landing on `/` with `?code=` |
| `src/lib/site-url.ts` | `getSiteOrigin()` | Public site origin for email links |
| `src/lib/sitemap-urls.ts` | `getSitemapEntries()` | Sitemap URLs for static pages and listings |
| `src/lib/sitemap-urls.ts` | `getStaticSitemapEntries()` | Homepage and legal routes for sitemap |
| `src/app/robots.ts` | `robots()` | robots.txt generation |
| `src/app/sitemap.ts` | `sitemap()` | XML sitemap for crawlers |
| `src/lib/profile-email.ts` | `parseContactEmail()` | Validates profile contact email |
| `src/lib/listings.ts` | `isCommunityListing()` | Community board listing with author |
| `src/lib/listings.ts` | `canReceiveListingMessages()` | Whether listing supports email contact |
| `src/lib/listings.ts` | `isUserSubmittedListing()` | Whether listing has a `created_by` author |
| `src/components/ListingDeepLink.tsx` | `ListingDeepLink()` | Opens detail modal from `?listing=` URL |
| `src/components/ProfileMessagesSection.tsx` | `ProfileMessagesSection()` | Inbox of messages on user's listings |
| `src/components/ProfileMessagesSection.tsx` | `buildProfileListingMessages()` | Joins messages with titles and senders |
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
| `src/components/SiteLogo.tsx` | `SiteLogo()` | Site logo in nav and auth (`public/logo.png`) |
| `src/components/SiteFooter.tsx` | `SiteFooter()` | Site-wide footer with legal page links |
| `src/components/LegalPageShell.tsx` | `LegalPageShell()` | Shared layout for legal pages |
| `src/components/LegalSection.tsx` | `LegalSection()` | Section heading block on legal pages |
| `src/app/impressum/page.tsx` | `ImpressumPage()` | Impressum (legal notice) page |
| `src/app/datenschutz/page.tsx` | `PrivacyPage()` | Privacy policy (GDPR) page |
| `src/app/nutzungsbedingungen/page.tsx` | `TermsPage()` | Terms of use page |
| `src/lib/legal-config.ts` | `getLegalContactEmail()` | Optional legal contact email from env |
| `src/lib/legal-config.ts` | `LEGAL_SERVICE_NAME` | Site name on legal pages (no personal details) |
| `src/lib/legal-config.ts` | `LEGAL_PAGE_LINKS` | Footer links to legal routes |
| `src/lib/site-branding.ts` | `SITE_LOGO_SOURCES` | Public logo paths and alt text |
| `src/components/AuthPageBrand.tsx` | `AuthPageBrand()` | Logo and heading on login page |
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
| `scripts/scrape-backstage.sh` | `already_ran_today()` | Whether Backstage scrape succeeded today (daily guard) |
| `scripts/scrape-backstage.sh` | `mark_ran_today()` | Records successful Backstage scrape date |
| `scripts/scrape-backstage.sh` | — | Backstage incremental scrape wrapper (unlock + manual) |
| `scripts/backstage-unlock-watcher.swift` | `runScrapeWrapper()` | Spawns scrape on macOS screen unlock |
| `scripts/backstage-unlock-watcher.swift` | `main()` | LaunchAgent entry: listens for unlock notifications |
| `scripts/install-backstage-launch-agent.sh` | `compile_watcher()` | Builds Swift unlock watcher binary |
| `scripts/install-backstage-launch-agent.sh` | `install_agent()` | macOS LaunchAgent: unlock watcher (KeepAlive) |
| `scripts/install-backstage-launch-agent.sh` | `show_status()` | Watcher load state, last success date, log tail |
| `scripts/scrape.js` | `runScrape()` | Main entry: runs all board scrapers and upserts |
| `scripts/lib/page-utils.js` | `dismissConsentDialogs()` | Closes cookie banners before scraping |
| `scripts/lib/page-utils.js` | `blockHeavyAssets()` | Skips images/fonts on CI for faster loads |
| `scripts/lib/page-utils.js` | `isBotChallengePage()` | Detects Cloudflare interstitial pages |
| `scripts/lib/scrape-context.js` | `loadKnownUrlsByBoard()` | Loads existing URLs per board for incremental scrapes |
| `scripts/scrape.js` | `scrapeBoard()` | Runs one board scraper; logs errors without stopping others |
| `scripts/lib/supabase.js` | `createScraperSupabaseClient()` | Admin Supabase client for scraper |
| `scripts/lib/supabase.js` | `upsertEntries()` | Batched upserts on `original_url` conflict |
| `scripts/lib/classify.js` | `detectGenres()` | Tags genres from listing text |
| `scripts/lib/classify.js` | `scoreListingType()` | Weighted band vs musician signal scoring |
| `scripts/lib/classify.js` | `detectListingType()` | Infers listing type from title and description |
| `scripts/lib/date-utils.js` | `extractPublicationDateFromText()` | Parses dates embedded in Backstage feedhide text |
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
| `supabase/migrations/20260606180000_profile_contact_email_backfill.sql` | Backfill profile contact_email from auth.users for messaging |

## Automation

| File | Description |
|------|-------------|
| `.github/workflows/scrape.yml` | Daily cron (06:00 UTC) + manual; GitHub boards only (not Backstage — Cloudflare) |
| `docs/GOOGLE_SEARCH_CONSOLE.md` | GSC verification, sitemap submit, indexing |
| `docs/BACKSTAGE_LOCAL_SCRAPE.md` | Local Backstage screen-unlock watcher setup for macOS |
