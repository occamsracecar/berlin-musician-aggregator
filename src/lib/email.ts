import { Resend } from "resend";
import { SITE_NAME } from "@/lib/site-branding";
import { getSiteOrigin } from "@/lib/site-url";

type ListingMessageEmailParams = {
  to: string;
  listingTitle: string;
  senderLabel: string;
  senderEmail: string;
  messageBody: string;
  listingUrl: string;
};

type ListingMessageConfirmationParams = {
  to: string;
  listingTitle: string;
  messageBody: string;
};

/**
 * Returns whether Resend is configured for outbound email.
 */
export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

/**
 * Resolves the verified sender address for Resend.
 */
function getResendFromAddress(): string {
  return (
    process.env.RESEND_FROM_EMAIL?.trim() ??
    `${SITE_NAME} <onboarding@resend.dev>`
  );
}

/**
 * Creates a Resend client or returns a configuration error.
 */
function createResendClient():
  | { ok: true; resend: Resend; from: string }
  | { ok: false; error: string } {
  const apiKey = process.env.RESEND_API_KEY?.trim();

  if (!apiKey) {
    return {
      ok: false,
      error:
        "E-Mail ist noch nicht eingerichtet. Bitte RESEND_API_KEY und RESEND_FROM_EMAIL auf dem Server setzen.",
    };
  }

  return { ok: true, resend: new Resend(apiKey), from: getResendFromAddress() };
}

/**
 * Formats Reply-To so mail clients address replies to the listing sender.
 */
function formatListingMessageReplyTo(
  senderLabel: string,
  senderEmail: string,
): string {
  const name = (senderLabel.trim() || senderEmail.split("@")[0] || "Absender")
    .replaceAll('"', "")
    .slice(0, 80);

  return `"${name} über ${SITE_NAME}" <${senderEmail}>`;
}

/**
 * Escapes HTML for plain-text-derived email bodies.
 */
function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/**
 * Builds shared HTML wrapper for listing message emails.
 */
