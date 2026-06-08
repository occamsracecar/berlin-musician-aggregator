import Link from "next/link";
import { buildGenrePageHref } from "@/lib/genre-listings";

type GenrePaginationProps = {
  parentSlug: string;
  page: number;
  total: number;
  pageSize: number;
  subSlug?: string;
};

/**
 * Renders previous/next page links for parent or subgenre listing grids.
 */
export function GenrePagination({
  parentSlug,
  page,
  total,
  pageSize,
  subSlug,
}: GenrePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  if (totalPages <= 1) {
    return null;
  }

  const hasPrevious = page > 1;
  const hasNext = page < totalPages;

  return (
    <nav
      aria-label="Genre listing pages"
      className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 pt-6"
    >
      {hasPrevious ? (
        <Link
          href={buildGenrePageHref(parentSlug, page - 1, subSlug)}
          className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-violet-200 hover:text-violet-700"
        >
          ← Previous
        </Link>
      ) : (
        <span className="rounded-lg border border-transparent px-4 py-2 text-sm text-zinc-400">
          ← Previous
        </span>
      )}

      <p className="text-sm text-zinc-500">
        Page {page} of {totalPages}
      </p>

      {hasNext ? (
        <Link
          href={buildGenrePageHref(parentSlug, page + 1, subSlug)}
          className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-violet-200 hover:text-violet-700"
        >
          Next →
        </Link>
      ) : (
        <span className="rounded-lg border border-transparent px-4 py-2 text-sm text-zinc-400">
          Next →
        </span>
      )}
    </nav>
  );
}
