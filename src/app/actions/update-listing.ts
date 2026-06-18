"use server";

import { revalidatePath } from "next/cache";
import { parseListingFormData } from "@/lib/listing-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type UpdateListingState = {
  success: boolean;
  message: string;
};

/**
 * Updates a community listing owned by the signed-in user.
 */
export async function updateListing(
  _prevState: UpdateListingState,
  formData: FormData,
): Promise<UpdateListingState> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Melde dich an, um dein Inserat zu bearbeiten." };
  }

  const entryId = String(formData.get("entry_id") ?? "").trim();

  if (!entryId) {
    return { success: false, message: "Inserat nicht gefunden." };
  }

  const parsed = parseListingFormData(formData);

  if (!parsed.ok) {
    return { success: false, message: parsed.message };
  }

  const { data } = parsed;

  const { data: existing, error: fetchError } = await supabase
    .from("entries")
    .select("id, created_by, board_name")
    .eq("id", entryId)
    .maybeSingle();

  if (fetchError || !existing) {
    return { success: false, message: "Inserat nicht gefunden." };
  }

  if (existing.created_by !== user.id || existing.board_name !== "community") {
    return {
      success: false,
      message: "Du kannst nur deine eigenen Community-Inserate bearbeiten.",
    };
  }

  const { error } = await supabase
    .from("entries")
    .update({
      title: data.title,
      description: data.description,
      listing_type: data.listingType,
      genres: data.genres,
      updated_at: new Date().toISOString(),
    })
    .eq("id", entryId);

  if (error) {
    return {
      success: false,
      message: "Änderungen konnten nicht gespeichert werden. Bitte versuche es erneut.",
    };
  }

  revalidatePath("/");
  revalidatePath("/profile");
  revalidatePath("/submit");

  return { success: true, message: "Inserat aktualisiert." };
}
