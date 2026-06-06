export type Profile = {
  id: string;
  display_name: string | null;
  contact_email: string | null;
  avatar_url: string | null;
  soundcloud_url: string | null;
  youtube_url: string | null;
  bandcamp_url: string | null;
  spotify_url: string | null;
};

export const PROFILE_SOCIAL_FIELDS = [
  "soundcloud_url",
  "youtube_url",
  "bandcamp_url",
  "spotify_url",
] as const;

export type ProfileSocialField = (typeof PROFILE_SOCIAL_FIELDS)[number];