function buildEmailHtml(bodyHtml: string): string {
  const origin = getSiteOrigin();
  const logoUrl = `${origin}/logo.png`;

  return `<!DOCTYPE html>
<html lang="de">
  <body style="margin:0;padding:0;background:#fafafa;font-family:system-ui,-apple-system,sans-serif;color:#18181b;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fafafa;padding:24px 16px;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #e4e4e7;border-radius:12px;padding:24px;">
            <tr>
              <td style="padding-bottom:16px;">
                <img src="${logoUrl}" alt="${escapeHtml(SITE_NAME)}" width="48" height="48" style="display:block;width:48px;height:48px;" />
              </td>
            </tr>
            ${bodyHtml}
            <tr>
              <td style="padding-top:24px;font-size:12px;line-height:1.5;color:#71717a;">
                ${escapeHtml(SITE_NAME)} · Community-Inserate auf ${escapeHtml(origin)}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/**
 * Sends a listing contact message to the listing owner's email via Resend.
 */
export async function sendListingMessageEmail(
  params: ListingMessageEmailParams,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const client = createResendClient();

  if (!client.ok) {
    return client;
  }

  const origin = getSiteOrigin();
  const safeBody = escapeHtml(params.messageBody).replaceAll("\n", "<br />");
  const safeTitle = escapeHtml(params.listingTitle);
  const safeSender = escapeHtml(params.senderLabel);
  const safeSenderEmail = escapeHtml(params.senderEmail);
  const safeOrigin = escapeHtml(origin);
  const replyTo = formatListingMessageReplyTo(
    params.senderLabel,
    params.senderEmail,
  );
  const mailtoReplyHref = `mailto:${encodeURIComponent(params.senderEmail)}?subject=${encodeURIComponent(`Re: ${params.listingTitle}`)}`;

  const text = [
    `${SITE_NAME} (${origin})`,
    "",
    `${params.senderLabel} (${params.senderEmail}) hat dir eine Nachricht zu deinem Inserat „${params.listingTitle}" geschickt:`,
    "",
    params.messageBody,
    "",
    `Inserat ansehen: ${params.listingUrl}`,
    "",
    `Zum Antworten antworte auf diese E-Mail oder schreibe direkt an ${params.senderEmail}.`,
    "",
    `Du erhältst diese E-Mail, weil du ein Community-Inserat auf ${SITE_NAME} veröffentlicht hast.`,
  ].join("\n");

  const html = buildEmailHtml(`
    <tr>
      <td style="font-size:18px;font-weight:700;padding-bottom:8px;">Neue Nachricht auf ${escapeHtml(SITE_NAME)}</td>
    </tr>
    <tr>
      <td style="font-size:13px;line-height:1.6;color:#3f3f46;background:#f4f4f5;border:1px solid #e4e4e7;border-radius:8px;padding:12px 16px;margin-bottom:16px;">
        Jemand hat dich über dein Inserat auf
        <a href="${safeOrigin}" style="color:#7c3aed;font-weight:600;text-decoration:none;">${safeOrigin}</a>
        kontaktiert. Antworten gehen an <strong>${safeSender}</strong> unter
        <a href="mailto:${safeSenderEmail}" style="color:#7c3aed;">${safeSenderEmail}</a>.
      </td>
    </tr>
    <tr>
      <td style="font-size:14px;line-height:1.6;color:#3f3f46;padding:16px 0 8px;">
        <strong>${safeSender}</strong> schreibt zu <strong>${safeTitle}</strong>:
      </td>
    </tr>
    <tr>
      <td style="font-size:14px;line-height:1.7;color:#27272a;background:#fafafa;border:1px solid #e4e4e7;border-radius:8px;padding:16px;white-space:pre-wrap;">${safeBody}</td>
    </tr>
    <tr>
      <td style="padding-top:20px;">
        <a href="${escapeHtml(mailtoReplyHref)}" style="display:inline-block;background:#7c3aed;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:10px 16px;border-radius:8px;margin-right:8px;">${safeSender} antworten</a>
        <a href="${escapeHtml(params.listingUrl)}" style="display:inline-block;background:#ffffff;color:#7c3aed;text-decoration:none;font-size:14px;font-weight:600;padding:10px 16px;border-radius:8px;border:1px solid #7c3aed;">Inserat ansehen</a>
      </td>
    </tr>
    <tr>
      <td style="padding-top:16px;font-size:13px;line-height:1.5;color:#52525b;">
        Nutze die <strong>Antworten</strong>-Funktion deines E-Mail-Programms oder schreibe direkt an
        <a href="mailto:${safeSenderEmail}" style="color:#7c3aed;">${safeSenderEmail}</a>.
      </td>
    </tr>
  `);

  const { error } = await client.resend.emails.send({
    from: client.from,
    to: params.to,
    replyTo,
    subject: `[${SITE_NAME}] Nachricht von ${params.senderLabel} zu „${params.listingTitle}"`,
    text,
    html,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}

/**
 * Sends the sender a copy of their community listing message.
 */
export async function sendListingMessageConfirmationEmail(
  params: ListingMessageConfirmationParams,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const client = createResendClient();

  if (!client.ok) {
    return client;
  }

  const safeBody = escapeHtml(params.messageBody).replaceAll("\n", "<br />");
  const safeTitle = escapeHtml(params.listingTitle);

  const text = [
    `Deine Nachricht zu „${params.listingTitle}" wurde per E-Mail an den Inserenten gesendet.`,
    "",
    "Deine Nachricht:",
    params.messageBody,
    "",
    "Bei einer Antwort landet die E-Mail auf der Adresse deines Kontos.",
  ].join("\n");

  const html = buildEmailHtml(`
    <tr>
      <td style="font-size:18px;font-weight:700;padding-bottom:8px;">Nachricht gesendet</td>
    </tr>
    <tr>
      <td style="font-size:14px;line-height:1.6;color:#3f3f46;padding-bottom:16px;">
        Deine Nachricht zu <strong>${safeTitle}</strong> wurde an den Inserenten geschickt.
      </td>
    </tr>
    <tr>
      <td style="font-size:14px;line-height:1.7;color:#27272a;background:#fafafa;border:1px solid #e4e4e7;border-radius:8px;padding:16px;">${safeBody}</td>
    </tr>
  `);

  const { error } = await client.resend.emails.send({
    from: client.from,
    to: params.to,
    subject: `Kopie: deine Nachricht zu „${params.listingTitle}"`,
    text,
    html,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}
