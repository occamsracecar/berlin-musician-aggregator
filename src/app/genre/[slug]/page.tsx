import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppNav } from "@/components/AppNav";
import { GenrePagination } from "@/components/GenrePagination";
import { ListingCard } from "@/components/ListingCard";
import { ENTRIES_PER_PAGE } from "@/lib/constants";
import {
  fetchGenreEntries,
  formatGenreResultRange,
  parseGenrePage,
} from "@/lib/genre-listings";
import {
  getAllParentGenres,
  getParentGenreBySlug,
  getParentGenrePath,
} from "@/lib/genre-pages";
import { attachAuthorProfiles } from "@/lib/profiles";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const revalidate = 3600;

type GenrePageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

/**
 * Pre-renders all parent genre category pages at build time.
 */
export function generateStaticParams() {
  return getAllParentGenres().map((genre) => ({ slug: genre.slug }));
}

/**
 * Builds unique metadata for each parent genre page.
 */
export async function generateMetadata({
  params,
}: GenrePageProps): Promise<Metadata> {
  const { slug } = await params;
  const genre = getParentGenreBySlug(slug);

  if (!genre) {
    return { title: "Genre not found" };
  }

  return {
    title: genre.title,
    description: genre.metaDescription,
    openGraph: {
      title: genre.title,
      description: genre.metaDescription,
    },
  };
}

/**
 * Parent genre category page with paginated listings.
 */
export default async function GenrePage({
  params,
  searchParams,
}: GenrePageProps) {
  const { slug } = await params;
  const query = await searchParams;
  const genre = getParentGenreBySlug(slug);

  if (!genre) {
    notFound();
  }

  const page = parseGenrePage(query.page);
  const [{ entries, total }, supabase] = await Promise.all([
    fetchGenreEntries(genre.genreTag, page),
    createSupabaseServerClient(),
  ]);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const entriesWithAuthors = await attachAuthorProfiles(supabase, entries);

  return (
    <div className="min-h-full bg-zinc-50">
      <AppNav active="browse" />

      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
          <nav aria-label="Breadcrumb" className="text-sm text-zinc-500">
            <Link href="/genres" className="font-medium hover:text-violet-600">
              Genres
            </Link>
            <span className="mx-2">/</span>
            <span className="text-zinc-700">{genre.genreTag}</span>
          </nav>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900">
            {genre.title}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-600">
            {genre.intro}
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <p className="mb-4 text-sm text-zinc-500">
          {formatGenreResultRange(page, total, entriesWithAuthors.length)}
        </p>

        {entriesWithAuthors.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-10 text-center">
            <p className="text-sm text-zinc-600">
              No listings tagged with {genre.genreTag} yet.
            </p>
            <p className="mt-3 text-sm">
              <Link href="/" className="font-medium text-violet-600 hover:text-violet-800">
                Browse all listings
              </Link>{" "}
              or{" "}
              <Link
                href={getParentGenrePath("rock")}
                className="font-medium text-violet-600 hover:text-violet-800"
              >
                try another genre
              </Link>
              .
            </p>
          </div>
        ) : (
          <>
            <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {entriesWithAuthors.map((entry) => (
                <li key={entry.id} className="h-full">
                  <ListingCard entry={entry} isSignedIn={Boolean(user)} />
                </li>
              ))}
            </ul>

            <GenrePagination
              slug={slug}
              page={page}
              total={total}
              pageSize={ENTRIES_PER_PAGE}
            />
          </>
        )}

        <p className="mt-8 text-sm text-zinc-500">
          <Link href="/genres" className="font-medium text-violet-600 hover:text-violet-800">
            ← All genres
          </Link>
          {" · "}
          <Link
            href={`/?genre=${encodeURIComponent(genre.genreTag)}`}
            className="font-medium text-violet-600 hover:text-violet-800"
          >
            Open in main search
          </Link>
        </p>
      </main>
    </div>
  );
}
