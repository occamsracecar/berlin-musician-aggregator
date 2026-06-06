/**
 * Returns the public site origin for links in emails and redirects.
 */
export function getSiteOrigin(): string {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.VERCEL_URL ??
    "http://localhost:3000";

  return siteUrl.startsWith("http") ? siteUrl : `https://${siteUrl}`;
}

/**
 * Builds a browse URL that opens a specific listing detail view.
 */
export function getListingBrowseUrl(entryId: string): string {
  return `${getSiteOrigin()}/?listing=${encodeURIComponent(entryId)}`;
}
