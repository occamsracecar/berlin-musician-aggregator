/**
 * Returns the configured production site origin, or null if unset.
 */
export function getCanonicalSiteOrigin(): string | null {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!siteUrl) {
    return null;
  }

  return siteUrl.startsWith("http") ? siteUrl : `https://${siteUrl}`;
}

/**
 * Returns whether an incoming host should redirect to the canonical production domain.
 */
export function shouldRedirectToCanonicalHost(
  requestHost: string,
  canonicalOrigin: string,
): boolean {
  if (requestHost === "localhost" || requestHost.startsWith("127.0.0.1")) {
    return false;
  }

  const canonicalHost = new URL(canonicalOrigin).hostname;
  return requestHost !== canonicalHost;
}

/**
 * Returns the public site origin for links in emails and redirects.
 */
export function getSiteOrigin(): string {
  const canonical = getCanonicalSiteOrigin();

  if (canonical) {
    return canonical;
  }

  const vercelUrl = process.env.VERCEL_URL;

  if (vercelUrl) {
    return vercelUrl.startsWith("http") ? vercelUrl : `https://${vercelUrl}`;
  }

  return "http://localhost:3000";
}

/**
 * Builds a browse URL that opens a specific listing detail view.
 */
export function getListingBrowseUrl(entryId: string): string {
  return `${getSiteOrigin()}/?listing=${encodeURIComponent(entryId)}`;
}

/**
 * Builds a redirect URL when Supabase sends OAuth codes to `/` instead of `/auth/callback`.
 */
export function buildOAuthCallbackRecoveryUrl(requestUrl: URL): URL | null {
  if (requestUrl.pathname !== "/" || !requestUrl.searchParams.has("code")) {
    return null;
  }

  const callbackUrl = new URL(requestUrl.toString());
  callbackUrl.pathname = "/auth/callback";

  if (!callbackUrl.searchParams.has("next")) {
    callbackUrl.searchParams.set("next", "/");
  }

  return callbackUrl;
}
