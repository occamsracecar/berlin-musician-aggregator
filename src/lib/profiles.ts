import type { Entry } from "@/types/entry";
import type { Profile } from "@/types/profile";

export type EntryWithAuthor = Entry & {
  author_profile: Profile | null;
};

const PROFILE_COLUMNS =
  "id, display_name, avatar_url, soundcloud_url, youtube_url, bandcamp_url, spotify_url";

/**
 * Loads public profile rows for a set of user ids.
 */
export async function fetchProfilesByUserIds(
  supabase: { from: (table: string) => unknown },
  userIds: string[],
): Promise<Map<string, Profile>> {
  const uniqueIds = [...new Set(userIds.filter(Boolean))];

  if (!uniqueIds.length) {
    return new Map();
  }

  const client = supabase as {
    from: (
      table: string,
    ) => {
      select: (columns: string) => {
        in: (
          column: string,
          values: string[],
        ) => Promise<{ data: Profile[] | null; error: Error | null }>;
      };
    };
  };

  const { data, error } = await client
    .from("profiles")
    .select(PROFILE_COLUMNS)
    .in("id", uniqueIds);

  if (error || !data) {
    return new Map();
  }

  return new Map(data.map((profile) => [profile.id, profile]));
}

/**
 * Attaches author profiles to entries that have a created_by user id.
 */
export async function attachAuthorProfiles(
  supabase: { from: (table: string) => unknown },
  entries: Entry[],
): Promise<EntryWithAuthor[]> {
  const authorIds = entries
    .map((entry) => entry.created_by)
    .filter((id): id is string => Boolean(id));

  const profilesById = await fetchProfilesByUserIds(supabase, authorIds);

  return entries.map((entry) => ({
    ...entry,
    author_profile: entry.created_by
      ? (profilesById.get(entry.created_by) ?? null)
      : null,
  }));
}
