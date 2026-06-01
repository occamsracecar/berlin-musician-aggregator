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

module.exports = { parseGermanListingDate };
