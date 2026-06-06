import Link from "next/link";
import { getCopyrightYear, LEGAL_PAGE_LINKS } from "@/lib/legal-config";

/**
 * Site-wide footer with links to legal pages.
 */
export function SiteFooter() {
  const year = getCopyrightYear();

  return (
    <footer className="mt-auto border-t border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-sm text-zinc-500">
          © {year} Berlin Musician Listings. Aggregated listings from public
          musician boards.
        </p>

        <nav
          aria-label="Legal"
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
    </footer>
  );
}
