const { chromium } = require("playwright");
const { scrapeBerlinmusiker } = require("./boards/berlinmusiker");
const { scrapeMusikerSucht } = require("./boards/musiker-sucht");
const { scrapeNoisyRooms } = require("./boards/noisy-rooms");
const { scrapeBackstagepro } = require("./boards/backstagepro");
const { scrapeBandmix } = require("./boards/bandmix");
const { scrapeMukken } = require("./boards/mukken");
const { classifyEntry } = require("./lib/classify");
const {
  isIncrementalScrape,
  loadKnownUrlsByBoard,
} = require("./lib/scrape-context");
const {
  createScraperSupabaseClient,
  upsertEntries,
} = require("./lib/supabase");
const { blockHeavyAssets, isCiEnvironment } = require("./lib/page-utils");

/** Boards scraped on each full run, in priority order. */
const BOARD_SCRAPERS = [
  { id: "berlinmusiker.de", scrape: scrapeBerlinmusiker },
  { id: "musiker-sucht.de", scrape: scrapeMusikerSucht },
  { id: "noisy-rooms.com", scrape: scrapeNoisyRooms },
  { id: "backstagepro.de", scrape: scrapeBackstagepro },
  { id: "bandmix.de", scrape: scrapeBandmix },
  { id: "mukken.com", scrape: scrapeMukken },
];

/**
 * Runs a single board scraper and returns its entries, logging failures without aborting others.
 */
async function scrapeBoard(page, board, scrapeOptions, failures) {
  console.log(`\n=== ${board.id} ===`);

  try {
    const entries = await board.scrape(page, scrapeOptions);
    console.log(`[${board.id}] scraped ${entries.length} listings`);
    return entries;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[${board.id}] FAILED: ${message}`);
    failures.push({ board: board.id, message });
    return [];
  }
}

/**
 * Runs all board scrapers and upserts normalized listings into Supabase.
 */
async function runScrape() {
  const supabase = createScraperSupabaseClient();
  const incremental = isIncrementalScrape();
  const boardFilter = process.env.SCRAPE_BOARD?.trim();
  const boards = boardFilter
    ? BOARD_SCRAPERS.filter((board) => board.id === boardFilter)
    : BOARD_SCRAPERS;

  if (boardFilter && !boards.length) {
    throw new Error(
      `Unknown SCRAPE_BOARD "${boardFilter}". Use one of: ${BOARD_SCRAPERS.map((board) => board.id).join(", ")}`,
    );
  }

  let knownUrlsByBoard = new Map();

  if (incremental) {
    knownUrlsByBoard = await loadKnownUrlsByBoard(supabase);
    const totalKnown = [...knownUrlsByBoard.values()].reduce(
      (sum, urls) => sum + urls.size,
      0,
    );
    console.log(
      `Incremental scrape: ${totalKnown} known URLs loaded from database`,
    );
  } else {
    console.log("Full scrape: fetching all listings from every board");
  }

  const browser = await chromium.launch({
    headless: true,
    args: ["--disable-blink-features=AutomationControlled"],
  });
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    locale: "de-DE",
  });

  if (isCiEnvironment()) {
    await blockHeavyAssets(context);
  }
  const failures = [];
  const boardStats = [];

  try {
    const scrapedEntries = [];

    for (const board of boards) {
      const boardPage = await context.newPage();
      const scrapeOptions = {
        incremental,
        knownUrls: knownUrlsByBoard.get(board.id) ?? new Set(),
      };

      try {
        const beforeFailures = failures.length;
        const entries = await scrapeBoard(
          boardPage,
          board,
          scrapeOptions,
          failures,
        );
        scrapedEntries.push(...entries);
        const boardFailure = failures
          .slice(beforeFailures)
          .find((item) => item.board === board.id);
        boardStats.push({
          board: board.id,
          count: entries.length,
          ok: !boardFailure,
          message: boardFailure?.message,
        });
      } finally {
        await boardPage.close();
      }
    }

    if (!scrapedEntries.length) {
      const boardsSucceeded = boardStats.filter((stat) => stat.ok).length;

      if (boardsSucceeded === 0) {
        throw new Error(
          `All boards failed: ${failures.map((item) => `${item.board} (${item.message})`).join("; ")}`,
        );
      }

      if (failures.length) {
        console.warn(
          `\nNo new listings today. ${failures.length} board(s) had errors: ${failures.map((item) => item.board).join(", ")}`,
        );
      } else {
        console.log("\nNo new listings found.");
      }

      return;
    }

    const classifiedEntries = scrapedEntries.map(classifyEntry);
    const uniqueByUrl = new Map();

    for (const entry of classifiedEntries) {
      uniqueByUrl.set(entry.original_url, entry);
    }

    const entries = [...uniqueByUrl.values()];
    console.log(`\nUpserting ${entries.length} unique listings...`);

    const { count, error } = await upsertEntries(supabase, entries);

    if (error) {
      throw error;
    }

    console.log(`Done. Upserted ${count} rows.`);

    for (const stat of boardStats) {
      if (stat.ok) {
        console.log(`[summary] ${stat.board}: ${stat.count} scraped`);
      } else {
        console.warn(`[summary] ${stat.board}: FAILED — ${stat.message}`);
      }
    }

    if (failures.length) {
      console.warn(
        `\nCompleted with ${failures.length} board failure(s): ${failures.map((item) => item.board).join(", ")}`,
      );
    }

    const boardsSucceeded = boardStats.filter((stat) => stat.ok).length;

    if (boardsSucceeded === 0) {
      process.exitCode = 1;
    } else if (failures.length && count === 0) {
      process.exitCode = 1;
    }
  } finally {
    await browser.close();
  }
}

runScrape().catch((error) => {
  console.error("Scrape failed:", error.message);
  process.exit(1);
});
