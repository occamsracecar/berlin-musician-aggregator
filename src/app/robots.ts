import { getSiteOrigin } from "@/lib/site-url";
import type { MetadataRoute } from "next";

/**
 * Robots.txt rules for crawlers and the sitemap location.
 */
export default function robots(): MetadataRoute.Robots {
  const origin = getSiteOrigin();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/profile", "/login", "/auth/", "/submit"],
    },
    sitemap: `${origin}/sitemap.xml`,
  };
}
