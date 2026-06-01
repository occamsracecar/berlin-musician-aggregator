export const BOARDS = [
  { value: "berlinmusiker.de", label: "Berlin Musiker" },
  { value: "musiker-sucht.de", label: "Musiker-sucht" },
  { value: "noisy-rooms.com", label: "Noisy Rooms" },
  { value: "backstagepro.de", label: "Backstage PRO" },
  { value: "bandmix.de", label: "Bandmix" },
  { value: "community", label: "Community" },
] as const;

/** Lower numbers break ties when listings share the same published_at. */
export const BOARD_SORT_PRIORITY: Record<string, number> = {
  "noisy-rooms.com": 1,
  "backstagepro.de": 2,
  "berlinmusiker.de": 3,
  community: 4,
  "musiker-sucht.de": 5,
  "bandmix.de": 100,
};

export const GENRES = [
  "Metal",
  "Punk",
  "Rock",
  "Jazz",
  "Blues",
  "Pop",
  "Funk / Soul",
  "Hip-Hop",
  "Electronic",
  "Latin",
  "Folk / Acoustic",
  "Classical",
  "Reggae",
  "World",
] as const;

export const LISTING_TYPES = [
  { value: "band_seeking", label: "Band looking for musician" },
  { value: "musician_seeking", label: "Musician looking for band" },
] as const;

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
] as const;

export const TIME_FILTER_OPTIONS = [
  { value: "all", label: "All time" },
  { value: "month", label: "This month" },
  { value: "year", label: "This year" },
] as const;

export const ENTRIES_PER_PAGE = 50;
export const NEW_LISTING_DAYS = 7;

export type ListingFiltersState = {
  q?: string;
  board?: string;
  genre?: string;
  type?: string;
  sort?: string;
  when?: string;
  page?: string;
};

/**
 * Returns a friendly label for a board slug stored in the database.
 */
export function getBoardLabel(boardName: string): string {
  return BOARDS.find((board) => board.value === boardName)?.label ?? boardName;
}

/**
 * Returns the hostname used to resolve a board favicon, or null for community listings.
 */
export function getBoardFaviconHost(boardName: string): string | null {
  if (boardName === "community") {
    return null;
  }

  return boardName;
}

/**
 * Returns a favicon URL for a board slug, or null when no external site applies.
 */
export function getBoardFaviconUrl(boardName: string): string | null {
  const host = getBoardFaviconHost(boardName);

  if (!host) {
    return null;
  }

  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=32`;
}

/**
 * Returns a friendly label for a listing type value.
 */
export function getListingTypeLabel(listingType: string | null): string | null {
  if (!listingType) {
    return null;
  }

  return (
    LISTING_TYPES.find((type) => type.value === listingType)?.label ?? listingType
  );
}

/**
 * Parses a 1-based page number from URL query params.
 */
export function parseListingPage(page?: string): number {
  const parsed = Number.parseInt(page ?? "1", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

/**
 * Builds a browse URL preserving active filters and an optional page number.
 */
export function buildBrowseHref(
  filters: ListingFiltersState,
  page: number,
): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(filters)) {
    if (key === "page" || !value?.trim()) {
      continue;
    }
    params.set(key, value.trim());
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  const query = params.toString();
  return query ? `/?${query}` : "/";
}

/**
 * Returns the earliest published_at timestamp for a time filter value.
 */
export function getTimeFilterStart(when?: string): string | null {
  if (!when || when === "all") {
    return null;
  }

  const now = new Date();

  if (when === "month") {
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();
  }

  if (when === "year") {
    return new Date(Date.UTC(now.getUTCFullYear(), 0, 1)).toISOString();
  }

  return null;
}

/**
 * Returns whether a listing was published within the last week.
 */
export function isRecentListing(publishedAt: string | null): boolean {
  if (!publishedAt) {
    return false;
  }

  const published = new Date(publishedAt);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - NEW_LISTING_DAYS);

  return published >= cutoff;
}
