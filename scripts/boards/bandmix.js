const { enrichEntriesInParallel } = require("../lib/parallel-enrich");

const BOARD_NAME = "bandmix.de";
const BASE_URL = "https://www.bandmix.de/berlin/";
const ORIGIN = "https://www.bandmix.de";

/**
 * Loads a Bandmix page and waits for Cloudflare protection to finish.
 */
async function loadBandmixPage(page, url) {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });

  for (let attempt = 0; attempt < 20; attempt += 1) {
    const title = await page.title();
    if (!title.includes("Just a moment")) {
      return;
    }

    await page.waitForTimeout(2000);
  }

  throw new Error(`Bandmix page did not load: ${url}`);
}

/**
 * Builds a paginated Bandmix Berlin listing URL.
 */
function buildListingUrl(pageIndex) {
  return pageIndex === 1 ? BASE_URL : `${BASE_URL}page${pageIndex}/`;
}

/**
 * Normalizes a Bandmix profile URL to an absolute canonical form.
 */
function normalizeListingUrl(href) {
  if (!href) {
    return null;
  }

  if (href.startsWith("http")) {
    return href.endsWith("/") ? href : `${href}/`;
  }

  return `${ORIGIN}${href.startsWith("/") ? href : `/${href}`}`.replace(
    /([^/])\/?$/,
    "$1/",
  );
}

/**
 * Builds a listing title from profile metadata and full profile text.
 */
function buildTitle(profile) {
  if (profile.snippet && !isTruncated(profile.snippet) && profile.snippet.length > 12) {
    return profile.snippet.replace(/\s+(\.{3}|…)\s*$/u, "").trim();
  }

  if (profile.name) {
    return profile.name;
  }

  if (profile.h1) {
    return profile.h1.replace(/\s*\+\s*Band.*$/i, "").trim();
  }

  return "Bandmix profile";
}

/**
 * Returns whether preview text was truncated on the index card.
 */
function isTruncated(text) {
  return /(\.{3}|…)\s*$/u.test(text || "");
}

/**
 * Builds a full searchable description from Bandmix profile metadata.
 */
function buildDescription(profile) {
  const parts = [
    profile.name ? `Profile: ${profile.name}` : null,
    profile.location ? `Location: ${profile.location}` : null,
    profile.genres ? `Genres: ${profile.genres}` : null,
    profile.instruments ? `Instruments: ${profile.instruments}` : null,
    profile.activity ? `Activity: ${profile.activity}` : null,
    profile.fullText || null,
  ].filter(Boolean);

  return parts.join("\n\n") || null;
}

/**
 * Maps Bandmix profile metadata to a listing type hint.
 */
function parseListingTypeHint(profile) {
  const instruments = (profile.instruments || "").toLowerCase();
  const text = `${profile.fullText || ""} ${profile.snippet || ""} ${profile.name || ""}`.toLowerCase();

  if (instruments === "band" || text.includes("band sucht") || text.includes("suche nach")) {
    return "band_seeking";
  }

  if (instruments && instruments !== "band") {
    return "musician_seeking";
  }

  return null;
}

/**
 * Fetches full profile text from a Bandmix detail page.
 */
async function enrichBandmixDetail(page, entry) {
  await loadBandmixPage(page, entry.original_url);

  const detail = await page.evaluate(() => {
    const allowed = new Set(["SUCHE", "ÜBER", "Einflüsse"]);
    const sections = {};

    for (const heading of document.querySelectorAll("h2")) {
      const key = heading.textContent?.trim();
      if (!key || !allowed.has(key)) {
        continue;
      }

      const lines = [];
      let element = heading.nextElementSibling;

      while (element && element.tagName !== "H2") {
        const text = element.innerText?.trim();
        if (
          text &&
          text.length < 8000 &&
          !text.includes("Ansehen Kontaktieren") &&
          !/^(Benutzername|Mitglied seit|Wie engagiert|Aktiv innerhalb)/i.test(text)
        ) {
          lines.push(text);
        }
        element = element.nextElementSibling;
      }

      if (lines.length) {
        sections[key] = lines.join("\n");
      }
    }

    return {
      h1: document.querySelector("h1")?.textContent?.trim() ?? "",
      sections,
    };
  });

  entry._profile.fullText = Object.entries(detail.sections)
    .map(([key, value]) => `${key}:\n${value}`)
    .join("\n\n");
  entry._profile.h1 = detail.h1;
}

