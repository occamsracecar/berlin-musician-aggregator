import assert from "node:assert/strict";
import test from "node:test";
import {
  FIRST_LISTING_FROM_PARAM,
  isFirstListingProfileSeen,
  isFirstListingProfileSetup,
  shouldPromptFirstListingProfileSetup,
} from "./first-listing-setup.ts";

test("shouldPromptFirstListingProfileSetup only for signed-in users with zero listings", () => {
  assert.equal(
    shouldPromptFirstListingProfileSetup({
      isSignedIn: true,
      communityListingCount: 0,
      cookieValue: undefined,
    }),
    true,
  );
  assert.equal(
    shouldPromptFirstListingProfileSetup({
      isSignedIn: false,
      communityListingCount: 0,
      cookieValue: undefined,
    }),
    false,
  );
  assert.equal(
    shouldPromptFirstListingProfileSetup({
      isSignedIn: true,
      communityListingCount: 1,
      cookieValue: undefined,
    }),
    false,
  );
});

test("shouldPromptFirstListingProfileSetup stays hidden after skip or failed count", () => {
  assert.equal(
    shouldPromptFirstListingProfileSetup({
      isSignedIn: true,
      communityListingCount: 0,
      cookieValue: "1",
    }),
    false,
  );
  assert.equal(
    shouldPromptFirstListingProfileSetup({
      isSignedIn: true,
      communityListingCount: null,
      cookieValue: undefined,
    }),
    false,
  );
  assert.equal(isFirstListingProfileSeen("1"), true);
  assert.equal(isFirstListingProfileSeen(undefined), false);
  assert.equal(isFirstListingProfileSetup(FIRST_LISTING_FROM_PARAM), true);
  assert.equal(isFirstListingProfileSetup(undefined), false);
});
