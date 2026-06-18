"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type DeleteListingState = {
  success: boolean;
  message: string;
};

/**
 * Deletes a community listing owned by the signed-in user.
 */
export async function deleteListing(
  _prevState: DeleteListingState,
  formData: FormData,
): Promise<DeleteListingState> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Melde dich an, um dein Inserat zu löschen." };
  }

  const entryId = String(formData.get("entry_id") ?? "").trim();

  if (!entryId) {
    return { success: false, message: "Inserat nicht gefunden." };
  }

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
      message: "Du kannst nur deine eigenen Community-Inserate löschen.",
    };
  }

  const { error } = await supabase.from("entries").delete().eq("id", entryId);

  if (error) {
    return {
      success: false,
      message: "Inserat konnte nicht gelöscht werden. Bitte versuche es erneut.",
    };
  }

  revalidatePath("/");
  revalidatePath("/profile");
  revalidatePath("/submit");

  return { success: true, message: "Inserat gelöscht." };
}
