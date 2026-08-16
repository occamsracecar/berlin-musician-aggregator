import { SITE_NAME } from "@/lib/site-branding";

/** Footer and legal page link definitions. */
export const LEGAL_PAGE_LINKS = [
  { href: "/faq", label: "FAQ" },
  { href: "/impressum", label: "Impressum" },
  { href: "/datenschutz", label: "Datenschutz" },
  { href: "/nutzungsbedingungen", label: "Nutzungsbedingungen" },
] as const;

/** Public site / service name used on legal pages. */
export const LEGAL_SERVICE_NAME = SITE_NAME;

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
