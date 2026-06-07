import { getSitemapEntries } from "@/lib/sitemap-urls";
import type { MetadataRoute } from "next";

export const revalidate = 3600;

/**
 * XML sitemap for Google Search Console and other crawlers.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return getSitemapEntries();
}
