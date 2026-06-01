import type { Entry } from "@/types/entry";

/**
 * Returns whether a listing was posted by a signed-in user on this app.
 */
export function isUserSubmittedListing(entry: Pick<Entry, "created_by">): boolean {
  return Boolean(entry.created_by);
}
