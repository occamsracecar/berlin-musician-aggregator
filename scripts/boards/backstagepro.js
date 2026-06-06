const { extractPublicationDateFromText } = require("../lib/date-utils");
const { enrichEntriesInParallel } = require("../lib/parallel-enrich");
const { isKnownListing } = require("../lib/scrape-context");
const {
  dismissConsentDialogs,
  getScrapeTimeouts,
  isBotChallengePage,
} = require("../lib/page-utils");

const BOARD_NAME = "backstagepro.de";
const BASE_URL =
  "https://www.backstagepro.de/musikersuche/region/berlin-berlin-de";
const ORIGIN = "https://www.backstagepro.de";
const LISTING_SELECTORS = [
  ".media-object-section.pbody",
  "h2.resource-title a[href*='/musikerkontakt/']",
];
const { navigationMs, selectorMs, retryDelayMs, maxAttempts } =
  getScrapeTimeouts();

/**
 * Waits until listing blocks or title links appear on a Backstage PRO page.
 */
async function waitForBackstageListings(page) {
  for (const selector of LISTING_SELECTORS) {
    try {
      await page.waitForSelector(selector, { timeout: selectorMs });
      return selector;
    } catch {
      // Try the next selector.
    }
  }

  throw new Error(
    `No listings found (tried: ${LISTING_SELECTORS.join(", ")})`,
  );
}

/**
 * Loads a Backstage PRO page and waits for listing blocks to appear.
 */
async function loadBackstageproPage(page, url, attempt = 1) {
  try {
    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: navigationMs,
    });
    await dismissConsentDialogs(page);

    if (await isBotChallengePage(page)) {
      throw new Error(
        "Blocked by Cloudflare bot check (common on GitHub Actions IPs)",
      );
    }

    return await waitForBackstageListings(page);
  } catch (error) {
    if (attempt >= maxAttempts) {
      const debugTitle = await page.title().catch(() => "");
      throw new Error(
        `${error instanceof Error ? error.message : String(error)} (page: "${debugTitle}")`,
      );
    }

    console.warn(
      `[${BOARD_NAME}] page load retry ${attempt}/${maxAttempts - 1}: ${url}`,
    );
    await page.waitForTimeout(retryDelayMs * attempt);
    return loadBackstageproPage(page, url, attempt + 1);
  }
}

/**
 * Loads a Backstage PRO detail page and waits for profile content.
 */
async function loadBackstageproDetailPage(page, url, attempt = 1) {
  try {
    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: navigationMs,
    });
    await dismissConsentDialogs(page);
    await page.waitForSelector("h3", { timeout: selectorMs });
  } catch (error) {
    if (attempt >= maxAttempts) {
      throw error;
    }

    console.warn(
      `[${BOARD_NAME}] detail retry ${attempt}/${maxAttempts - 1}: ${url}`,
    );
    await page.waitForTimeout(retryDelayMs * attempt);
    return loadBackstageproDetailPage(page, url, attempt + 1);
  }
}

/**
 * Builds a paginated Backstage PRO Berlin listing URL.
 */
function buildListingUrl(pageIndex) {
  return pageIndex === 1 ? BASE_URL : `${BASE_URL}?page=${pageIndex}`;
}

/**
 * Normalizes a Backstage PRO listing URL to an absolute form.
 */
function normalizeListingUrl(href) {
  if (!href) {
    return null;
  }

  if (href.startsWith("http")) {
    return href;
  }

  return `${ORIGIN}${href.startsWith("/") ? href : `/${href}`}`;
}

/**
 * Maps Backstage PRO rubrik text to a listing type hint.
 */
function parseRubrikHint(rubrik) {
  const normalized = rubrik.toLowerCase();

  if (normalized.includes("band sucht")) {
    return "band_seeking";
  }

  if (
    normalized.includes("sucht band") ||
    normalized.includes("sucht mitmusiker")
  ) {
    return "musician_seeking";
  }

  return null;
}

/**
 * Builds a searchable description from Backstage PRO listing metadata.
 */
function buildDescription(item) {
  const parts = [
    item.location ? `Location: ${item.location}` : null,
    item.rubrik ? `Rubrik: ${item.rubrik}` : null,
    item.genre ? `Genre: ${item.genre}` : null,
    item.ambition ? `Anspruch: ${item.ambition}` : null,
    item.skill ? `Skill: ${item.skill}` : null,
  ].filter(Boolean);

  return parts.join("\n") || null;
}

/**
 * Parses extra listing text from a Backstage PRO detail page in the browser.
 */
