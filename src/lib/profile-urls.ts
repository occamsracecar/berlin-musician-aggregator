import {
  PROFILE_SOCIAL_FIELDS,
  type ProfileSocialField,
} from "@/types/profile";

const SOCIAL_HOSTS: Record<ProfileSocialField, RegExp[]> = {
  soundcloud_url: [/soundcloud\.com/i],
  youtube_url: [/youtube\.com/i, /youtu\.be/i],
  bandcamp_url: [/bandcamp\.com/i],
  spotify_url: [/open\.spotify\.com/i, /spotify\.com/i],
};

/**
 * Normalizes an optional URL string (empty becomes null).
 */
export function normalizeOptionalUrl(raw: string): string | null {
  const trimmed = raw.trim();

  if (!trimmed) {
    return null;
  }

  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    const url = new URL(withProtocol);
    return url.toString();
  } catch {
    return null;
  }
}

/**
 * Validates that a URL matches the expected host for a music platform field.
 */
export function validateSocialUrl(
  field: ProfileSocialField,
  raw: string,
): string | null {
  const normalized = normalizeOptionalUrl(raw);

  if (!normalized) {
    return raw.trim() ? null : null;
  }

  const hostOk = SOCIAL_HOSTS[field].some((pattern) =>
    pattern.test(normalized),
  );

  return hostOk ? normalized : null;
}

/**
 * Returns whether a profile has at least one social link set.
 */
export function hasSocialLinks(
  profile: Partial<
    Record<ProfileSocialField | "avatar_url", string | null | undefined>
  >,
): boolean {
  return PROFILE_SOCIAL_FIELDS.some((field) => {
    const value = profile[field];
    return typeof value === "string" && value.trim().length > 0;
  });
}
