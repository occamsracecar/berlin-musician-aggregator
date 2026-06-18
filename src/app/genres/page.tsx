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
  title: "Nach Genre stöbern",
  description:
    "Musiker- und Band-Inserate in Berlin nach Genre finden — Rock, Metal, Punk, Jazz, Electronic und mehr.",
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
            Berlin Bandhub
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900">
            Musiker nach Genre finden
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-600">
            Finde Bands und Musiker in Berlin nach Stil — von Rock und Metal bis
            Jazz, Electronic, Klassik und mehr. Jede Seite listet getaggte
            Inserate von lokalen Boards und Community-Beiträgen.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <p className="mb-6 text-sm text-zinc-500">
          {totalListings.toLocaleString("de-DE")} getaggte Inserate in{" "}
          {genres.length} Genres. Die Zählung umfasst Inserate mit mehreren
          Genre-Tags.
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
                    {genre.genreTag}-Inserate durchsuchen →
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="mt-8 text-sm text-zinc-500">
          Suchst du etwas Bestimmtes?{" "}
          <Link href="/" className="font-medium text-violet-600 hover:text-violet-800">
            Alle Inserate durchsuchen
          </Link>{" "}
          mit Filtern für Board, Inserattyp und Datum.
        </p>
      </main>
    </div>
  );
}
