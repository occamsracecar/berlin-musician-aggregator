/**
 * Compacts text to match the entries.search_blob column format.
 */
export function compactSearchBlobText(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9äöüß]/g, "");
}

/**
 * Normalizes a subgenre URL slug so it never repeats the parent segment (e.g. jazz/jazz → jazz/jazz-musicians).
 */
export function normalizeSubgenreSlug(
  parentSlug: string,
  slug: string,
): string {
  if (slug === parentSlug) {
    return `${slug}-musicians`;
  }

  return slug;
}

/**
 * Returns the canonical path for a subgenre page.
 */
export function getSubgenrePath(parentSlug: string, subSlug: string): string {
  return `/genre/${parentSlug}/${subSlug}`;
}
