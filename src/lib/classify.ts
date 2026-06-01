import { GENRES } from "@/lib/constants";
import { GENRE_RULES } from "@/lib/genre-rules";

export const MAX_LISTING_GENRE_TAGS = 8;

/**
 * Validates genre tag values submitted from a form against the allowed list.
 */
export function parseSubmittedGenres(values: FormDataEntryValue[]): string[] {
  const allowed = new Set<string>(GENRES);
  const selected: string[] = [];

  for (const raw of values) {
    const genre = String(raw).trim();

    if (allowed.has(genre) && !selected.includes(genre)) {
      selected.push(genre);
    }
  }

  return selected.slice(0, MAX_LISTING_GENRE_TAGS);
}

/**
 * Combines user-selected tags with genres inferred from title and description.
 */
export function mergeListingGenres(
  selectedGenres: string[],
  title: string,
  description: string,
): string[] {
  const detected = detectGenres(title, description);
  return [...new Set([...selectedGenres, ...detected])].slice(
    0,
    MAX_LISTING_GENRE_TAGS,
  );
}

/**
 * Detects genre tags from listing title and description text.
 */
export function detectGenres(title: string, description: string): string[] {
  const normalized = `${title} ${description}`.toLowerCase();
  const genres: string[] = [];

  for (const rule of GENRE_RULES) {
    if (rule.keywords.some((keyword) => normalized.includes(keyword))) {
      genres.push(rule.genre);
    }
  }

  return genres;
}
