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
