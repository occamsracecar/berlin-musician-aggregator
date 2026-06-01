"use client";

import { FormEvent, useEffect, useId, useRef, useState } from "react";
import {
  BOARDS,
  GENRES,
  LISTING_TYPES,
  SORT_OPTIONS,
  TIME_FILTER_OPTIONS,
} from "@/lib/constants";
import { useListingFilters } from "@/hooks/use-listing-filters";

/**
 * Browse toolbar: search field and filters dropdown for the sticky nav bar.
 */
export function BrowseNavControls() {
  const filtersMenuId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const {
    query,
    setQuery,
    board,
    genre,
    type,
    sort,
    when,
    applyFilters,
    activeFilterCount,
  } = useListingFilters();

  useEffect(() => {
    if (!filtersOpen) {
      return;
    }

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;

      if (panelRef.current?.contains(target)) {
        return;
      }

      setFiltersOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFiltersOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [filtersOpen]);

  /**
   * Submits the text search and preserves active filters.
   */
  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    applyFilters({ q: query });
  }

  const selectClassName =
    "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-violet-500 focus:ring-2";

  return (
    <div className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-2 sm:gap-3">
      <form
        onSubmit={handleSearchSubmit}
        className="flex min-w-0 flex-1 basis-[12rem] gap-2 sm:max-w-md"
      >
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search listings..."
          className="min-w-0 flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-violet-500 placeholder:text-zinc-400 focus:ring-2"
        />
        <button
          type="submit"
          className="shrink-0 rounded-lg bg-violet-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-violet-700 sm:px-4"
        >
          Search
        </button>
      </form>

      <div className="relative shrink-0" ref={panelRef}>
        <button
          type="button"
          aria-expanded={filtersOpen}
          aria-controls={filtersMenuId}
          onClick={() => setFiltersOpen((open) => !open)}
          className={[
            "inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition",
            filtersOpen || activeFilterCount > 0
              ? "border-violet-300 bg-violet-50 text-violet-800"
              : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50",
          ].join(" ")}
        >
          Filters
          {activeFilterCount > 0 ? (
            <span className="rounded-full bg-violet-600 px-1.5 py-0.5 text-xs font-semibold text-white">
              {activeFilterCount}
            </span>
          ) : null}
          <span aria-hidden className="text-zinc-400">
            {filtersOpen ? "▴" : "▾"}
          </span>
        </button>

        {filtersOpen ? (
          <div
            id={filtersMenuId}
            className="absolute right-0 z-30 mt-2 w-[min(100vw-2rem,20rem)] rounded-xl border border-zinc-200 bg-white p-4 shadow-lg"
          >
            <div className="flex flex-col gap-3">
              <label className="flex flex-col gap-1 text-sm">
                <span className="font-medium text-zinc-700">Board</span>
                <select
                  value={board}
                  onChange={(event) =>
                    applyFilters({ board: event.target.value })
                  }
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

              <label className="flex flex-col gap-1 text-sm">
                <span className="font-medium text-zinc-700">Genre</span>
                <select
                  value={genre}
                  onChange={(event) =>
                    applyFilters({ genre: event.target.value })
                  }
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

              <label className="flex flex-col gap-1 text-sm">
                <span className="font-medium text-zinc-700">Listing type</span>
                <select
                  value={type}
                  onChange={(event) =>
                    applyFilters({ type: event.target.value })
                  }
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

              <label className="flex flex-col gap-1 text-sm">
                <span className="font-medium text-zinc-700">Posted</span>
                <select
                  value={when}
                  onChange={(event) =>
                    applyFilters({ when: event.target.value })
                  }
                  className={selectClassName}
                >
                  {TIME_FILTER_OPTIONS.map((timeOption) => (
                    <option key={timeOption.value} value={timeOption.value}>
                      {timeOption.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1 text-sm">
                <span className="font-medium text-zinc-700">Sort by date</span>
                <select
                  value={sort}
                  onChange={(event) =>
                    applyFilters({ sort: event.target.value })
                  }
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
        ) : null}
      </div>
    </div>
  );
}
