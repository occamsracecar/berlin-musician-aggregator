const { parseGermanListingDate } = require("../lib/date-utils");
const { enrichEntriesInParallel } = require("../lib/parallel-enrich");

const BOARD_NAME = "musiker-sucht.de";
const LISTING_URL = "https://www.musiker-sucht.de/index.php/stadt/berlin";

/**
 * Parses a musiker-sucht card string into title, description snippet, and date.
 */
function parseCardText(cardText) {
  const cleaned = cardText.replace(/\s+/g, " ").trim();
  const dateMatch = cleaned.match(/(\d{2}\.\d{2}\.)\s+/);

  if (!dateMatch || dateMatch.index === undefined) {
    return { title: cleaned, description: null, date: null };
  }

  const prefix = cleaned.slice(0, dateMatch.index).trim();
  const remainder = cleaned.slice(dateMatch.index + dateMatch[0].length).trim();
  const hashIndex = remainder.indexOf("#");
  const title = hashIndex >= 0 ? remainder.slice(0, hashIndex).trim() : remainder;
  const tags =
    hashIndex >= 0 ? remainder.slice(hashIndex).replace(/#\S+/g, "").trim() : null;

  let listingTypeHint = null;
  if (/^suche musiker/i.test(prefix)) {
    listingTypeHint = "band_seeking";
  } else if (/^suche band/i.test(prefix)) {
    listingTypeHint = "musician_seeking";
  } else if (/^biete musiker/i.test(prefix)) {
    listingTypeHint = "musician_seeking";
  }

  return {
    title: title || prefix || "Untitled listing",
    description: tags || prefix || null,
    date: dateMatch[1],
    listingTypeHint,
  };
}

/**
 * Parses listing body text from a musiker-sucht detail page in the browser.
 */
function extractMusikerSuchtDetailText() {
  const skipHeadings = new Set([
    "Details",
    "Kontaktieren",
    "Suche Band",
    "Suche Musiker",
    "Biete Musiker",
  ]);
  const listingHeading = [...document.querySelectorAll("h2")].find((heading) => {
    const text = heading.textContent?.trim() ?? "";
    return text && !skipHeadings.has(text);
  });

  if (!listingHeading) {
    return null;
  }

  const parts = [];
  let element = listingHeading.nextElementSibling;

  while (element && element.tagName !== "H2") {
    const text = element.textContent?.trim() ?? "";

    if (/Sicherheitshinweis|einloggen um zu bearbeiten/i.test(text)) {
      element = element.nextElementSibling;
      continue;
    }

    if (
      text.startsWith("Anzeige vom") ||
      text === "Spam melden" ||
      text.startsWith("Ist Anzeige #")
    ) {
      break;
    }

    if (text.length > 5) {
      parts.push(text);
    }

    element = element.nextElementSibling;
  }

  const raw = parts.join("\n\n");
  const tagIndex = raw.search(/(?:^|\s)#[\w-]+(?:,\s*#[\w-]+)*/u);
  const body = tagIndex >= 0 ? raw.slice(0, tagIndex).trim() : raw.trim();
  const tags =
    tagIndex >= 0 ? raw.slice(tagIndex).match(/#[^\s,]+/gu)?.join(" ") : null;

  return [body, tags].filter(Boolean).join("\n\n") || null;
}

/**
 * Fetches the full listing body from a musiker-sucht detail page.
 */
async function enrichMusikerSuchtDetail(page, entry) {
  await page.goto(entry.original_url, {
    waitUntil: "networkidle",
    timeout: 60000,
  });

  const fullText = await page.evaluate(extractMusikerSuchtDetailText);

  if (fullText && fullText.length > (entry.description?.length ?? 0)) {
    entry.description = fullText;
  }
}

/**
 * Scrapes Berlin listings from musiker-sucht.de.
 */
async function scrapeMusikerSucht(page) {
  await page.goto(LISTING_URL, { waitUntil: "networkidle", timeout: 60000 });

  const cards = await page.evaluate(() =>
    [...document.querySelectorAll('a[href*="/kleinanzeigen/"]')].map((anchor) => ({
      href: anchor.href,
      cardText: (anchor.closest("div") || anchor.parentElement)?.textContent ?? "",
    })),
  );

  const seen = new Set();
  const entries = [];

  for (const card of cards) {
    if (seen.has(card.href)) {
      continue;
    }
    seen.add(card.href);

    const parsed = parseCardText(card.cardText.replace(/\s+/g, " ").trim());

    entries.push({
      board_name: BOARD_NAME,
      title: parsed.title,
      description: parsed.description,
      original_url: card.href,
      published_at: parseGermanListingDate(parsed.date),
      listing_type_hint: parsed.listingTypeHint,
    });
  }

  if (entries.length) {
    console.log(
      `[${BOARD_NAME}] ${entries.length} listings, fetching full text from detail pages...`,
    );

    await enrichEntriesInParallel(page.context(), entries, enrichMusikerSuchtDetail, {
      boardLabel: `${BOARD_NAME} details`,
      concurrency: 4,
      logEvery: 10,
    });
  }

  console.log(`[${BOARD_NAME}] ${entries.length} listings`);
  return entries;
}

module.exports = {
  scrapeMusikerSucht,
  enrichMusikerSuchtDetail,
  extractMusikerSuchtDetailText,
};
