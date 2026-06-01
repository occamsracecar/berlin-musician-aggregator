const { chromium } = require("playwright");
const { scrapeBerlinmusiker } = require("./boards/berlinmusiker");
const { scrapeMusikerSucht } = require("./boards/musiker-sucht");
const { scrapeNoisyRooms } = require("./boards/noisy-rooms");
const { scrapeBackstagepro } = require("./boards/backstagepro");
const { scrapeBandmix } = require("./boards/bandmix");
const { classifyEntry } = require("./lib/classify");
const {
  createScraperSupabaseClient,
  upsertEntries,
} = require("./lib/supabase");

/** Boards scraped on each full run, in priority order. */
const BOARD_SCRAPERS = [
  { id: "berlinmusiker.de", scrape: scrapeBerlinmusiker },
  { id: "musiker-sucht.de", scrape: scrapeMusikerSucht },
  { id: "noisy-rooms.com", scrape: scrapeNoisyRooms },
  { id: "backstagepro.de", scrape: scrapeBackstagepro },
  { id: "bandmix.de", scrape: scrapeBandmix },
];

/**
 * Runs a single board scraper and returns its entries, logging failures without aborting others.
 */
async function scrapeBoard(page, board, failures) {
  console.log(`\n=== ${board.id} ===`);

  try {
    const entries = await board.scrape(page);
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
  const boardFilter = process.env.SCRAPE_BOARD?.trim();
  const boards = boardFilter
    ? BOARD_SCRAPERS.filter((board) => board.id === boardFilter)
    : BOARD_SCRAPERS;

  if (boardFilter && !boards.length) {
    throw new Error(
      `Unknown SCRAPE_BOARD "${boardFilter}". Use one of: ${BOARD_SCRAPERS.map((board) => board.id).join(", ")}`,
    );
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
  const page = await context.newPage();
  const failures = [];

  try {
    const scrapedEntries = [];

    for (const board of boards) {
      scrapedEntries.push(...(await scrapeBoard(page, board, failures)));
    }

    if (!scrapedEntries.length) {
      throw new Error(
        failures.length
          ? `No listings scraped. Failures: ${failures.map((item) => item.board).join(", ")}`
          : "No listings scraped.",
      );
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

    if (failures.length) {
      console.warn(
        `\nCompleted with ${failures.length} board failure(s): ${failures.map((item) => item.board).join(", ")}`,
      );
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
