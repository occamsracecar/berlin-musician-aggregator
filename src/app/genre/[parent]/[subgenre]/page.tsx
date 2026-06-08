import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppNav } from "@/components/AppNav";
import { GenrePagination } from "@/components/GenrePagination";
import { ListingCard } from "@/components/ListingCard";
import { ENTRIES_PER_PAGE } from "@/lib/constants";
import {
  fetchSubgenreEntries,
  formatGenreResultRange,
  parseGenrePage,
} from "@/lib/genre-listings";
import { getParentGenreBySlug, getParentGenrePath } from "@/lib/genre-pages";
import {
  getAllSubgenres,
  getSubgenreBySlug,
} from "@/lib/genre-subgenres";
import { attachAuthorProfiles } from "@/lib/profiles";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const revalidate = 3600;

type SubgenrePageProps = {
  params: Promise<{ parent: string; subgenre: string }>;
  searchParams: Promise<{ page?: string }>;
};

/**
 * Pre-renders all subgenre category pages at build time.
 */
export function generateStaticParams() {
  return getAllSubgenres().map((subgenre) => ({
    parent: subgenre.parentSlug,
    subgenre: subgenre.slug,
  }));
}

/**
 * Builds unique metadata for each subgenre page.
 */
export async function generateMetadata({
  params,
}: SubgenrePageProps): Promise<Metadata> {
  const { parent, subgenre } = await params;
  const page = getSubgenreBySlug(parent, subgenre);

  if (!page) {
    return { title: "Genre not found" };
  }

  return {
    title: page.title,
    description: page.metaDescription,
    openGraph: {
      title: page.title,
      description: page.metaDescription,
    },
  };
}

/**
 * Subgenre category page with paginated listings.
 */
export default async function SubgenrePage({
  params,
  searchParams,
}: SubgenrePageProps) {
  const { parent, subgenre } = await params;
  const query = await searchParams;
  const subgenrePage = getSubgenreBySlug(parent, subgenre);
  const parentGenre = getParentGenreBySlug(parent);

  if (!subgenrePage || !parentGenre) {
    notFound();
  }

  const page = parseGenrePage(query.page);
  const [{ entries, total }, supabase] = await Promise.all([
    fetchSubgenreEntries(subgenrePage, page),
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
            <Link
              href={getParentGenrePath(parent)}
              className="font-medium hover:text-violet-600"
            >
              {parentGenre.genreTag}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-zinc-700">{subgenrePage.name}</span>
          </nav>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900">
            {subgenrePage.title}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-600">
            {subgenrePage.intro}
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
              No {subgenrePage.name.toLowerCase()} listings matched this filter
              yet.
            </p>
            <p className="mt-3 text-sm">
              <Link
                href={getParentGenrePath(parent)}
                className="font-medium text-violet-600 hover:text-violet-800"
              >
                Browse all {parentGenre.genreTag.toLowerCase()} listings
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
              parentSlug={parent}
              subSlug={subgenre}
              page={page}
              total={total}
              pageSize={ENTRIES_PER_PAGE}
            />
          </>
        )}

        <p className="mt-8 text-sm text-zinc-500">
          <Link
            href={getParentGenrePath(parent)}
            className="font-medium text-violet-600 hover:text-violet-800"
          >
            ← All {parentGenre.genreTag.toLowerCase()} listings
          </Link>
          {" · "}
          <Link href="/genres" className="font-medium text-violet-600 hover:text-violet-800">
            All genres
          </Link>
        </p>
      </main>
    </div>
  );
}