/**
 * Extracts unique profile cards from the current Bandmix results page.
 */
async function extractProfiles(page) {
  return page.evaluate(() => {
    const excluded = new Set([
      "search",
      "browse",
      "sign-in",
      "sign-up",
      "forgot",
      "support",
      "berlin",
      "promote",
    ]);
    const bySlug = new Map();

    for (const card of document.querySelectorAll(".result-box, .result-box-mobile")) {
      const anchor =
        card.querySelector('a.overlay[href]') ||
        card.querySelector('h2 a[href]') ||
        card.querySelector('a[href][title^="Profile"]');

      if (!anchor) {
        continue;
      }

      const href = anchor.getAttribute("href") ?? "";
      const slug = href.replace(/^\/|\/$/g, "").toLowerCase();

      if (!slug || excluded.has(slug) || slug.startsWith("page")) {
        continue;
      }

      const existing = bySlug.get(slug) ?? {};
      const name =
        card.querySelector("h2 a.no_translate, h2 a, h2 div")?.textContent
          ?.replace(/\s+/g, " ")
          .trim() ?? "";
      const location =
        card.querySelector(".location, ul.info li")?.textContent
          ?.replace(/\s+/g, " ")
          .trim() ?? "";
      const genres =
        card.querySelector("li.music")?.textContent?.replace(/\s+/g, " ").trim() ??
        "";
      const instruments =
        card.querySelector(".instruments")?.textContent?.replace(/\s+/g, " ").trim() ??
        "";
      const snippet =
        card.querySelector(".mobile-description-profile")?.textContent
          ?.replace(/\s+/g, " ")
          .trim() ?? "";
      const activity =
        card.querySelector("em.date")?.textContent?.replace(/\s+/g, " ").trim() ??
        "";

      bySlug.set(slug, {
        href: existing.href || href,
        name: existing.name || name,
        location: existing.location || location,
        genres: existing.genres || genres,
        instruments: existing.instruments || instruments,
        snippet: existing.snippet || snippet,
        activity: existing.activity || activity,
      });
    }

    return [...bySlug.values()];
  });
}

/**
 * Converts a scraped profile into a database-ready entry object.
 */
function finalizeEntry(profile, originalUrl) {
  return {
    board_name: BOARD_NAME,
    title: buildTitle(profile),
    description: buildDescription(profile),
    original_url: originalUrl,
    published_at: new Date().toISOString(),
    listing_type_hint: parseListingTypeHint(profile),
  };
}

/**
 * Scrapes Berlin musician profiles from bandmix.de.
 */
async function scrapeBandmix(page) {
  const pending = [];
  const seenSlugs = new Set();
  let pageIndex = 1;

  while (true) {
    const url = buildListingUrl(pageIndex);
    await loadBandmixPage(page, url);

    const profiles = await extractProfiles(page);
    let newProfiles = 0;

    for (const profile of profiles) {
      const originalUrl = normalizeListingUrl(profile.href);
      const slug = originalUrl?.replace(ORIGIN, "").replace(/^\/|\/$/g, "").toLowerCase();

      if (!originalUrl || !slug || seenSlugs.has(slug)) {
        continue;
      }

      seenSlugs.add(slug);
      newProfiles += 1;

      pending.push({
        original_url: originalUrl,
        _profile: { ...profile, fullText: null, h1: null },
      });
    }

    if (newProfiles === 0) {
      break;
    }

    pageIndex += 1;
  }

  console.log(`[${BOARD_NAME}] ${pending.length} profiles found, fetching full text...`);

  await enrichEntriesInParallel(page.context(), pending, enrichBandmixDetail, {
    boardLabel: BOARD_NAME,
    concurrency: 4,
    logEvery: 200,
  });

  const entries = pending.map((item) => finalizeEntry(item._profile, item.original_url));
  console.log(`[${BOARD_NAME}] ${entries.length} listings`);
  return entries;
}

module.exports = { scrapeBandmix, loadBandmixPage };
