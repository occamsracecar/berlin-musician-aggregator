import Image from "next/image";
import { ProfileSocialIcons } from "@/components/ProfileSocialIcons";
import type { Profile } from "@/types/profile";

/**
 * Shows listing author avatar and social links when available.
 */
export function ProfileAuthorStrip({
  profile,
}: {
  profile: Profile | null | undefined;
}) {
  if (!profile) {
    return null;
  }

  const hasAvatar = Boolean(profile.avatar_url);
  const hasSocial = Boolean(
    profile.soundcloud_url ||
      profile.youtube_url ||
      profile.bandcamp_url ||
      profile.spotify_url,
  );

  if (!hasAvatar && !hasSocial) {
    return null;
  }

  return (
    <div className="mb-3 flex items-center gap-3 border-t border-zinc-100 pt-3">
      {hasAvatar && profile.avatar_url ? (
        <Image
          src={profile.avatar_url}
          alt=""
          width={40}
          height={40}
          className="size-10 shrink-0 rounded-full border border-zinc-200 object-cover"
        />
      ) : null}
      <div className="min-w-0 flex-1">
        {profile.display_name ? (
          <p className="truncate text-xs font-medium text-zinc-700">
            {profile.display_name}
          </p>
        ) : null}
        <ProfileSocialIcons profile={profile} />
      </div>
    </div>
  );
}
