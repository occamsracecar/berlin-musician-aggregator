/** Footer and legal page link definitions. */
export const LEGAL_PAGE_LINKS = [
  { href: "/genres", label: "Genres" },
  { href: "/faq", label: "FAQ" },
  { href: "/impressum", label: "Impressum" },
  { href: "/datenschutz", label: "Privacy" },
  { href: "/nutzungsbedingungen", label: "Terms" },
] as const;

/** Public site / service name used on legal pages (no personal operator details). */
export const LEGAL_SERVICE_NAME = "Berlin Musician Listings";

/**
 * Optional contact email for legal enquiries (server env only).
 */
export function getLegalContactEmail(): string | null {
  return process.env.LEGAL_CONTACT_EMAIL?.trim() || null;
}

/**
 * Returns the current calendar year for copyright notices.
 */
export function getCopyrightYear(): number {
  return new Date().getFullYear();
}
