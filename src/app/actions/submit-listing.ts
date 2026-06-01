"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { parseListingFormData } from "@/lib/listing-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type SubmitListingState = {
  success: boolean;
  message: string;
};

const COMMUNITY_BOARD = "community";

/**
 * Validates and inserts a community listing for the signed-in user.
 */
export async function submitListing(
  _prevState: SubmitListingState,
  formData: FormData,
): Promise<SubmitListingState> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: "Sign in to publish a listing.",
    };
  }

  const parsed = parseListingFormData(formData);

  if (!parsed.ok) {
    return { success: false, message: parsed.message };
  }

  const { data } = parsed;

  const { error } = await supabase.from("entries").insert({
    board_name: COMMUNITY_BOARD,
    title: data.title,
    description: data.description,
    listing_type: data.listingType,
    genres: data.genres,
    original_url: `community://${randomUUID()}`,
    contact_url: null,
    published_at: new Date().toISOString(),
    created_by: user.id,
  });

  if (error) {
    return {
      success: false,
      message: "Could not save your listing. Please try again.",
    };
  }

  revalidatePath("/");
  revalidatePath("/submit");
  revalidatePath("/profile");

  return {
    success: true,
    message: "Your listing was published. Others can message you by email.",
  };
}
