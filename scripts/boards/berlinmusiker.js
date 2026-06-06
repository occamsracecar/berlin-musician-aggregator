const { parseGermanListingDate } = require("../lib/date-utils");
const { isKnownListing } = require("../lib/scrape-context");

const BOARD_NAME = "berlinmusiker.de";
const BASE_URL = "https://www.berlinmusiker.de/anzeigen/start/anzeigen.html";
const SUBCATS =
  "&subcat%5B%5D=5&subcat%5B%5D=6&subcat%5B%5D=7&subcat%5B%5D=11&subcat%5B%5D=12&subcat%5B%5D=13&text=";
/**
 * Builds a paginated listing URL for a Berlinmusiker category.
 */
function buildListingUrl(categoryId, page) {
  return `${BASE_URL}?and=&cat=${categoryId}&page=${page}${SUBCATS}`;
}

/**
 * Parses a single Berlinmusiker listing row into a normalized entry object.
 */
function parseListItem(item, categoryId) {
  const fullText = item.text?.trim() ?? "";
  const lines = fullText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const firstLine = lines[0] || "Untitled listing";
  const title =
    firstLine.length > 120 ? `${firstLine.slice(0, 117)}...` : firstLine;
  const description = fullText || null;

  const replyLink = item.links.find((link) => link.href.includes("/antworten/id/"));
  const idMatch = replyLink?.href.match(/\/id\/(\d+)\.html/);
  const listingId = idMatch?.[1];

  if (!listingId) {
    return null;
  }

  const categoryListingType = {
    1: "musician_seeking",
    2: "band_seeking",
    3: "musician_seeking",
  };

  return {
    board_name: BOARD_NAME,
    title,
    description,
    original_url: `https://www.berlinmusiker.de/anzeigen/antworten/id/${listingId}.html`,
    published_at: parseGermanListingDate(item.date),
    listing_type_hint: categoryListingType[categoryId] ?? null,
  };
}

/**
 * Scrapes one Berlinmusiker category across all available pages.
 */
async function scrapeBerlinmusikerCategory(page, categoryId, options = {}) {
  const { incremental = false, knownUrls = new Set() } = options;
  const entries = [];
  let pageIndex = 0;

  while (true) {
    const url = buildListingUrl(categoryId, pageIndex);
    await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });

    const items = await page.evaluate(() =>
      [...document.querySelectorAll(".bmListItem")].map((element) => ({
        text: element.querySelector(".bmText")?.textContent ?? "",
        date: element.querySelector(".bmStart")?.textContent?.trim() ?? "",
        links: [...element.querySelectorAll("a")].map((anchor) => ({
          href: anchor.href,
        })),
      })),
    );

    if (!items.length) {
      break;
    }

    let newOnPage = 0;

    for (const item of items) {
      const entry = parseListItem(item, categoryId);
      if (!entry) {
        continue;
      }

      if (isKnownListing(knownUrls, incremental, entry.original_url)) {
        continue;
      }

      newOnPage += 1;
      entries.push(entry);
    }

    if (incremental && newOnPage === 0) {
      console.log(`[${BOARD_NAME}] index page ${pageIndex}: no new listings, stopping`);
      break;
    }

    pageIndex += 1;
  }

  return entries;
}

/**
 * Scrapes all Berlinmusiker listings once (categories share the same pool).
 */
async function scrapeBerlinmusiker(page, options = {}) {
  const entries = await scrapeBerlinmusikerCategory(page, 2, options);
  console.log(`[${BOARD_NAME}] ${entries.length} listings`);
  return entries;
}

module.exports = { scrapeBerlinmusiker };
