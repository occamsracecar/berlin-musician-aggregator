import type { Profile } from "@/types/profile";
import { hasSocialLinks } from "@/lib/profile-urls";

type SocialPlatform = "soundcloud" | "youtube" | "bandcamp" | "spotify";

const PLATFORMS: {
  key: keyof Pick<
    Profile,
    "soundcloud_url" | "youtube_url" | "bandcamp_url" | "spotify_url"
  >;
  platform: SocialPlatform;
  label: string;
  className: string;
}[] = [
  {
    key: "soundcloud_url",
    platform: "soundcloud",
    label: "SoundCloud",
    className: "bg-[#ff5500] text-white",
  },
  {
    key: "youtube_url",
    platform: "youtube",
    label: "YouTube",
    className: "bg-[#ff0000] text-white",
  },
  {
    key: "bandcamp_url",
    platform: "bandcamp",
    label: "Bandcamp",
    className: "bg-[#1da0c3] text-white",
  },
  {
    key: "spotify_url",
    platform: "spotify",
    label: "Spotify",
    className: "bg-[#1db954] text-white",
  },
];

/**
 * Renders platform logo links for a user profile on listing cards.
 */
export function ProfileSocialIcons({
  profile,
  size = "sm",
}: {
  profile: Profile | null | undefined;
  size?: "sm" | "md";
}) {
  if (!profile || !hasSocialLinks(profile)) {
    return null;
  }

  const iconSize = size === "md" ? "size-8" : "size-7";
  const svgSize = size === "md" ? 16 : 14;

  return (
    <div className="flex flex-wrap items-center gap-1.5" role="list">
      {PLATFORMS.map(({ key, platform, label, className }) => {
        const href = profile[key];

        if (!href) {
          return null;
        }

        return (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            role="listitem"
            aria-label={`${label} profile`}
            title={label}
            className={`inline-flex ${iconSize} items-center justify-center rounded-full ${className} transition hover:opacity-90`}
            onClick={(event) => event.stopPropagation()}
          >
            <PlatformIcon platform={platform} size={svgSize} />
          </a>
        );
      })}
    </div>
  );
}

/**
 * Inline SVG mark for a music platform.
 */
function PlatformIcon({
  platform,
  size,
}: {
  platform: SocialPlatform;
  size: number;
}) {
  switch (platform) {
    case "soundcloud":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M17.5 10.5c-.2 0-.4.2-.4.5v2.9c0 .3.2.5.4.5h1.1c.2 0 .4-.2.4-.5v-2.9c0-.3-.2-.5-.4-.5h-1.1zm-3.1 1.2c-.2 0-.4.2-.4.6v1.6c0 .3.2.6.4.6h1.1c.2 0 .4-.3.4-.6v-1.6c0-.4-.2-.6-.4-.6h-1.1zm-3.1 0c-.3 0-.5.3-.5.7v1.3c0 .4.2.7.5.7h1.1c.3 0 .5-.3.5-.7v-1.3c0-.4-.2-.7-.5-.7h-1.1zm-3.1 1.5c-.4 0-.7.4-.7 1v.5c0 .6.3 1 .7 1h1.1c.4 0 .7-.4.7-1v-.5c0-.6-.3-1-.7-1h-1.1zm-3.2 0c-.5 0-.9.5-.9 1.1v.3c0 .6.4 1.1.9 1.1h1.2c.5 0 .9-.5.9-1.1v-.3c0-.6-.4-1.1-.9-1.1H5zM20.5 9c-1.9 0-3.5 1.4-3.8 3.2-.1-.1-.3-.2-.5-.2-1 0-1.8.8-1.8 1.8 0 .2 0 .3.1.5H20.5c1.4 0 2.5-1.1 2.5-2.5S21.9 9 20.5 9z" />
        </svg>
      );
    case "youtube":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M21.6 7.2a2.7 2.7 0 0 0-1.9-1.9C18 5 12 5 12 5s-6 0-7.7.3a2.7 2.7 0 0 0-1.9 1.9C2 9 2 12 2 12s0 3 .4 4.8a2.7 2.7 0 0 0 1.9 1.9C6 19 12 19 12 19s6 0 7.7-.3a2.7 2.7 0 0 0 1.9-1.9C22 15 22 12 22 12s0-3-.4-4.8zM10 15.5v-7l6 3.5-6 3.5z" />
        </svg>
      );
    case "bandcamp":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M0 6.5v11L14.5 22V2L0 6.5zm16.5 0L24 8.2v7.6l-7.5 1.7V6.5z" />
        </svg>
      );
    case "spotify":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm4.3 14.4c-.2.3-.6.4-.9.2-2.4-1.5-5.5-1.8-9.1-1-.3.1-.7-.1-.8-.4s.1-.7.4-.8c4-.9 7.4-.5 10.1 1.1.3.2.4.6.3.9zm1.2-2.7c-.2.4-.7.5-1 .3-2.8-1.7-7-2.2-10.3-1.2-.4.1-.8-.2-.9-.6-.1-.4.2-.8.6-.9 3.8-1.1 8.4-.6 11.5 1.3.4.2.5.7.1 1.1zm.1-2.8c-3.3-2-8.8-2.2-12-1.2-.5.1-1-.3-1.1-.8-.1-.5.3-1 1-.1.1 3.6 3.7 9.6 1.2 13.3-.5.5-.2 1 .1 1.2.6.2.5-.1 1-.6 1.2z" />
        </svg>
      );
  }
}
