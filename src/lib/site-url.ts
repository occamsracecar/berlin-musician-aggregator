/** Production custom domain for this deployment. */
export const PRODUCTION_CANONICAL_ORIGIN = "https://berlinbandhub.de";

/**
 * Returns the configured production site origin, with a hardcoded production fallback.
 */
export function getCanonicalSiteOrigin(): string | null {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (siteUrl) {
    return siteUrl.startsWith("http") ? siteUrl : `https://${siteUrl}`;
  }

  if (process.env.VERCEL_ENV === "production") {
    return PRODUCTION_CANONICAL_ORIGIN;
  }

  return null;
}

/**
 * Returns whether two hostnames refer to the same site (ignoring www).
 */
export function hostsMatchSiteDomain(
  requestHost: string,
  canonicalHost: string,
): boolean {
  const normalize = (host: string) => host.replace(/^www\./, "");
  return normalize(requestHost) === normalize(canonicalHost);
}

/**
 * Returns whether an incoming host should redirect to the canonical production domain.
 * Only Vercel deployment URLs are redirected — never www ↔ apex (Vercel handles that).
 */
export function shouldRedirectToCanonicalHost(
  requestHost: string,
  canonicalOrigin: string,
): boolean {
  if (requestHost === "localhost" || requestHost.startsWith("127.0.0.1")) {
    return false;
  }

  const canonicalHost = new URL(canonicalOrigin).hostname;

  if (hostsMatchSiteDomain(requestHost, canonicalHost)) {
    return false;
  }

  return requestHost.endsWith(".vercel.app");
}

/**
 * Builds the redirect target on the canonical domain, fixing OAuth codes on `/`.
 */
export function buildCanonicalRedirectUrl(
  requestUrl: URL,
  canonicalOrigin: string,
): URL {
  const redirectUrl = new URL(
    `${requestUrl.pathname}${requestUrl.search}`,
    canonicalOrigin,
  );

  if (redirectUrl.pathname === "/" && redirectUrl.searchParams.has("code")) {
    redirectUrl.pathname = "/auth/callback";

    if (!redirectUrl.searchParams.has("next")) {
      redirectUrl.searchParams.set("next", "/");
    }
  }

  return redirectUrl;
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
 * Returns the origin to use for auth redirects (prefers canonical domain in production).
 */
export function getAuthRedirectOrigin(requestOrigin: string): string {
  const canonical = getCanonicalSiteOrigin();

  if (!canonical || process.env.VERCEL_ENV !== "production") {
    return requestOrigin;
  }

  const canonicalHost = new URL(canonical).hostname;
  const requestHost = new URL(requestOrigin).hostname;

  if (hostsMatchSiteDomain(requestHost, canonicalHost)) {
    return requestOrigin;
  }

  return canonical;
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
