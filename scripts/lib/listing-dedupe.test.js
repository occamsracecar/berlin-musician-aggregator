const { test } = require("node:test");
const assert = require("node:assert/strict");
const {
  listingContentKey,
  preferEntry,
  dedupeEntriesByContent,
  rejectKnownContentDuplicates,
} = require("./listing-dedupe");

test("listingContentKey ignores short bodies and community posts", () => {
  assert.equal(listingContentKey("community", "a".repeat(200)), null);
  assert.equal(listingContentKey("berlinmusiker.de", "Hallo!"), null);
  assert.ok(
    listingContentKey("berlinmusiker.de", `Thrash drummer wanted. ${"x".repeat(80)}`),
  );
});

test("listingContentKey treats whitespace-only differences as the same ad", () => {
  const board = "berlinmusiker.de";
  const a = "Wir suchen einen Drummer.\n\nMehr Text folgt hier genug fuer den fingerprint.";
  const b = "Wir suchen einen Drummer.  Mehr Text folgt hier genug fuer den fingerprint.";
  assert.equal(listingContentKey(board, a), listingContentKey(board, b));
});

test("dedupeEntriesByContent keeps the canonical noisy-rooms URL", () => {
  const body =
    "Hard rock band looking for a vocalist in Berlin with original songs, regular gigs, and weekly rehearsals.";
  const kept = dedupeEntriesByContent([
    {
      board_name: "noisy-rooms.com",
      description: body,
      original_url:
        "https://noisy-rooms.com/index.php/community/hard-rock-band-looking-vocalist-de-0",
    },
    {
      board_name: "noisy-rooms.com",
      description: body,
      original_url: "https://noisy-rooms.com/community/hard-rock-band-looking-vocalist-de",
    },
  ]);

  assert.equal(kept.length, 1);
  assert.equal(
    kept[0].original_url,
    "https://noisy-rooms.com/community/hard-rock-band-looking-vocalist-de",
  );
});

test("preferEntry keeps the longer description", () => {
  const winner = preferEntry(
    { description: "short body ".repeat(10), original_url: "/id/1.html" },
    { description: "longer body ".repeat(20), original_url: "/id/2.html" },
  );
  assert.match(winner.description, /longer body/);
});

test("rejectKnownContentDuplicates allows upserts of the same URL", () => {
  const body = "Band sucht Bassisten in Berlin fuer regelmaessige Proben und Auftritte bald.";
  const url = "https://www.berlinmusiker.de/anzeigen/antworten/id/1.html";
  const entry = {
    board_name: "berlinmusiker.de",
    description: body,
    original_url: url,
  };
  const key = listingContentKey(entry.board_name, entry.description);
  const kept = rejectKnownContentDuplicates(
    [entry],
    new Set([key]),
    new Set([url]),
  );
  assert.equal(kept.length, 1);
});
