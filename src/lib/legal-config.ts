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

/** Natural-person operator shown on Impressum and Datenschutz (no postal address). */
export const LEGAL_OPERATOR_NAME = "Stefan Secker";

/** Default public inbox for legal and privacy requests. */
export const LEGAL_CONTACT_EMAIL = "contact@stefansecker.com";

/** Month shown as the Datenschutz “Stand” line. */
export const LEGAL_PRIVACY_STAND = "August 2026";

/**
 * Returns the public legal contact email.
 * Optional LEGAL_CONTACT_EMAIL env overrides the default without a redeploy of copy.
 */
export function getLegalContactEmail(): string {
  return process.env.LEGAL_CONTACT_EMAIL?.trim() || LEGAL_CONTACT_EMAIL;
}

/**
 * Returns the current calendar year for copyright notices.
 */
export function getCopyrightYear(): number {
  return new Date().getFullYear();
}
