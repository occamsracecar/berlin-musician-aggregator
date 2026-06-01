/**
 * Splits a search query into normalized tokens (order-independent, spaces removed).
 */
export function parseSearchTokens(query: string): string[] {
  return query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.replace(/[\s\-_]+/g, ""))
    .filter((word) => word.length > 0);
}

/**
 * Escapes user input for safe use inside PostgREST ilike patterns.
 */
export function escapeIlikePattern(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/%/g, "\\%").replace(/_/g, "\\_");
}

/**
 * Builds a single PostgREST AND clause requiring every token to match search_blob.
 */
function buildAndClause(tokens: string[]): string {
  return `and(${tokens.map((token) => `search_blob.ilike.%${escapeIlikePattern(token)}%`).join(",")})`;
}

/**
 * Builds the PostgREST OR filter for generous search (compact phrase or all words).
 */
export function buildSearchOrFilter(query: string): string | null {
  const words = parseSearchTokens(query);

  if (!words.length) {
    return null;
  }

  const clauses = new Set<string>();
  const compact = words.join("");

  if (compact.length > 0) {
    clauses.add(`search_blob.ilike.%${escapeIlikePattern(compact)}%`);
  }

  if (words.length > 1) {
    clauses.add(buildAndClause(words));
  }

  return [...clauses].join(",");
}

type SearchableQuery = {
  or: (filters: string) => SearchableQuery;
};

/**
 * Applies generous search: compact match (e.g. power+trip) OR every word in any order.
 */
export function applySearchFilter<T extends SearchableQuery>(
  request: T,
  query: string,
): T {
  const filter = buildSearchOrFilter(query);

  if (!filter) {
    return request;
  }

  return request.or(filter) as T;
}
