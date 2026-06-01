"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { ListingFiltersState } from "@/lib/constants";

/**
 * Syncs listing filter state with URL search params and applies updates.
 */
export function useListingFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");

  const board = searchParams.get("board") ?? "";
  const genre = searchParams.get("genre") ?? "";
  const type = searchParams.get("type") ?? "";
  const sort = searchParams.get("sort") ?? "newest";
  const when = searchParams.get("when") ?? "all";

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

  /**
   * Navigates to browse with merged filter query params.
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

  const activeFilterCount = [
    board,
    genre,
    type,
    when !== "all" ? when : "",
    sort !== "newest" ? sort : "",
  ].filter(Boolean).length;

  return {
    query,
    setQuery,
    board,
    genre,
    type,
    sort,
    when,
    applyFilters,
    activeFilterCount,
  };
}
