import type { MetadataRoute } from "next";
import { getSiteOrigin } from "@/lib/site-url";

type SitemapChangeFrequency = NonNullable<
  MetadataRoute.Sitemap[number]["changeFrequency"]
>;

/**
 * Returns static public routes included in the sitemap.
 */
export function getStaticSitemapEntries(): MetadataRoute.Sitemap {
  const origin = getSiteOrigin();
  const now = new Date();

  return [
    {
      url: origin,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${origin}/impressum`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${origin}/datenschutz`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${origin}/nutzungsbedingungen`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];
}

/**
 * Builds sitemap entries for listing deep-link URLs (`/?listing=`).
 */
export function buildListingSitemapEntries(
  listings: Array<{ id: string; published_at: string | null }>,
  origin: string,
): MetadataRoute.Sitemap {
  return listings.map((listing) => ({
    url: `${origin}/?listing=${encodeURIComponent(listing.id)}`,
    lastModified: listing.published_at
      ? new Date(listing.published_at)
      : new Date(),
    changeFrequency: "weekly" as SitemapChangeFrequency,
    priority: 0.6,
  }));
}

/**
 * Returns the full sitemap: static pages plus listing deep links from Supabase.
 */
export async function getSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  const origin = getSiteOrigin();
  const staticEntries = getStaticSitemapEntries();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return staticEntries;
  }

  const { createSupabaseClient } = await import("@/lib/supabase/client");
  const supabase = createSupabaseClient();

  const { data: listings } = await supabase
    .from("entries")
    .select("id, published_at")
    .order("published_at", { ascending: false })
    .limit(10000);

  if (!listings?.length) {
    return staticEntries;
  }

  return [
    ...staticEntries,
    ...buildListingSitemapEntries(listings, origin),
  ];
}
