import { GENRE_RULES } from "@/lib/genre-rules";

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
