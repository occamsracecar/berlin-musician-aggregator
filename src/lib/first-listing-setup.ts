export const FIRST_LISTING_PROFILE_COOKIE = "bbh_first_profile_seen";
export const FIRST_LISTING_PROFILE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
export const FIRST_LISTING_FROM_PARAM = "first-listing";
export const FIRST_LISTING_PROFILE_HREF = `/profile?from=${FIRST_LISTING_FROM_PARAM}`;

type FirstListingPromptInput = {
  isSignedIn: boolean;
  communityListingCount: number | null;
  cookieValue: string | undefined;
};

/**
 * Returns whether the first-listing profile cookie has already been stored.
 */
export function isFirstListingProfileSeen(
  cookieValue: string | undefined,
): boolean {
  return cookieValue === "1";
}

/**
 * Returns whether `/profile` was opened from the first-listing prompt.
 */
export function isFirstListingProfileSetup(from: string | undefined): boolean {
  return from === FIRST_LISTING_FROM_PARAM;
}

/**
 * Returns whether to show the one-time profile setup prompt on `/submit`.
 */
export function shouldPromptFirstListingProfileSetup({
  isSignedIn,
  communityListingCount,
  cookieValue,
}: FirstListingPromptInput): boolean {
  if (!isSignedIn || communityListingCount !== 0) {
    return false;
  }

  return !isFirstListingProfileSeen(cookieValue);
}
