const { parseGermanListingDate } = require("../lib/date-utils");
const { enrichEntriesInParallel } = require("../lib/parallel-enrich");

const BOARD_NAME = "backstagepro.de";
const BASE_URL =
  "https://www.backstagepro.de/musikersuche/region/berlin-berlin-de";
const ORIGIN = "https://www.backstagepro.de";

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

  return {
    details,
    werdegang,
  };
}

/**
 * Fetches full listing text from a Backstage PRO detail page.
 */
async function enrichBackstageproDetail(page, entry) {
  await page.goto(entry.original_url, {
    waitUntil: "networkidle",
    timeout: 60000,
  });

  const extra = await page.evaluate(extractBackstageproDetailText);
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
async function scrapeBackstagepro(page) {
  const entries = [];
  let pageIndex = 1;

  while (true) {
    const url = buildListingUrl(pageIndex);
    await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });

    const items = await page.evaluate(() =>
      [...document.querySelectorAll(".media-object-section.pbody")]
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
    );

    if (!items.length) {
      break;
    }

    for (const item of items) {
      const originalUrl = normalizeListingUrl(item.href);
      if (!originalUrl) {
        continue;
      }

      entries.push({
        board_name: BOARD_NAME,
        title: item.title,
        description: buildDescription(item),
        original_url: originalUrl,
        published_at: parseGermanListingDate(item.dateText),
        listing_type_hint: parseRubrikHint(item.rubrik),
      });
    }

    pageIndex += 1;
  }

  if (entries.length) {
    console.log(
      `[${BOARD_NAME}] ${entries.length} listings, fetching full text from detail pages...`,
    );

    await enrichEntriesInParallel(page.context(), entries, enrichBackstageproDetail, {
      boardLabel: `${BOARD_NAME} details`,
      concurrency: 4,
      logEvery: 50,
    });
  }

  console.log(`[${BOARD_NAME}] ${entries.length} listings`);
  return entries;
}

module.exports = {
  scrapeBackstagepro,
  enrichBackstageproDetail,
  extractBackstageproDetailText,
  buildListingUrl,
  parseRubrikHint,
};
