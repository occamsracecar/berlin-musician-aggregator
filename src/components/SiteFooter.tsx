import Link from "next/link";
import { getAllParentGenres, getParentGenrePath } from "@/lib/genre-pages";
import { getCopyrightYear, LEGAL_PAGE_LINKS } from "@/lib/legal-config";
import { SITE_NAME } from "@/lib/site-branding";

/**
 * Site-wide footer with parent genre pages and legal links.
 */
export function SiteFooter() {
  const year = getCopyrightYear();
  const parentGenres = getAllParentGenres();

  return (
    <footer className="mt-auto border-t border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6">
        <nav aria-label="Genres">
          <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            <Link href="/genres" className="transition hover:text-violet-600">
              Genres
            </Link>
          </p>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
            {parentGenres.map((genre) => (
              <li key={genre.slug}>
                <Link
                  href={getParentGenrePath(genre.slug)}
                  className="font-medium text-zinc-600 transition hover:text-violet-600"
                >
                  {genre.genreTag}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-zinc-500">
            © {year} {SITE_NAME}. Aggregierte Anzeigen von öffentlichen
            Musikerbörsen.
          </p>

          <nav
            aria-label="Rechtliches"
            className="flex flex-wrap gap-x-5 gap-y-2 text-sm"
          >
            {LEGAL_PAGE_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-medium text-zinc-600 transition hover:text-violet-600"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
