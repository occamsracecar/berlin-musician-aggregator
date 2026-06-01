const GENRE_RULES = [
  { genre: "Metal", keywords: ["metal", "metalcore", "hardcore", "death metal", "black metal", "nu metal", "d-beat", "hc", "thrash"] },
  { genre: "Punk", keywords: ["punk", "grunge", "post-punk", "crust", "neocrust", "screamo"] },
  { genre: "Rock", keywords: ["rock", "hard rock", "classic rock", "indie rock", "alternative", "garage rock"] },
  { genre: "Jazz", keywords: ["jazz", "fusion", "swing", "bebop", "bossa", "latin jazz"] },
  { genre: "Blues", keywords: ["blues", "rhythm and blues", "r&b"] },
  { genre: "Pop", keywords: ["pop", "synth pop", "schlager", "top 40", "cover band", "cover-duo"] },
  { genre: "Funk / Soul", keywords: ["funk", "soul", "motown", "neo soul", "neosoul", "disco"] },
  { genre: "Hip-Hop", keywords: ["hip hop", "hip-hop", "hiphop", "rap", "trap", "boombap", "beatmaker"] },
  { genre: "Electronic", keywords: ["electronic", "electronica", "house", "techno", "dnb", "drum and bass", "ambient", "synth", "ableton", "edm"] },
  { genre: "Latin", keywords: ["latin", "salsa", "cumbia", "samba", "bossa nova", "reggaeton"] },
  { genre: "Folk / Acoustic", keywords: ["folk", "acoustic", "country", "bluegrass", "singer-songwriter"] },
  { genre: "Classical", keywords: ["classical", "klassik", "orchestra", "orchester", "philharm", "chor", "choir", "oper", "opera"] },
  { genre: "Reggae", keywords: ["reggae", "dub", "ska"] },
  { genre: "World", keywords: ["world music", "weltmusik", "afro", "klezmer", "balkan"] },
];

const LISTING_TYPE = {
  BAND_SEEKING: "band_seeking",
  MUSICIAN_SEEKING: "musician_seeking",
};

const ROLE_PATTERN =
  "(?:musiker(?:in)?|sänger(?:in)?|gitarrist(?:in)?|bassist(?:in)?|drummer|keyboarder|schlagzeuger|vocal(?:ist)?|vocals|lead\\s+vocal|trompet(?:er)?|horn|pianist|saxophonist|musician|singer|guitarist|bassist|drummer|keyboard|pianist|trumpet|trombone)";

/**
 * Detects genre tags from listing title and description text.
 */
function detectGenres(text) {
  const normalized = text.toLowerCase();
  const genres = [];

  for (const rule of GENRE_RULES) {
    if (rule.keywords.some((keyword) => normalized.includes(keyword))) {
      genres.push(rule.genre);
    }
  }

  return genres;
}

/**
 * Scores listing text for band-seeking vs musician-seeking signals.
 */
