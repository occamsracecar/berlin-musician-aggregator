import Link from "next/link";
import type { Metadata } from "next";
import { AppNav } from "@/components/AppNav";
import {
  fetchParentGenreCounts,
} from "@/lib/genre-listings";
import {
  getAllParentGenres,
  getParentGenrePath,
} from "@/lib/genre-pages";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Browse by genre",
  description:
    "Browse musician and band listings in Berlin by genre — rock, metal, punk, jazz, electronic, and more.",
};

/**
 * Hub page linking to all parent genre category pages.
 */
export default async function GenresHubPage() {
  const genres = getAllParentGenres();
  const counts = await fetchParentGenreCounts();
  const totalListings = Object.values(counts).reduce(
    (sum, count) => sum + count,
    0,
  );

  return (
    <div className="min-h-full bg-zinc-50">
      <AppNav active="browse" />

      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
          <p className="text-sm font-medium uppercase tracking-wide text-violet-600">
            Berlin Musician Listings
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900">
            Browse musicians by genre
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-600">
            Find bands and musicians in Berlin by style — from rock and metal to
            jazz, electronic, classical, and more. Each page lists tagged
            postings from local boards and community submissions.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <p className="mb-6 text-sm text-zinc-500">
          {totalListings.toLocaleString("de-DE")} tagged listings across{" "}
          {genres.length} genres. Counts include listings with multiple genre
          tags.
        </p>

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {genres.map((genre) => {
            const count = counts[genre.slug] ?? 0;

            return (
              <li key={genre.slug}>
                <Link
                  href={getParentGenrePath(genre.slug)}
                  className="flex h-full flex-col rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-violet-200 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-lg font-semibold text-zinc-900">
                      {genre.genreTag}
                    </h2>
                    <span className="shrink-0 rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700">
                      {count.toLocaleString("de-DE")}
                    </span>
                  </div>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-600">
                    {genre.intro}
                  </p>
                  <p className="mt-4 text-sm font-medium text-violet-600">
                    Browse {genre.genreTag.toLowerCase()} listings →
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="mt-8 text-sm text-zinc-500">
          Looking for something specific?{" "}
          <Link href="/" className="font-medium text-violet-600 hover:text-violet-800">
            Search all listings
          </Link>{" "}
          with filters for board, listing type, and date.
        </p>
      </main>
    </div>
  );
}
