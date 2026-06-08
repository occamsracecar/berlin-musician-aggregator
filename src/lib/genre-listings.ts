import { ENTRIES_PER_PAGE, parseListingPage } from "@/lib/constants";
import { compactSearchBlobText } from "@/lib/genre-match";
import type { ParentGenrePage } from "@/lib/genre-pages";
import { getAllParentGenres, getParentGenreBySlug } from "@/lib/genre-pages";
import type { SubgenrePage } from "@/lib/genre-subgenres";
import { getSubgenresForParent } from "@/lib/genre-subgenres";
import { escapeIlikePattern } from "@/lib/search";
import type { Entry } from "@/types/entry";

type FetchGenreEntriesResult = {
  entries: Entry[];
  total: number;
};

/**
 * Builds a PostgREST OR filter matching any subgenre keyword in search_blob.
 */
export function buildSubgenreSearchFilter(keywords: string[]): string {
  const clauses = new Set<string>();

  for (const keyword of keywords) {
    const compact = compactSearchBlobText(keyword);

    if (compact) {
      clauses.add(`search_blob.ilike.%${escapeIlikePattern(compact)}%`);
    }
  }

  return [...clauses].join(",");
}

/**
 * Builds a paginated URL for a parent or subgenre browse page.
 */
export function buildGenrePageHref(
  parentSlug: string,
  page: number,
  subSlug?: string,
): string {
  const base = subSlug
    ? `/genre/${parentSlug}/${subSlug}`
    : `/genre/${parentSlug}`;

  if (page <= 1) {
    return base;
  }

  return `${base}?page=${page}`;
}

/**
 * Formats the visible result range for a genre listing grid.
 */
export function formatGenreResultRange(
  page: number,
  total: number,
  visibleCount: number,
): string {
  if (total === 0) {
    return "No listings in this genre yet.";
  }

  const start = (page - 1) * ENTRIES_PER_PAGE + 1;
  const end = start + visibleCount - 1;

  return `Showing ${start.toLocaleString("de-DE")}–${end.toLocaleString("de-DE")} of ${total.toLocaleString("de-DE")} listing${total === 1 ? "" : "s"}`;
}

/**
 * Fetches paginated entries tagged with a parent genre.
 */
export async function fetchGenreEntries(
  genreTag: string,
  page: number,
): Promise<FetchGenreEntriesResult> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return { entries: [], total: 0 };
  }

  const { createSupabaseClient } = await import("@/lib/supabase/client");
  const supabase = createSupabaseClient();
  const from = (page - 1) * ENTRIES_PER_PAGE;
  const to = from + ENTRIES_PER_PAGE - 1;

  const { data, error, count } = await supabase
    .from("entries")
    .select("*", { count: "exact" })
    .contains("genres", [genreTag])
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("board_priority", { ascending: true })
    .range(from, to);

  if (error) {
    throw new Error(error.message);
  }

  return {
    entries: (data ?? []) as Entry[],
    total: count ?? 0,
  };
}

/**
 * Fetches paginated entries for a parent genre plus subgenre keywords.
 */
export async function fetchSubgenreEntries(
  subgenre: SubgenrePage,
  page: number,
): Promise<FetchGenreEntriesResult> {
  const parent = getParentGenreBySlug(subgenre.parentSlug);

  if (!parent) {
    return { entries: [], total: 0 };
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return { entries: [], total: 0 };
  }

  const { createSupabaseClient } = await import("@/lib/supabase/client");
  const supabase = createSupabaseClient();
  const from = (page - 1) * ENTRIES_PER_PAGE;
  const to = from + ENTRIES_PER_PAGE - 1;
  const keywordFilter = buildSubgenreSearchFilter(subgenre.keywords);

  const { data, error, count } = await supabase
    .from("entries")
    .select("*", { count: "exact" })
    .contains("genres", [parent.genreTag])
    .or(keywordFilter)
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("board_priority", { ascending: true })
    .range(from, to);

  if (error) {
    throw new Error(error.message);
  }

  return {
    entries: (data ?? []) as Entry[],
    total: count ?? 0,
  };
}

/**
 * Returns listing counts for each subgenre under a parent genre.
 */
export async function fetchSubgenreCountsForParent(
  parentSlug: string,
): Promise<Record<string, number>> {
  const subgenres = getSubgenresForParent(parentSlug);
  const counts: Record<string, number> = {};

  if (!subgenres.length) {
    return counts;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    for (const subgenre of subgenres) {
      counts[subgenre.slug] = 0;
    }
    return counts;
  }

  const parent = getParentGenreBySlug(parentSlug);

  if (!parent) {
    return counts;
  }

  const { createSupabaseClient } = await import("@/lib/supabase/client");
  const supabase = createSupabaseClient();

  await Promise.all(
    subgenres.map(async (subgenre) => {
      const { count, error } = await supabase
        .from("entries")
        .select("*", { count: "exact", head: true })
        .contains("genres", [parent.genreTag])
        .or(buildSubgenreSearchFilter(subgenre.keywords));

      if (error) {
        throw new Error(error.message);
      }

      counts[subgenre.slug] = count ?? 0;
    }),
  );

  return counts;
}

/**
 * Returns listing counts for all parent genre pages.
 */
export async function fetchParentGenreCounts(): Promise<
  Record<string, number>
> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const counts: Record<string, number> = {};

  if (!url || !anonKey) {
    for (const genre of getAllParentGenres()) {
      counts[genre.slug] = 0;
    }
    return counts;
  }

  const { createSupabaseClient } = await import("@/lib/supabase/client");
  const supabase = createSupabaseClient();

  await Promise.all(
    getAllParentGenres().map(async (genre: ParentGenrePage) => {
      const { count, error } = await supabase
        .from("entries")
        .select("*", { count: "exact", head: true })
        .contains("genres", [genre.genreTag]);

      if (error) {
        throw new Error(error.message);
      }

      counts[genre.slug] = count ?? 0;
    }),
  );

  return counts;
}

/**
 * Parses the page query param for genre browse pages.
 */
export function parseGenrePage(page?: string): number {
  return parseListingPage(page);
}
