import Link from "next/link";
import { getSubgenrePath } from "@/lib/genre-match";
import type { SubgenrePage } from "@/lib/genre-subgenres";

type GenreSubgenreNavProps = {
  subgenres: SubgenrePage[];
  counts: Record<string, number>;
};

/**
 * Links to subgenre pages from a parent genre page.
 */
export function GenreSubgenreNav({
  subgenres,
  counts,
}: GenreSubgenreNavProps) {
  const visible = subgenres.filter((subgenre) => (counts[subgenre.slug] ?? 0) > 0);

  if (!visible.length) {
    return null;
  }

  return (
    <section className="mb-8 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
        Browse by style
      </h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        {visible.map((subgenre) => (
          <li key={subgenre.slug}>
            <Link
              href={getSubgenrePath(subgenre.parentSlug, subgenre.slug)}
              className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
            >
              {subgenre.name}
              <span className="text-xs text-zinc-500">
                {(counts[subgenre.slug] ?? 0).toLocaleString("de-DE")}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