function extractBackstageproDetailText() {
  /**
   * Collects text under a detail-page heading until the next h3.
   */
  function sectionAfter(headingText) {
    const heading = [...document.querySelectorAll("h3")].find(
      (element) => element.textContent?.trim() === headingText,
    );

    if (!heading) {
      return "";
    }

    const parts = [];
    let element = heading.nextElementSibling;

    while (element && element.tagName !== "H3") {
      const text = element.innerText?.trim() ?? "";

      if (
        text.length > 5 &&
        !/^(Play|Seek|Current time|Toggle|Volume)/i.test(text) &&
        !text.includes("Profil-Album")
      ) {
        parts.push(text);
      }

      element = element.nextElementSibling;
    }

    return parts.join("\n\n");
  }

  const details = sectionAfter("Details");
  const werdegang = sectionAfter("Musikalischer Werdegang");
  const pub = document.body.innerText.match(
    /veröffentlicht am\s+(\d{1,2}\.\s*\S+\s*\d{4})/i,
  );

  return {
    details,
    werdegang,
    publishedLabel: pub?.[1]?.trim() ?? null,
  };
}

/**
 * Fetches full listing text from a Backstage PRO detail page.
 */
async function enrichBackstageproDetail(page, entry) {
  await loadBackstageproDetailPage(page, entry.original_url);

  const extra = await page.evaluate(extractBackstageproDetailText);
  const publishedAt = extractPublicationDateFromText(extra.publishedLabel);

  if (publishedAt) {
    entry.published_at = publishedAt;
  }

  const parts = [
    entry.description,
    extra.details || null,
    extra.werdegang ? `Musikalischer Werdegang:\n${extra.werdegang}` : null,
  ].filter(Boolean);

  const fullText = parts.join("\n\n");

  if (fullText.length > (entry.description?.length ?? 0)) {
    entry.description = fullText;
  }
}

/**
 * Scrapes Berlin musician listings from backstagepro.de.
 */
async function scrapeBackstagepro(page, options = {}) {
  const { incremental = false, knownUrls = new Set() } = options;
  const entries = [];
  let pageIndex = 1;

  while (true) {
    const url = buildListingUrl(pageIndex);
    const listingSelector = await loadBackstageproPage(page, url);

    const items = await page.evaluate(
      (selector) =>
        [...document.querySelectorAll(selector)]
        .map((block) => {
          const anchor = block.querySelector('h2.resource-title a[href*="/musikerkontakt/"]');
          if (!anchor) {
            return null;
          }

          const rows = [...block.querySelectorAll("table.infotable tr")];
          const fields = Object.fromEntries(
            rows.map((row) => {
              const cells = [...row.querySelectorAll("td")];
              const key = cells[0]?.textContent?.trim().replace(":", "") ?? "";
              const value = cells[1]?.textContent?.trim() ?? "";
              return [key, value];
            }),
          );

          return {
            title: anchor.textContent?.trim() ?? "",
            href: anchor.getAttribute("href") ?? "",
            location: block.querySelector("h3")?.textContent?.trim() ?? "",
            rubrik: fields.Rubrik ?? "",
            genre: fields.Genre ?? "",
            ambition: fields.Anspruch ?? "",
            skill: fields.Skill ?? "",
            dateText: block.querySelector(".feedhide")?.textContent ?? "",
          };
        })
        .filter(Boolean),
      listingSelector.startsWith("h2")
        ? ".media-object-section.pbody"
        : listingSelector,
    );

    if (!items.length) {
      break;
    }

    let newOnPage = 0;
    let refreshedOnPage = 0;
    const refreshTopPage = incremental && pageIndex === 1;

    for (const item of items) {
      const originalUrl = normalizeListingUrl(item.href);
      if (!originalUrl) {
        continue;
      }

      const isKnown = isKnownListing(knownUrls, incremental, originalUrl);

      if (isKnown && !refreshTopPage) {
        continue;
      }

      if (isKnown) {
        refreshedOnPage += 1;
      } else {
        newOnPage += 1;
      }

      entries.push({
        board_name: BOARD_NAME,
        title: item.title,
        description: buildDescription(item),
        original_url: originalUrl,
        published_at: extractPublicationDateFromText(item.dateText),
        listing_type_hint: parseRubrikHint(item.rubrik),
      });
    }

    if (incremental && newOnPage === 0 && refreshedOnPage === 0) {
      console.log(`[${BOARD_NAME}] index page ${pageIndex}: no new listings, stopping`);
      break;
    }

    if (refreshTopPage && refreshedOnPage > 0) {
      console.log(
        `[${BOARD_NAME}] index page 1: refreshing ${refreshedOnPage} top listings (dates/metadata)`,
      );
    }

    pageIndex += 1;
  }

  if (entries.length) {
    console.log(
      `[${BOARD_NAME}] ${entries.length} listings, fetching full text from detail pages...`,
    );

    await enrichEntriesInParallel(page.context(), entries, enrichBackstageproDetail, {
      boardLabel: `${BOARD_NAME} details`,
      concurrency: 2,
      logEvery: 25,
    });
  }

  console.log(`[${BOARD_NAME}] ${entries.length} listings`);
  return entries;
}

module.exports = {
  scrapeBackstagepro,
  loadBackstageproPage,
  loadBackstageproDetailPage,
  enrichBackstageproDetail,
  extractBackstageproDetailText,
  buildListingUrl,
  parseRubrikHint,
};
