"use server";

import { cookies } from "next/headers";
import {
  FIRST_LISTING_PROFILE_COOKIE,
  FIRST_LISTING_PROFILE_COOKIE_MAX_AGE,
} from "@/lib/first-listing-setup";

/**
 * Records that the first-listing profile prompt was seen or skipped.
 */
export async function markFirstListingProfileSeen(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(FIRST_LISTING_PROFILE_COOKIE, "1", {
    path: "/",
    maxAge: FIRST_LISTING_PROFILE_COOKIE_MAX_AGE,
    sameSite: "lax",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
}
