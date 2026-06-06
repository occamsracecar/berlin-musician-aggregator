import { getSitemapEntries } from "@/lib/sitemap-urls";
import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

/**
 * XML sitemap for Google Search Console and other crawlers.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return getSitemapEntries();
}
