import { Suspense } from "react";
import { AppNav } from "@/components/AppNav";
import { ListingCard } from "@/components/ListingCard";
import { ListingFilters } from "@/components/ListingFilters";
import { ListingPagination } from "@/components/ListingPagination";
import {
  ENTRIES_PER_PAGE,
  getTimeFilterStart,
  type ListingFiltersState,
  parseListingPage,
} from "@/lib/constants";
import type { Entry } from "@/types/entry";

export const dynamic = "force-dynamic";

type FetchEntriesResult = {
  entries: Entry[];
  total: number;
};

/**
 * Fetches a paginated page of entries from Supabase with search and filters.
 */
async function fetchEntries(
  filters: ListingFiltersState,
  page: number,
): Promise<FetchEntriesResult> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return { entries: [], total: 0 };
  }

  const { createSupabaseClient } = await import("@/lib/supabase/client");
  const supabase = createSupabaseClient();
  const ascending = filters.sort === "oldest";
  const from = (page - 1) * ENTRIES_PER_PAGE;
  const to = from + ENTRIES_PER_PAGE - 1;

  let request = supabase.from("entries").select("*", { count: "exact" });

  if (filters.board) {
    request = request.eq("board_name", filters.board);
  }

  if (filters.genre) {
    request = request.contains("genres", [filters.genre]);
  }

  if (filters.type) {
    request = request.eq("listing_type", filters.type);
  }

  if (filters.q?.trim()) {
    const term = filters.q.trim();
    request = request.or(`title.ilike.%${term}%,description.ilike.%${term}%`);
  }

  const timeFilterStart = getTimeFilterStart(filters.when);
  if (timeFilterStart) {
    request = request.gte("published_at", timeFilterStart);
  }

  request = request
    .order("board_priority", { ascending: true })
    .order("published_at", {
      ascending,
      nullsFirst: false,
    })
    .range(from, to);

  const { data, error, count } = await request;

  if (error) {
    throw new Error(error.message);
  }

  return {
    entries: (data ?? []) as Entry[],
    total: count ?? 0,
  };
}

/**
 * Formats the visible result range for the listing summary line.
 */
function formatResultRange(
  page: number,
  total: number,
  visibleCount: number,
): string {
  if (total === 0) {
    return "No listings matched your filters.";
  }

  const start = (page - 1) * ENTRIES_PER_PAGE + 1;
  const end = start + visibleCount - 1;

  return `Showing ${start.toLocaleString("de-DE")}–${end.toLocaleString("de-DE")} of ${total.toLocaleString("de-DE")} listing${total === 1 ? "" : "s"}`;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<ListingFiltersState>;
}) {
  const params = await searchParams;
  const filters: ListingFiltersState = {
    q: params.q ?? "",
    board: params.board ?? "",
    genre: params.genre ?? "",
    type: params.type ?? "",
    sort: params.sort ?? "newest",
    when: params.when ?? "all",
    page: params.page ?? "",
  };
  const page = parseListingPage(filters.page);
  const { entries, total } = await fetchEntries(filters, page);

  return (
    <div className="min-h-full bg-zinc-50">
      <AppNav active="browse" />

      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:px-6">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-violet-600">
              Berlin Musician Aggregator
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900">
              Musician Listings
            </h1>
            <p className="mt-2 text-sm text-zinc-600">
              Aggregated search board listings from Berlin musician communities.
            </p>
          </div>

          <Suspense fallback={<div className="h-32 rounded-lg bg-zinc-100" />}>
            <ListingFilters {...filters} />
          </Suspense>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <p className="mb-4 text-sm text-zinc-500">
          {formatResultRange(page, total, entries.length)}
        </p>

        {entries.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-10 text-center">
            <p className="text-sm text-zinc-600">
              No listings matched your filters.
            </p>
          </div>
        ) : (
          <>
            <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {entries.map((entry) => (
                <li key={entry.id} className="h-full">
                  <ListingCard entry={entry} />
                </li>
              ))}
            </ul>

            <ListingPagination
              filters={filters}
              page={page}
              total={total}
              pageSize={ENTRIES_PER_PAGE}
            />
          </>
        )}
      </main>
    </div>
  );
}
