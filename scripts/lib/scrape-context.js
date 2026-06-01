/**
 * Returns whether the scraper should only fetch listings not already in the database.
 */
function isIncrementalScrape() {
  if (process.env.SCRAPE_FULL === "1" || process.env.SCRAPE_FULL === "true") {
    return false;
  }

  return (
    process.env.SCRAPE_INCREMENTAL === "1" ||
    process.env.SCRAPE_INCREMENTAL === "true"
  );
}

/**
 * Loads existing listing URLs grouped by board_name from Supabase.
 */
async function loadKnownUrlsByBoard(supabase) {
  const byBoard = new Map();
  let from = 0;
  const pageSize = 1000;

  while (true) {
    const { data, error } = await supabase
      .from("entries")
      .select("board_name, original_url")
      .range(from, from + pageSize - 1);

    if (error) {
      throw error;
    }

    if (!data?.length) {
      break;
    }

    for (const row of data) {
      if (!byBoard.has(row.board_name)) {
        byBoard.set(row.board_name, new Set());
      }
      byBoard.get(row.board_name).add(row.original_url);
    }

    if (data.length < pageSize) {
      break;
    }

    from += pageSize;
  }

  return byBoard;
}

/**
 * Returns whether a listing URL is already stored for incremental scrapes.
 */
function isKnownListing(knownUrls, incremental, originalUrl) {
  return Boolean(incremental && knownUrls?.has(originalUrl));
}

module.exports = {
  isIncrementalScrape,
  loadKnownUrlsByBoard,
  isKnownListing,
};
