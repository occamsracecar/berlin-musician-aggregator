const { parseGermanListingDate } = require("../lib/date-utils");
const { enrichEntriesInParallel } = require("../lib/parallel-enrich");
const { isKnownListing } = require("../lib/scrape-context");
const { dismissConsentDialogs, getScrapeTimeouts } = require("../lib/page-utils");

const BOARD_NAME = "mukken.com";
const ORIGIN = "https://www.mukken.com";
const SEARCH_URL = `${ORIGIN}/musician-search/berlin`;
const BERLIN_ZIP = "10115";
const BERLIN_CITY = "Berlin";
const BERLIN_STATE = "Berlin";
const SEARCH_RADIUS_KM = "50";
const { navigationMs } = getScrapeTimeouts();

/**
 * Decodes escaped HTML returned by mukken JSON search endpoints.
 */
function decodeApiHtml(rawHtml) {
  return (rawHtml || "")
    .replace(/\\\//g, "/")
    .replace(/\\"/g, '"')
    .replace(/\\n/g, "\n")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

/**
 * Strips HTML tags and collapses whitespace from a fragment.
 */
function stripHtml(html) {
  return (html || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Extracts the first matching group from HTML using a regex.
 */
function matchHtml(html, pattern) {
  const match = html.match(pattern);
  return match?.[1] ? stripHtml(match[1]) : null;
}

/**
 * Extracts repeated span.item tag labels from an HTML fragment.
 */
function extractTagItems(html) {
  return [...html.matchAll(/<span class="item">([^<]+)<\/span>/g)]
    .map((match) => stripHtml(match[1]))
    .filter((value) => value && !value.startsWith("+"));
}

/**
 * Normalizes a mukken listing URL to a canonical absolute form.
 */
function normalizeListingUrl(href) {
  if (!href) {
    return null;
  }

  const absolute = href.startsWith("http")
    ? href
    : `${ORIGIN}${href.startsWith("/") ? href : `/${href}`}`;

  const url = new URL(absolute);
  url.search = "";
  url.hash = "";

  return url.toString();
}

/**
 * Returns whether card text indicates a Berlin listing.
 */
function isBerlinLocation(text) {
  if (!text) {
    return false;
  }

  const normalized = text.toUpperCase();
  return /\bBERLIN\b/.test(normalized) || /\b1[0-4]\d{3}\b/.test(normalized);
}

/**
 * Parses musician profile cards from search-musicians API HTML.
 */
function parseProfileCards(html) {
  const cards = [];
  const articles = html.split("<article").slice(1);

  for (const chunk of articles) {
    const article = `<article${chunk.split("</article>")[0]}</article>`;
    const href = matchHtml(article, /href="(\/de\/profile\/[^"?]+)/i);

    if (!href) {
      continue;
    }

    const name = matchHtml(article, /class="[^"]*sm-user-name[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
    const role = matchHtml(article, /class="[^"]*sm-user-role[^"]*">([\s\S]*?)<\/div>/i);
    const excerpt = matchHtml(
      article,
      /class="item-content[^"]*">[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i,
    );
    const location = matchHtml(article, /class="item-location"[^>]*>[\s\S]*?>([\s\S]*?)<\/h4>/i);
    const genres = extractTagItems(article).join(", ");

    cards.push({
      kind: "profile",
      href,
      name,
      role,
      excerpt,
      location,
      genres,
    });
  }

  return cards;
}

/**
 * Parses Berlin search-ad cards from search-tender-offers API HTML.
 */
function parseTenderCards(html) {
  const cards = [];
  const anchors = [...html.matchAll(/<a href="(\/de\/sa\/[^"]+)"[\s\S]*?<\/a>/g)];

  for (const match of anchors) {
    const block = match[0];
    const href = match[1];
    const title = matchHtml(block, /class="sm-ad-name">([\s\S]*?)<\/h3>/i);
    const location = matchHtml(block, /class="item-location"[^>]*>[\s\S]*?>([\s\S]*?)<\/h4>/i);
    const excerpt = matchHtml(
      block,
      /class="item-content[^"]*">[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i,
    );
    const wantedLabel = matchHtml(block, /class="instruments item-tags[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i);
    const instruments = extractTagItems(
      block.split('class="genres item-tags"')[0] || block,
    ).join(", ");
    const genres = extractTagItems(
      block.split('class="genres item-tags"')[1] || "",
    ).join(", ");
    const date = matchHtml(block, /class="item-date"[^>]*>[\s\S]*?(\d{2}\.\d{2}\.\d{4})/i);

    cards.push({
      kind: "ad",
      href,
      title,
      location,
      excerpt,
      wantedLabel,
      instruments,
      genres,
      date,
    });
  }

  return cards;
}

/**
 * Builds a listing title from a parsed mukken profile or ad card.
 */
function buildTitle(card) {
  if (card.kind === "ad") {
    return card.title || "mukken search ad";
  }

  if (card.name && card.role) {
    return `${card.name} (${card.role})`;
  }

  return card.name || card.role || "mukken profile";
}

/**
 * Builds a searchable description from index-card metadata.
 */
function buildDescription(card) {
  const parts = [
    card.kind === "profile" && card.name ? `Profile: ${card.name}` : null,
    card.role ? `Role: ${card.role}` : null,
    card.location ? `Location: ${card.location}` : null,
    card.genres ? `Genres: ${card.genres}` : null,
    card.instruments ? `Instruments: ${card.instruments}` : null,
    card.wantedLabel ? `Listing type: ${card.wantedLabel}` : null,
    card.excerpt || null,
  ].filter(Boolean);

  return parts.join("\n\n") || null;
}

/**
 * Maps mukken card text to a listing type hint.
 */
function parseListingTypeHint(card) {
  const text = `${card.title || ""} ${card.wantedLabel || ""} ${card.role || ""} ${card.excerpt || ""}`.toLowerCase();

  if (/gesucht|wanted|sucht|suche|seeks|looking for/.test(text)) {
    if (/band|gründung|formation/.test(text) && /singer|sänger|gitar|drum|bass|keyboard|piano/.test(text)) {
      return "band_seeking";
    }

    if (/drummer|drummerin|gitarrist|bassist|sänger|singer|keyboard|pianist|musiker/.test(text)) {
      return "band_seeking";
    }
  }

  if (/suche band|looking for a band|sucht band|musician seeking/.test(text)) {
    return "musician_seeking";
  }

  if (card.kind === "profile" && card.role && /band/i.test(card.role)) {
    return "band_seeking";
  }

  return null;
}

/**
 * Loads the Berlin musician search page and returns the active search hash.
 */
async function loadMukkenSearchPage(page) {
  await page.goto(SEARCH_URL, {
    waitUntil: "domcontentloaded",
    timeout: navigationMs,
  });
  await dismissConsentDialogs(page);

  const searchHash = await page.evaluate(() => {
    const node = document.querySelector("[data-search-hash]");
    return node?.getAttribute("data-search-hash") ?? "";
  });

  if (!searchHash) {
    throw new Error("mukken search hash not found");
  }

  return searchHash;
}

/**
 * Builds a mukken internal search API URL for profiles or ads.
 */
function buildSearchApiUrl(endpoint, pageIndex, searchHash) {
  const params = new URLSearchParams();

  if (endpoint === "search-musicians") {
    params.set("page", String(pageIndex));
    params.set("segment", `p${pageIndex}`);
  }

  params.set("params[page]", String(pageIndex));
  params.set("params[state]", BERLIN_STATE);
  params.set("params[city]", BERLIN_CITY);
  params.set("params[zip]", BERLIN_ZIP);
  params.set("params[distance]", SEARCH_RADIUS_KM);
  params.set("params[tender_categories]", "");
  params.set("params[sortby]", "");

  if (searchHash) {
    params.set("params[search_hash]", searchHash);
  }

  return `${ORIGIN}/${endpoint}?${params.toString()}`;
}

/**
 * Fetches and parses a mukken JSON search endpoint in the browser context.
 */
async function fetchMukkenSearchJson(page, endpoint, pageIndex, searchHash) {
  const url = buildSearchApiUrl(endpoint, pageIndex, searchHash);

  return page.evaluate(async (requestUrl) => {
    const response = await fetch(requestUrl, {
      credentials: "same-origin",
      headers: { "X-Requested-With": "XMLHttpRequest" },
    });

    if (!response.ok) {
      throw new Error(`mukken API ${response.status}`);
    }

    return response.text();
  }, url);
}

/**
 * Parses profile or ad cards from a mukken search API response.
 */
function parseSearchResponse(endpoint, rawText) {
  const payload = JSON.parse(rawText);
  const html = decodeApiHtml(
    endpoint === "search-tender-offers"
      ? payload.relevantTendersHtml
      : payload.html,
  );

  if (endpoint === "search-tender-offers") {
    return parseTenderCards(html);
  }

  return parseProfileCards(html);
}

/**
 * Fetches the full profile bio from a mukken profile page.
 */
async function enrichMukkenProfile(page, entry) {
  await page.goto(entry.original_url, {
    waitUntil: "domcontentloaded",
    timeout: navigationMs,
  });

  const detail = await page.evaluate(() => {
    const skipLine =
      /^(genres|instrumente|instruments|adresse|social|web|kontakt|mitglied seit|über|about|deutschland)$/i;
    const aboutHeading = [...document.querySelectorAll("h2, h3, h4, p, div, strong")]
      .find((node) => /^über$|^about$/i.test(node.textContent?.trim() ?? ""));

    let aboutText = "";

    if (aboutHeading) {
      const lines = [];
      let element = aboutHeading.nextElementSibling;

      while (element) {
        const tag = element.tagName;
        const text = element.textContent?.trim() ?? "";

        if (/^H[1-4]$/i.test(tag) || /^(social|web|genres|instrumente)/i.test(text)) {
          break;
        }

        if (text.length > 20 && text.length < 8000 && !skipLine.test(text)) {
          lines.push(text);
        }

        element = element.nextElementSibling;
      }

      aboutText = lines.join("\n\n");
    }

    const memberSince = document.body.innerText.match(
      /MITGLIED SEIT:\s*(\d{1,2}\s*\/\s*\d{1,2}\s*\/\s*\d{4})/i,
    )?.[1];

    return { aboutText, memberSince };
  });

  if (detail.aboutText && detail.aboutText.length > (entry.description?.length ?? 0)) {
    entry.description = detail.aboutText;
  } else if (detail.aboutText && entry.description && !entry.description.includes(detail.aboutText)) {
    entry.description = `${entry.description}\n\n${detail.aboutText}`;
  }

  if (detail.memberSince) {
    const normalized = detail.memberSince.replace(/\s+/g, "").replace(/\//g, ".");
    entry.published_at = parseGermanListingDate(normalized) ?? entry.published_at;
  }
}

/**
 * Fetches the full body from a mukken search-ad detail page.
 */
async function enrichMukkenAd(page, entry) {
  await page.goto(entry.original_url, {
    waitUntil: "domcontentloaded",
    timeout: navigationMs,
  });

  const detail = await page.evaluate(() => {
    const title = document.querySelector("h1")?.textContent?.trim() ?? "";
    const description =
      document
        .querySelector("main, article, .sa-description, .content-wrapper")
        ?.textContent?.replace(/\s+/g, " ")
        .trim() ?? "";
    const wanted = document.body.innerText.match(/Gesucht\s+([^\n]+)/i)?.[1]?.trim();
    const location = document.body.innerText.match(/Gesucht in:\s*([^\n]+)/i)?.[1]?.trim();
    const date = document.body.innerText.match(/(\d{2}\.\d{2}\.\d{4})/)?.[1] ?? null;

    return { title, description, wanted, location, date };
  });

  if (detail.title) {
    entry.title = detail.title;
  }

  if (detail.description && detail.description.length > (entry.description?.length ?? 0)) {
    entry.description = detail.description.slice(0, 12000);
  }

  if (detail.date) {
    entry.published_at = parseGermanListingDate(detail.date) ?? entry.published_at;
  }

  if (detail.wanted && entry.description && !entry.description.includes(detail.wanted)) {
    entry.description = `${entry.description}\n\nWanted: ${detail.wanted}`;
  }

  if (detail.location && entry.description && !entry.description.includes(detail.location)) {
    entry.description = `${entry.description}\n\nLocation: ${detail.location}`;
  }
}

/**
 * Converts a parsed card into a database-ready listing object.
 */
function finalizeEntry(card, originalUrl) {
  return {
    board_name: BOARD_NAME,
    title: buildTitle(card),
    description: buildDescription(card),
    original_url: originalUrl,
    published_at: card.date ? parseGermanListingDate(card.date) : null,
    listing_type_hint: parseListingTypeHint(card),
    _kind: card.kind,
  };
}

/**
 * Scrapes Berlin musician profiles and search ads from mukken.com.
 */
async function scrapeMukken(page, options = {}) {
  const { incremental = false, knownUrls = new Set() } = options;
  const searchHash = await loadMukkenSearchPage(page);
  const pending = [];
  const seenUrls = new Set();
  let pageIndex = 1;

  while (true) {
    const rawText = await fetchMukkenSearchJson(
      page,
      "search-musicians",
      pageIndex,
      searchHash,
    );
    const cards = parseSearchResponse("search-musicians", rawText);
    let newOnPage = 0;

    for (const card of cards) {
      const originalUrl = normalizeListingUrl(card.href);

      if (!originalUrl || seenUrls.has(originalUrl)) {
        continue;
      }

      if (isKnownListing(knownUrls, incremental, originalUrl)) {
        continue;
      }

      seenUrls.add(originalUrl);
      newOnPage += 1;
      pending.push(finalizeEntry(card, originalUrl));
    }

    if (incremental && newOnPage === 0) {
      console.log(
        `[${BOARD_NAME}] musician page ${pageIndex}: no new listings, stopping`,
      );
      break;
    }

    if (!cards.length || (newOnPage === 0 && !incremental)) {
      break;
    }

    pageIndex += 1;
  }

  const tenderText = await fetchMukkenSearchJson(page, "search-tender-offers", 1, searchHash);
  const adCards = parseSearchResponse("search-tender-offers", tenderText);

  for (const card of adCards) {
    const originalUrl = normalizeListingUrl(card.href);

    if (!originalUrl || seenUrls.has(originalUrl)) {
      continue;
    }

    if (!isBerlinLocation(`${card.location || ""} ${card.title || ""} ${card.excerpt || ""}`)) {
      continue;
    }

    if (isKnownListing(knownUrls, incremental, originalUrl)) {
      continue;
    }

    seenUrls.add(originalUrl);
    pending.push(finalizeEntry(card, originalUrl));
  }

  if (!pending.length) {
    console.log(`[${BOARD_NAME}] 0 new listings`);
    return [];
  }

  const profiles = pending.filter((entry) => entry._kind === "profile");
  const ads = pending.filter((entry) => entry._kind === "ad");

  if (profiles.length) {
    console.log(
      `[${BOARD_NAME}] ${profiles.length} profiles, fetching full text from detail pages...`,
    );

    await enrichEntriesInParallel(page.context(), profiles, enrichMukkenProfile, {
      boardLabel: `${BOARD_NAME} profiles`,
      concurrency: 4,
      logEvery: 50,
    });
  }

  if (ads.length) {
    console.log(
      `[${BOARD_NAME}] ${ads.length} search ads, fetching full text from detail pages...`,
    );

    await enrichEntriesInParallel(page.context(), ads, enrichMukkenAd, {
      boardLabel: `${BOARD_NAME} ads`,
      concurrency: 4,
      logEvery: 20,
    });
  }

  const entries = pending.map(({ _kind, ...entry }) => entry);
  console.log(`[${BOARD_NAME}] ${entries.length} listings`);
  return entries;
}

module.exports = {
  scrapeMukken,
  enrichMukkenProfile,
  enrichMukkenAd,
  parseProfileCards,
  parseTenderCards,
  isBerlinLocation,
};
