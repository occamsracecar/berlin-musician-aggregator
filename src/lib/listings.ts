import type { SupabaseClient } from "@supabase/supabase-js";
import type { Entry } from "@/types/entry";

const COMMUNITY_BOARD = "community";

/**
 * Returns whether a listing is a community post on this app.
 */
export function isCommunityListing(
  entry: Pick<Entry, "board_name" | "created_by">,
): boolean {
  return entry.board_name === COMMUNITY_BOARD && Boolean(entry.created_by);
}

/**
 * Returns whether a listing was posted by a signed-in user on this app.
 */
export function isUserSubmittedListing(entry: Pick<Entry, "created_by">): boolean {
  return Boolean(entry.created_by);
}

/**
 * Returns whether visitors can send an in-app message (emailed to the author).
 */
export function canReceiveListingMessages(
  entry: Pick<Entry, "board_name" | "created_by">,
): boolean {
  return isCommunityListing(entry);
}

/**
 * Counts community listings authored by this user, or null if the query fails.
 */
export async function countUserCommunityListings(
  supabase: SupabaseClient,
  userId: string,
): Promise<number | null> {
  const { count, error } = await supabase
    .from("entries")
    .select("id", { count: "exact", head: true })
    .eq("created_by", userId)
    .eq("board_name", COMMUNITY_BOARD);

  if (error) {
    return null;
  }

  return count ?? 0;
}
