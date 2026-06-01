"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import {
  BOARDS,
  GENRES,
  LISTING_TYPES,
  SORT_OPTIONS,
  TIME_FILTER_OPTIONS,
  type ListingFiltersState,
} from "@/lib/constants";

type ListingFiltersProps = ListingFiltersState;

/**
 * Search and filter controls that sync state to URL query parameters.
 */
export function ListingFilters({
  q = "",
  board = "",
  genre = "",
  type = "",
  sort = "newest",
  when = "all",
}: ListingFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(q);

  /**
   * Navigates to the current route with updated filter query params.
   */
  function applyFilters(nextValues: Partial<ListingFiltersState>) {
    const params = new URLSearchParams(searchParams.toString());

    const merged = {
      q: query,
      board,
      genre,
      type,
      sort,
      when,
      ...nextValues,
    };

    for (const [key, value] of Object.entries(merged)) {
      if (key === "page") {
        continue;
      }

      if (value?.trim() && !(key === "when" && value === "all")) {
        params.set(key, value.trim());
      } else {
        params.delete(key);
      }
    }

    params.delete("page");

    router.push(`/?${params.toString()}`);
  }

  /**
   * Submits the text search and preserves active filters.
   */
  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    applyFilters({ q: query });
  }

  const selectClassName =
    "rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none ring-violet-500 focus:ring-2";

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSearchSubmit} className="flex w-full gap-2">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search titles and descriptions..."
          className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none ring-violet-500 placeholder:text-zinc-400 focus:ring-2"
        />
        <button
          type="submit"
          className="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700"
        >
          Search
        </button>
      </form>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-zinc-700">Board</span>
          <select
            value={board}
            onChange={(event) => applyFilters({ board: event.target.value })}
            className={selectClassName}
          >
            <option value="">All boards</option>
            {BOARDS.map((boardOption) => (
              <option key={boardOption.value} value={boardOption.value}>
                {boardOption.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-zinc-700">Genre</span>
          <select
            value={genre}
            onChange={(event) => applyFilters({ genre: event.target.value })}
            className={selectClassName}
          >
            <option value="">All genres</option>
            {GENRES.map((genreOption) => (
              <option key={genreOption} value={genreOption}>
                {genreOption}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-zinc-700">Listing type</span>
          <select
            value={type}
            onChange={(event) => applyFilters({ type: event.target.value })}
            className={selectClassName}
          >
            <option value="">All listings</option>
            {LISTING_TYPES.map((typeOption) => (
              <option key={typeOption.value} value={typeOption.value}>
                {typeOption.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-zinc-700">Posted</span>
          <select
            value={when}
            onChange={(event) => applyFilters({ when: event.target.value })}
            className={selectClassName}
          >
            {TIME_FILTER_OPTIONS.map((timeOption) => (
              <option key={timeOption.value} value={timeOption.value}>
                {timeOption.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-zinc-700">Sort by date</span>
          <select
            value={sort}
            onChange={(event) => applyFilters({ sort: event.target.value })}
            className={selectClassName}
          >
            {SORT_OPTIONS.map((sortOption) => (
              <option key={sortOption.value} value={sortOption.value}>
                {sortOption.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
