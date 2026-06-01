"use client";

import {
  FormEvent,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import {
  BOARDS,
  GENRES,
  LISTING_TYPES,
  SORT_OPTIONS,
  TIME_FILTER_OPTIONS,
} from "@/lib/constants";
import { useListingFilters } from "@/hooks/use-listing-filters";

type PanelPosition = {
  top: number;
  left: number;
  width: number;
};

/**
 * Browse toolbar: search field and filters dropdown for the sticky nav bar.
 */
export function BrowseNavControls() {
  const filtersMenuId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [panelPosition, setPanelPosition] = useState<PanelPosition | null>(
    null,
  );
  const [mounted, setMounted] = useState(false);
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
    setMounted(true);
  }, []);

  /**
   * Positions the filters panel below the trigger button (viewport coordinates).
   */
  function updatePanelPosition() {
    const trigger = triggerRef.current;

    if (!trigger) {
      return;
    }

    const rect = trigger.getBoundingClientRect();
    const viewportPadding = 16;
    const panelWidth = Math.min(320, window.innerWidth - viewportPadding * 2);

    setPanelPosition({
      top: rect.bottom + 8,
      left: Math.min(
        Math.max(viewportPadding, rect.right - panelWidth),
        window.innerWidth - panelWidth - viewportPadding,
      ),
      width: panelWidth,
    });
  }

  useLayoutEffect(() => {
    if (!filtersOpen) {
      return;
    }

    updatePanelPosition();

    window.addEventListener("resize", updatePanelPosition);
    window.addEventListener("scroll", updatePanelPosition, true);

    return () => {
      window.removeEventListener("resize", updatePanelPosition);
      window.removeEventListener("scroll", updatePanelPosition, true);
    };
  }, [filtersOpen]);

  useEffect(() => {
    if (!filtersOpen) {
      return;
    }

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        panelRef.current?.contains(target) ||
        triggerRef.current?.contains(target)
      ) {
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

  const filtersButtonClassName = [
    "inline-flex w-full items-center justify-center gap-1.5 rounded-lg border px-3 py-2.5 text-sm font-medium transition sm:w-auto",
    filtersOpen || activeFilterCount > 0
      ? "border-violet-300 bg-violet-50 text-violet-800"
      : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50",
  ].join(" ");

  const filtersPanel =
    filtersOpen && panelPosition && mounted ? (
      <div
        id={filtersMenuId}
        ref={panelRef}
        role="dialog"
        aria-label="Listing filters"
        className="fixed z-[100] max-h-[min(70vh,24rem)] overflow-y-auto rounded-xl border border-zinc-200 bg-white p-4 shadow-xl"
        style={{
          top: panelPosition.top,
          left: panelPosition.left,
          width: panelPosition.width,
        }}
      >
        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-sm">
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

          <label className="flex flex-col gap-1 text-sm">
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

          <label className="flex flex-col gap-1 text-sm">
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

          <label className="flex flex-col gap-1 text-sm">
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

          <label className="flex flex-col gap-1 text-sm">
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
    ) : null;

  return (
    <>
      <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <form
          onSubmit={handleSearchSubmit}
          className="flex w-full min-w-0 gap-2 sm:min-w-0 sm:flex-1"
        >
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search listings..."
            className="min-w-0 flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none ring-violet-500 placeholder:text-zinc-400 focus:ring-2"
          />
          <button
            type="submit"
            className="shrink-0 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700"
          >
            Search
          </button>
        </form>

        <button
          ref={triggerRef}
          type="button"
          aria-expanded={filtersOpen}
          aria-controls={filtersMenuId}
          onClick={() => setFiltersOpen((open) => !open)}
          className={`${filtersButtonClassName} sm:shrink-0`}
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
      </div>

      {mounted && filtersPanel
        ? createPortal(filtersPanel, document.body)
        : null}
    </>
  );
}
