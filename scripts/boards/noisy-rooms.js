const { enrichEntriesInParallel } = require("../lib/parallel-enrich");
const { isKnownListing } = require("../lib/scrape-context");

const BOARD_NAME = "noisy-rooms.com";
const BASE_URL = "https://noisy-rooms.com/en/community";

/**
 * Builds a paginated noisy-rooms community listing URL.
 */
function buildListingUrl(pageIndex) {
  return pageIndex === 0 ? BASE_URL : `${BASE_URL}?page=${pageIndex}`;
}

/**
 * Normalizes a noisy-rooms listing URL to an absolute canonical form.
 */
function normalizeListingUrl(href) {
  if (!href) {
    return null;
  }

  if (href.startsWith("http")) {
    return href;
  }

  return `https://noisy-rooms.com${href.startsWith("/") ? href : `/${href}`}`;
}

/**
 * Returns whether index text looks truncated on the community board.
 */
function isTruncated(text) {
  return !text || /(\.{3}|…)\s*$/u.test(text) || text.length < 250;
}

/**
 * Parses listing body text from a noisy-rooms detail page in the browser.
 */
function extractNoisyRoomsDetailText() {
  const content = document.querySelector("article div.content, article .content");
  if (content) {
    const lines = content.innerText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const skipLine =
      /^(category|kategorie|musician is looking|band sucht|musiker sucht|posted|von |by )/i;
    const body = lines.filter((line) => !skipLine.test(line)).join("\n\n");
    if (body.length > 20) {
      return body;
    }
  }

  const article = document.querySelector("article");
  if (!article) {
    return null;
  }

  const body = article.innerText;
  const endMarkers = ["PRIVATE NACHRICHT SENDEN", "SEND PRIVATE MESSAGE"];
  const end = endMarkers
    .map((marker) => body.indexOf(marker))
    .filter((index) => index >= 0)
    .sort((a, b) => a - b)[0];

  if (end === undefined) {
    return null;
  }

  return body
    .slice(0, end)
    .replace(/^[\s\S]*?(Kategorie|Category)[\s\S]*?\n\n/i, "")
    .trim();
}

/**
 * Fetches the full listing body from a noisy-rooms detail page.
 */
async function enrichNoisyRoomsDetail(page, entry) {
  await page.goto(entry.original_url, {
    waitUntil: "networkidle",
    timeout: 60000,
  });

  const fullText = await page.evaluate(extractNoisyRoomsDetailText);

  if (fullText && fullText.length > (entry.description?.length ?? 0)) {
    entry.description = fullText;
  }
}

/**
 * Scrapes musician listings from noisy-rooms.com community board.
 */
async function scrapeNoisyRooms(page, options = {}) {
  const { incremental = false, knownUrls = new Set() } = options;
  const entries = [];
  let pageIndex = 0;

  while (true) {
    const url = buildListingUrl(pageIndex);
    await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });

    const items = await page.evaluate(() =>
      [...document.querySelectorAll(".view-community li.grid, .view-id-community li.grid")]
        .map((item) => {
          const anchor = item.querySelector(".views-field-title a");
          const description =
            item.querySelector(".views-field-field-description .field-content")
              ?.textContent?.trim() ?? null;
          const publishedAt =
            item.querySelector("time[datetime]")?.getAttribute("datetime") ?? null;

          return {
            title: anchor?.textContent?.trim() ?? "",
            href: anchor?.getAttribute("href") ?? "",
            description,
            published_at: publishedAt,
          };
        })
        .filter((item) => item.href && item.title),
    );

    if (!items.length) {
      break;
    }

    let newOnPage = 0;

    for (const item of items) {
      const originalUrl = normalizeListingUrl(item.href);
      if (!originalUrl) {
        continue;
      }

      if (isKnownListing(knownUrls, incremental, originalUrl)) {
        continue;
      }

      newOnPage += 1;
      entries.push({
        board_name: BOARD_NAME,
        title: item.title,
        description: item.description,
        original_url: originalUrl,
        published_at: item.published_at,
      });
    }

    if (incremental && newOnPage === 0) {
      console.log(`[${BOARD_NAME}] index page ${pageIndex}: no new listings, stopping`);
      break;
    }

    pageIndex += 1;
  }

  const needsDetail = entries.filter((entry) => isTruncated(entry.description));

  if (needsDetail.length) {
    console.log(
      `[${BOARD_NAME}] ${needsDetail.length} listings need full text from detail pages...`,
    );

    await enrichEntriesInParallel(page.context(), needsDetail, enrichNoisyRoomsDetail, {
      boardLabel: `${BOARD_NAME} details`,
      concurrency: 4,
      logEvery: 200,
    });
  }

  console.log(`[${BOARD_NAME}] ${entries.length} listings`);
  return entries;
}

module.exports = {
  scrapeNoisyRooms,
  enrichNoisyRoomsDetail,
  extractNoisyRoomsDetailText,
  isTruncated,
};
