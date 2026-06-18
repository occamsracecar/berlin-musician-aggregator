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
      message: `Gib ${CONFIRM_PHRASE} ein, um die Kontolöschung zu bestätigen.`,
    };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Melde dich an, um dein Konto zu löschen." };
  }

  let admin;

  try {
    admin = createSupabaseAdminClient();
  } catch {
    return {
      success: false,
      message: "Kontolöschung ist nicht konfiguriert. Bitte wende dich an den Support.",
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
      message: "Deine Inserate konnten nicht entfernt werden. Bitte versuche es erneut.",
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
      message: "Konto konnte nicht gelöscht werden. Bitte versuche es erneut.",
    };
  }

  await supabase.auth.signOut();

  revalidatePath("/");
  redirect("/?account_deleted=1");
}