function scoreListingType(title, description) {
  const titleNorm = (title || "").toLowerCase().trim();
  const fullText = `${titleNorm} ${(description || "").toLowerCase()}`;

  let bandScore = 0;
  let musicianScore = 0;

  const bandPatterns = [
    { pattern: new RegExp(`^suchen\\b`), weight: 5 },
    { pattern: new RegExp(`^sucht\\s+${ROLE_PATTERN}\\b`), weight: 5 },
    { pattern: /\b(?:band|trio|projekt|chor|ensemble|orchester|gruppe|formation|wir)\s+(?:sucht|suchen)\b/, weight: 5 },
    { pattern: /\bneubesetzung\b/, weight: 4 },
    { pattern: /\bgesucht wird\b/, weight: 4 },
    { pattern: new RegExp(`\\b${ROLE_PATTERN}\\s*(?:gesucht|wanted)\\b`), weight: 4 },
    { pattern: new RegExp(`\\b(?:wird|werden)\\s+(?:.*\\s+)?${ROLE_PATTERN}\\s+gesucht\\b`), weight: 4 },
    { pattern: /\bfront(?:frau|mann)\s+gesucht\b/, weight: 4 },
    { pattern: /\bverstärkung\b/, weight: 3 },
    { pattern: /\bneugründung\b/, weight: 3 },
    { pattern: /\bbandmusiker\b/, weight: 2 },
    { pattern: /\blooking for (?:a |an )?(?!band\b)(?:drummer|bassist|guitarist|singer|vocalist|keyboard|pianist|horn|trumpet|trombone|musician)/, weight: 3 },
    { pattern: new RegExp(`\\b(?:drummer|bassist|guitarist|singer|vocalist|keyboarder|musiker)\\s+wanted\\b`), weight: 3 },
    { pattern: /\b(?:player|musician)\s+wanted\b/, weight: 3 },
    { pattern: new RegExp(`\\bsucht (?:einen |eine |ein )?${ROLE_PATTERN}`), weight: 4 },
    { pattern: /\b\w[\w\s-]{2,40}\bsucht\b/, weight: 3 },
    { pattern: /\bwanted!?\b/, weight: 3 },
    { pattern: /\blooking for (?:new |more |)(?:drummers|musicians|people|guitarists|bassists|singers|members|horn|keys|keyboard)\b/, weight: 4 },
  ];

  const musicianPatterns = [
    { pattern: /\b(?:suche|sucht|suchen)\s+(?:eine |ein |einen )?band\b/, weight: 5 },
    { pattern: new RegExp(`^${ROLE_PATTERN}\\s+sucht\\b`), weight: 5 },
    { pattern: new RegExp(`\\b${ROLE_PATTERN}\\s+sucht\\s+(?:eine |ein )?band\\b`), weight: 5 },
    { pattern: /\bbiete\b/, weight: 4 },
    { pattern: /\bich\s+suche\b/, weight: 4 },
    { pattern: /\blooking for (?:a |an )?band\b/, weight: 4 },
    { pattern: /\bmusician looking for\b/, weight: 4 },
    { pattern: /\bseeking (?:a )?band\b/, weight: 4 },
    { pattern: /\bsuche (?:mitspieler|projekt|neue band)\b/, weight: 3 },
    { pattern: /\blooking for (?:a |an |my |)(?:\w+\s+){0,3}band\b/, weight: 4 },
    { pattern: /\b(?:drummer|bassist|guitarist|singer|musician|keyboarder|gitarrist|sänger(?:in)?)\s+looking for\b/, weight: 4 },
    { pattern: /\blooking for (?:people|musicians|projects|collaborators|bandmates)\b/, weight: 3 },
    { pattern: /\b(?:available|offering services)\b/, weight: 2 },
  ];

  for (const { pattern, weight } of bandPatterns) {
    if (pattern.test(titleNorm) || pattern.test(fullText)) {
      bandScore += weight;
    }
  }

  for (const { pattern, weight } of musicianPatterns) {
    if (pattern.test(titleNorm) || pattern.test(fullText)) {
      musicianScore += weight;
    }
  }

  return { bandScore, musicianScore };
}

/**
 * Infers whether a listing is band-seeking or musician-seeking from text.
 */
function detectListingType(title, description = "") {
  const { bandScore, musicianScore } = scoreListingType(title, description);

  if (bandScore === 0 && musicianScore === 0) {
    return null;
  }

  if (bandScore === musicianScore) {
    return null;
  }

  return bandScore > musicianScore
    ? LISTING_TYPE.BAND_SEEKING
    : LISTING_TYPE.MUSICIAN_SEEKING;
}

/**
 * Adds genre tags and listing type metadata to a scraped entry.
 */
function classifyEntry(entry) {
  const genres = detectGenres(`${entry.title} ${entry.description ?? ""}`);
  const listingType =
    detectListingType(entry.title, entry.description ?? "") ??
    entry.listing_type_hint ??
    null;
  const { listing_type_hint: _hint, ...rest } = entry;

  return {
    ...rest,
    genres,
    listing_type: listingType,
  };
}

module.exports = {
  GENRE_RULES,
  LISTING_TYPE,
  detectGenres,
  scoreListingType,
  detectListingType,
  classifyEntry,
};
