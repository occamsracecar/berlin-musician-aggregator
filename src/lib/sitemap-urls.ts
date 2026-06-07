import type { MetadataRoute } from "next";
import { getParentGenreSitemapPaths } from "@/lib/genre-pages";
import { getSiteOrigin } from "@/lib/site-url";

type SitemapChangeFrequency = NonNullable<
  MetadataRoute.Sitemap[number]["changeFrequency"]
>;

/**
 * Returns the sitemap: genre hub and all parent genre category pages.
 */
export function getSitemapEntries(): MetadataRoute.Sitemap {
  const origin = getSiteOrigin();
  const now = new Date();

  const hubEntry: MetadataRoute.Sitemap[number] = {
    url: `${origin}/genres`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
  };

  const genreEntries = getParentGenreSitemapPaths().map((path) => ({
    url: `${origin}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as SitemapChangeFrequency,
    priority: 0.8,
  }));

  return [hubEntry, ...genreEntries];
}
