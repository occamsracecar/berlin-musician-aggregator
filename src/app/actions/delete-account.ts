"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type DeleteAccountState = {
  success: boolean;
  message: string;
};

const CONFIRM_PHRASE = "DELETE";

/**
 * Permanently deletes the signed-in user's account, listings, and avatar files.
 */
export async function deleteAccount(
  _prevState: DeleteAccountState,
  formData: FormData,
): Promise<DeleteAccountState> {
  const confirm = String(formData.get("confirm") ?? "").trim();

  if (confirm !== CONFIRM_PHRASE) {
    return {
      success: false,
      message: `Type ${CONFIRM_PHRASE} to confirm account deletion.`,
    };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Sign in to delete your account." };
  }

  let admin;

  try {
    admin = createSupabaseAdminClient();
  } catch {
    return {
      success: false,
      message: "Account deletion is not configured. Contact support.",
    };
  }

  const { error: listingsError } = await supabase
    .from("entries")
    .delete()
    .eq("created_by", user.id)
    .eq("board_name", "community");

  if (listingsError) {
    return {
      success: false,
      message: "Could not remove your listings. Please try again.",
    };
  }

  const { data: avatarFiles } = await admin.storage
    .from("avatars")
    .list(user.id);

  if (avatarFiles?.length) {
    const paths = avatarFiles.map((file) => `${user.id}/${file.name}`);
    await admin.storage.from("avatars").remove(paths);
  }

  const { error: deleteUserError } = await admin.auth.admin.deleteUser(
    user.id,
  );

  if (deleteUserError) {
    return {
      success: false,
      message: "Could not delete your account. Please try again.",
    };
  }

  await supabase.auth.signOut();

  revalidatePath("/");
  redirect("/?account_deleted=1");
}
