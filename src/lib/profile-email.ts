const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Normalizes and validates an optional contact email for message notifications.
 */
export function parseContactEmail(
  raw: string,
): { ok: true; value: string | null } | { ok: false; message: string } {
  const trimmed = raw.trim();

  if (!trimmed) {
    return { ok: true, value: null };
  }

  if (trimmed.length > 254 || !EMAIL_PATTERN.test(trimmed)) {
    return { ok: false, message: "Bitte gib eine gültige Kontakt-E-Mail-Adresse ein." };
  }

  return { ok: true, value: trimmed.toLowerCase() };
}
