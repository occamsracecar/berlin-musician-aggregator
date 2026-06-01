"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { mergeListingGenres, parseSubmittedGenres } from "@/lib/classify";
import { createSupabaseClient } from "@/lib/supabase/client";

export type SubmitListingState = {
  success: boolean;
  message: string;
};

const COMMUNITY_BOARD = "community";
const MAX_TITLE_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 5000;
const MAX_CONTACT_LENGTH = 500;

/**
 * Validates and inserts a community-submitted listing into Supabase.
 */
export async function submitListing(
  _prevState: SubmitListingState,
  formData: FormData,
): Promise<SubmitListingState> {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const listingType = String(formData.get("listing_type") ?? "").trim();
  const contactUrl = String(formData.get("contact_url") ?? "").trim();
  const selectedGenres = parseSubmittedGenres(formData.getAll("genres"));

  if (!title || title.length > MAX_TITLE_LENGTH) {
    return {
      success: false,
      message: "Please enter a title up to 200 characters.",
    };
  }

  if (!description || description.length > MAX_DESCRIPTION_LENGTH) {
    return {
      success: false,
      message: "Please enter a description up to 5000 characters.",
    };
  }

  if (!["band_seeking", "musician_seeking"].includes(listingType)) {
    return {
      success: false,
      message: "Please select a listing type.",
    };
  }

  if (contactUrl && contactUrl.length > MAX_CONTACT_LENGTH) {
    return {
      success: false,
      message: "Contact link is too long.",
    };
  }

  if (contactUrl && !/^https?:\/\//i.test(contactUrl) && !/^mailto:/i.test(contactUrl)) {
    return {
      success: false,
      message: "Contact link must start with http://, https://, or mailto:",
    };
  }

  const supabase = createSupabaseClient();
  const genres = mergeListingGenres(selectedGenres, title, description);

  const { error } = await supabase.from("entries").insert({
    board_name: COMMUNITY_BOARD,
    title,
    description,
    listing_type: listingType,
    genres,
    original_url: `community://${randomUUID()}`,
    contact_url: contactUrl || null,
    published_at: new Date().toISOString(),
  });

  if (error) {
    return {
      success: false,
      message: "Could not save your listing. Please try again.",
    };
  }

  revalidatePath("/");
  revalidatePath("/submit");

  return {
    success: true,
    message: "Your listing was published. It now appears in Browse listings.",
  };
}
