"use server";

import { revalidatePath } from "next/cache";
import { parseContactEmail } from "@/lib/profile-email";
import {
  normalizeOptionalUrl,
  validateSocialUrl,
} from "@/lib/profile-urls";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PROFILE_SOCIAL_FIELDS } from "@/types/profile";

export type UpdateProfileState = {
  success: boolean;
  message: string;
};

const MAX_DISPLAY_NAME = 80;

/**
 * Updates the signed-in user's profile display name and social URLs.
 */
export async function updateProfile(
  _prevState: UpdateProfileState,
  formData: FormData,
): Promise<UpdateProfileState> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Sign in to edit your profile." };
  }

  const displayName = String(formData.get("display_name") ?? "").trim();
  const contactEmailRaw = String(formData.get("contact_email") ?? "");
  const avatarUrl = String(formData.get("avatar_url") ?? "").trim();

  const contactEmailParsed = parseContactEmail(contactEmailRaw);

  if (!contactEmailParsed.ok) {
    return { success: false, message: contactEmailParsed.message };
  }

  if (displayName.length > MAX_DISPLAY_NAME) {
    return {
      success: false,
      message: `Display name must be ${MAX_DISPLAY_NAME} characters or fewer.`,
    };
  }

  const socialUpdates: Record<string, string | null> = {};

  for (const field of PROFILE_SOCIAL_FIELDS) {
    const raw = String(formData.get(field) ?? "");
    const validated = validateSocialUrl(field, raw);

    if (raw.trim() && !validated) {
      const label = field.replace("_url", "").replace("_", " ");
      return {
        success: false,
        message: `Please enter a valid ${label} URL.`,
      };
    }

    socialUpdates[field] = validated;
  }

  const normalizedAvatar = avatarUrl
    ? normalizeOptionalUrl(avatarUrl)
    : null;

  if (avatarUrl && !normalizedAvatar) {
    return { success: false, message: "Avatar URL is invalid." };
  }

  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    display_name: displayName || null,
    contact_email: contactEmailParsed.value,
    avatar_url: normalizedAvatar,
    ...socialUpdates,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    return {
      success: false,
      message: "Could not save your profile. Please try again.",
    };
  }

  revalidatePath("/profile");
  revalidatePath("/");

  return { success: true, message: "Profile saved." };
}
