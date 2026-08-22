require("dotenv").config({ path: ".env.local" });
require("dotenv").config();
const {
  listingContentKey,
  preferEntry,
} = require("./lib/listing-dedupe");
const { createScraperSupabaseClient } = require("./lib/supabase");

const PAGE_SIZE = 1000;
const DELETE_BATCH = 100;

/**
 * Loads every entry needed to group scraped-board content duplicates.
 */
async function loadAllEntries(supabase) {
  const rows = [];
  let from = 0;

  while (true) {
    const { data, error } = await supabase
      .from("entries")
      .select(
        "id, board_name, title, description, original_url, published_at, created_by",
      )
      .range(from, from + PAGE_SIZE - 1);

    if (error) {
      throw error;
    }

    if (!data?.length) {
      break;
    }

    rows.push(...data);

    if (data.length < PAGE_SIZE) {
      break;
    }

    from += PAGE_SIZE;
  }

  return rows;
}

/**
 * Deletes duplicate scraped listings, keeping one row per board + listing body.
 */
async function dedupeStoredEntries() {
  const supabase = createScraperSupabaseClient();
  const rows = await loadAllEntries(supabase);
  const groups = new Map();

  for (const row of rows) {
    if (row.created_by || row.board_name === "community") {
      continue;
    }

    const key = listingContentKey(row.board_name, row.description);

    if (!key) {
      continue;
    }

    const group = groups.get(key) ?? [];
    group.push(row);
    groups.set(key, group);
  }

  const idsToDelete = [];
  const summary = {};

  for (const group of groups.values()) {
    if (group.length < 2) {
      continue;
    }

    const keeper = group.reduce((winner, row) => preferEntry(winner, row));
    const extras = group.filter((row) => row.id !== keeper.id);
    summary[keeper.board_name] =
      (summary[keeper.board_name] ?? 0) + extras.length;
    idsToDelete.push(...extras.map((row) => row.id));
  }

  console.log(
    `Found ${idsToDelete.length} duplicate rows across ${Object.keys(summary).length} boards.`,
  );
  console.log(summary);

  for (let index = 0; index < idsToDelete.length; index += DELETE_BATCH) {
    const batch = idsToDelete.slice(index, index + DELETE_BATCH);
    const { error } = await supabase.from("entries").delete().in("id", batch);

    if (error) {
      throw error;
    }

    console.log(
      `Deleted ${Math.min(index + DELETE_BATCH, idsToDelete.length)} / ${idsToDelete.length}`,
    );
  }

  console.log("Dedupe complete.");
}

dedupeStoredEntries().catch((error) => {
  console.error("Dedupe failed:", error.message);
  process.exit(1);
});
