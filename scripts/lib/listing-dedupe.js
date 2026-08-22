/** Minimum normalized body length before two listings are treated as the same ad. */
const MIN_BODY_LENGTH = 80;

/**
 * Collapses whitespace so equivalent listing bodies share a fingerprint.
 */
function normalizeListingBody(text) {
  return String(text || "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

/**
 * Returns a board-scoped content key, or null when the body is too short to dedupe.
 */
function listingContentKey(boardName, description) {
  if (!boardName || boardName === "community") {
    return null;
  }

  const body = normalizeListingBody(description);

  if (body.length < MIN_BODY_LENGTH) {
    return null;
  }

  return `${boardName}\n${body}`;
}

/**
 * Reads a trailing numeric source id from a listing URL (Berlinmusiker /id/123.html).
 */
function extractSourceId(originalUrl) {
  const match = String(originalUrl || "").match(/\/id\/(\d+)(?:\.html)?/i);

  if (match) {
    return Number(match[1]);
  }

  return 0;
}

/**
 * Scores noisy-rooms (and similar) URLs so canonical paths beat index.php aliases.
 */
function canonicalUrlScore(originalUrl) {
  const url = String(originalUrl || "");
  let score = 0;

  if (!url.includes("/index.php")) {
    score += 8;
  }

  if (!/-\d+$/.test(url.replace(/\/$/, ""))) {
    score += 4;
  }

  if (!url.includes("/en/")) {
    score += 1;
  }

  return score;
}

/**
 * Returns the listing that should be kept from a duplicate pair.
 */
function preferEntry(left, right) {
  const leftLength = String(left.description || "").length;
  const rightLength = String(right.description || "").length;

  if (leftLength !== rightLength) {
    return leftLength > rightLength ? left : right;
  }

  const leftPublished = Date.parse(left.published_at || 0) || 0;
  const rightPublished = Date.parse(right.published_at || 0) || 0;

  if (leftPublished !== rightPublished) {
    return leftPublished > rightPublished ? left : right;
  }

  const leftScore = canonicalUrlScore(left.original_url);
  const rightScore = canonicalUrlScore(right.original_url);

  if (leftScore !== rightScore) {
    return leftScore > rightScore ? left : right;
  }

  const leftId = extractSourceId(left.original_url);
  const rightId = extractSourceId(right.original_url);

  if (leftId !== rightId) {
    return leftId > rightId ? left : right;
  }

  return String(left.original_url) >= String(right.original_url) ? left : right;
}

/**
 * Drops scraped listings that share the same board and listing body, keeping one URL.
 */
function dedupeEntriesByContent(entries) {
  const unkeyed = [];
  const byKey = new Map();

  for (const entry of entries) {
    const key = listingContentKey(entry.board_name, entry.description);

    if (!key) {
      unkeyed.push(entry);
      continue;
    }

    const current = byKey.get(key);
    byKey.set(key, current ? preferEntry(current, entry) : entry);
  }

  return [...unkeyed, ...byKey.values()];
}

/**
 * Removes batch entries whose body already exists in the database under another URL.
 */
function rejectKnownContentDuplicates(entries, knownContentKeys, knownUrls) {
  return entries.filter((entry) => {
    if (knownUrls.has(entry.original_url)) {
      return true;
    }

    const key = listingContentKey(entry.board_name, entry.description);

    if (!key) {
      return true;
    }

    return !knownContentKeys.has(key);
  });
}

module.exports = {
  MIN_BODY_LENGTH,
  normalizeListingBody,
  listingContentKey,
  extractSourceId,
  canonicalUrlScore,
  preferEntry,
  dedupeEntriesByContent,
  rejectKnownContentDuplicates,
};
