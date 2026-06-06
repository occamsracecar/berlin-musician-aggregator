/**
 * Parses German relative and partial dates from Berlin musician boards.
 */
function parseGermanListingDate(rawDate) {
  if (!rawDate) {
    return null;
  }

  const normalized = rawDate.trim().toLowerCase();
  const now = new Date();

  if (normalized === "heute" || normalized === "today") {
    return now.toISOString();
  }

  if (normalized === "gestern" || normalized === "yesterday") {
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString();
  }

  const dottedMatch = normalized.match(/^(\d{1,2})\.(\d{1,2})\.?$/);
  if (dottedMatch) {
    const day = Number(dottedMatch[1]);
    const month = Number(dottedMatch[2]) - 1;
    let year = now.getFullYear();
    const candidate = new Date(year, month, day);

    if (candidate > now) {
      year -= 1;
    }

    return new Date(year, month, day).toISOString();
  }

  const fullMatch = normalized.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (fullMatch) {
    const day = Number(fullMatch[1]);
    const month = Number(fullMatch[2]) - 1;
    const year = Number(fullMatch[3]);
    return new Date(year, month, day).toISOString();
  }

  const germanMonths = {
    januar: 0,
    februar: 1,
    märz: 2,
    maerz: 2,
    april: 3,
    mai: 4,
    juni: 5,
    juli: 6,
    august: 7,
    september: 8,
    oktober: 9,
    november: 10,
    dezember: 11,
  };

  const longMatch = rawDate.match(
    /(\d{1,2})\.\s*(Januar|Februar|März|Maerz|April|Mai|Juni|Juli|August|September|Oktober|November|Dezember)\s*(\d{4})/i,
  );

  if (longMatch) {
    const day = Number(longMatch[1]);
    const month = germanMonths[longMatch[2].toLowerCase()];
    const year = Number(longMatch[3]);

    if (month !== undefined) {
      return new Date(year, month, day).toISOString();
    }
  }

  return null;
}

/**
 * Pulls the best publication date from free-form Backstage text (feedhide, detail page).
 * Prefers long German dates ("5. Juni 2026") over bare "02.05." fragments.
 */
function extractPublicationDateFromText(rawText) {
  if (!rawText?.trim()) {
    return null;
  }

  const text = rawText.trim();

  const longMatch = text.match(
    /(\d{1,2})\.\s*(Januar|Februar|März|Maerz|April|Mai|Juni|Juli|August|September|Oktober|November|Dezember)\s*(\d{4})/i,
  );

  if (longMatch) {
    return parseGermanListingDate(
      `${longMatch[1]}. ${longMatch[2]} ${longMatch[3]}`,
    );
  }

  const fullMatch = text.match(/(\d{1,2}\.\d{1,2}\.\d{4})/);
  if (fullMatch) {
    return parseGermanListingDate(fullMatch[1]);
  }

  const shortMatch = text.match(/(\d{1,2}\.\d{1,2}\.?)(?!\d)/);
  if (shortMatch) {
    return parseGermanListingDate(shortMatch[1]);
  }

  return parseGermanListingDate(text);
}

/** Bandmix activity labels mapped to approximate days since last activity (+7d deprioritize). */
const BANDMIX_ACTIVITY_DAYS_AGO = [
  { pattern: /innerhalb\s+24\s+stunden/i, daysAgo: 8 },
  { pattern: /während der letzten woche|letzte\s+woche/i, daysAgo: 14 },
  { pattern: /letzten\s+2\s+wochen/i, daysAgo: 21 },
  { pattern: /innerhalb\s+eines\s+monats/i, daysAgo: 37 },
  { pattern: /vor\s+mehr\s+als\s+einem\s+monat/i, daysAgo: 97 },
];

/**
 * Estimates last-active date from Bandmix "Aktiv …" labels (not calendar dates).
 */
function parseBandmixActivityDate(rawActivity, referenceDate = new Date()) {
  if (!rawActivity?.trim()) {
    return null;
  }

  const normalized = rawActivity.trim();

  for (const { pattern, daysAgo } of BANDMIX_ACTIVITY_DAYS_AGO) {
    if (pattern.test(normalized)) {
      const estimated = new Date(referenceDate);
      estimated.setDate(estimated.getDate() - daysAgo);
      estimated.setUTCHours(12, 0, 0, 0);
      return estimated.toISOString();
    }
  }

  return null;
}

module.exports = {
  parseGermanListingDate,
  parseBandmixActivityDate,
  extractPublicationDateFromText,
};
