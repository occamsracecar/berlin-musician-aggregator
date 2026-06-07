import { ENTRIES_PER_PAGE, parseListingPage } from "@/lib/constants";
import type { ParentGenrePage } from "@/lib/genre-pages";
import { getAllParentGenres } from "@/lib/genre-pages";
import type { Entry } from "@/types/entry";

type FetchGenreEntriesResult = {
  entries: Entry[];
  total: number;
};

/**
 * Builds a paginated URL for a parent genre browse page.
 */
export function buildGenrePageHref(slug: string, page: number): string {
  if (page <= 1) {
    return `/genre/${slug}`;
  }

  return `/genre/${slug}?page=${page}`;
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
