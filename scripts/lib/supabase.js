const { createClient } = require("@supabase/supabase-js");
const WebSocket = require("ws");
require("dotenv").config({ path: ".env.local" });
require("dotenv").config();

/**
 * Creates a Supabase admin client for scraper upserts using the service role key.
 */
function createScraperSupabaseClient() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) or SUPABASE_SERVICE_ROLE_KEY",
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    realtime: { transport: WebSocket },
  });
}

/**
 * Upserts scraped listings into the entries table, deduplicating on original_url.
 */
async function upsertEntries(supabase, entries) {
  if (!entries.length) {
    return { count: 0, error: null };
  }

  const batchSize = 200;
  let totalCount = 0;

  for (let index = 0; index < entries.length; index += batchSize) {
    const batch = entries.slice(index, index + batchSize).map((entry) => {
      const { listing_type_hint, ...row } = entry;
      return row;
    });

    const { data, error } = await supabase
      .from("entries")
      .upsert(batch, {
        onConflict: "original_url",
        ignoreDuplicates: false,
      })
      .select("id");

    if (error) {
      return { count: totalCount, error };
    }

    totalCount += data?.length ?? 0;
  }

  return { count: totalCount, error: null };
}

module.exports = { createScraperSupabaseClient, upsertEntries };
