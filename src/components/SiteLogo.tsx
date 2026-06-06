"use client";

import Image from "next/image";
import Link from "next/link";
import { SITE_LOGO_ALT, SITE_LOGO_SOURCES } from "@/lib/site-branding";

type SiteLogoProps = {
  /** Nav bar (compact) or auth card (larger). */
  size?: "nav" | "auth";
  /** When false, renders image only (e.g. inside a link wrapper). */
  linkToHome?: boolean;
  className?: string;
};

const SIZE_CLASS = {
  nav: "h-10 w-10 sm:h-11 sm:w-11",
  auth: "h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem]",
} as const;

/**
 * Site logo for the header and auth screens (guitar + Berlin tower mark).
 */
export function SiteLogo({
  size = "nav",
  linkToHome = true,
  className = "",
}: SiteLogoProps) {
  const sizeClass = SIZE_CLASS[size];

  const image = (
    <Image
      src={SITE_LOGO_SOURCES[0]}
      alt={SITE_LOGO_ALT}
      width={512}
      height={512}
      className={`${sizeClass} object-contain ${className}`.trim()}
      priority={size === "auth"}
    />
  );

  if (!linkToHome) {
    return image;
  }

  return (
    <Link
      href="/"
      className="shrink-0 rounded-lg outline-none ring-violet-500 focus-visible:ring-2"
      aria-label="Berlin Musicians home"
    >
      {image}
    </Link>
  );
}
