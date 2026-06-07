import { Resend } from "resend";
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
    "Berlin Musician Listings <onboarding@resend.dev>"
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
        "Email is not configured yet. Add RESEND_API_KEY and RESEND_FROM_EMAIL to the server environment.",
    };
  }

  return { ok: true, resend: new Resend(apiKey), from: getResendFromAddress() };
}

/** Site name shown in listing message emails. */
const LISTING_MESSAGE_SITE_NAME = "Berlin Musician Listings";

/**
 * Formats Reply-To so mail clients address replies to the listing sender.
 */
function formatListingMessageReplyTo(
  senderLabel: string,
  senderEmail: string,
): string {
  const name = (senderLabel.trim() || senderEmail.split("@")[0] || "Sender")
    .replaceAll('"', "")
    .slice(0, 80);

  return `"${name} via ${LISTING_MESSAGE_SITE_NAME}" <${senderEmail}>`;
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
<html lang="en">
  <body style="margin:0;padding:0;background:#fafafa;font-family:system-ui,-apple-system,sans-serif;color:#18181b;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fafafa;padding:24px 16px;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #e4e4e7;border-radius:12px;padding:24px;">
            <tr>
              <td style="padding-bottom:16px;">
                <img src="${logoUrl}" alt="Berlin Musicians" width="48" height="48" style="display:block;width:48px;height:48px;" />
              </td>
            </tr>
            ${bodyHtml}
            <tr>
              <td style="padding-top:24px;font-size:12px;line-height:1.5;color:#71717a;">
                Berlin Musician Listings · Community listings on ${escapeHtml(origin)}
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
    `${LISTING_MESSAGE_SITE_NAME} (${origin})`,
    "",
    `${params.senderLabel} (${params.senderEmail}) sent you a message about your listing "${params.listingTitle}":`,
    "",
    params.messageBody,
    "",
    `View your listing: ${params.listingUrl}`,
    "",
    `To respond, reply to this email or write directly to ${params.senderEmail}.`,
    "",
    `You received this because you posted a community listing on ${LISTING_MESSAGE_SITE_NAME}.`,
  ].join("\n");

  const html = buildEmailHtml(`
    <tr>
      <td style="font-size:18px;font-weight:700;padding-bottom:8px;">New message on ${LISTING_MESSAGE_SITE_NAME}</td>
    </tr>
    <tr>
      <td style="font-size:13px;line-height:1.6;color:#3f3f46;background:#f4f4f5;border:1px solid #e4e4e7;border-radius:8px;padding:12px 16px;margin-bottom:16px;">
        Someone contacted you through your listing on
        <a href="${safeOrigin}" style="color:#7c3aed;font-weight:600;text-decoration:none;">${safeOrigin}</a>.
        Reply goes to <strong>${safeSender}</strong> at
        <a href="mailto:${safeSenderEmail}" style="color:#7c3aed;">${safeSenderEmail}</a>.
      </td>
    </tr>
    <tr>
      <td style="font-size:14px;line-height:1.6;color:#3f3f46;padding:16px 0 8px;">
        <strong>${safeSender}</strong> wrote about <strong>${safeTitle}</strong>:
      </td>
    </tr>
    <tr>
      <td style="font-size:14px;line-height:1.7;color:#27272a;background:#fafafa;border:1px solid #e4e4e7;border-radius:8px;padding:16px;white-space:pre-wrap;">${safeBody}</td>
    </tr>
    <tr>
      <td style="padding-top:20px;">
        <a href="${escapeHtml(mailtoReplyHref)}" style="display:inline-block;background:#7c3aed;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:10px 16px;border-radius:8px;margin-right:8px;">Reply to ${safeSender}</a>
        <a href="${escapeHtml(params.listingUrl)}" style="display:inline-block;background:#ffffff;color:#7c3aed;text-decoration:none;font-size:14px;font-weight:600;padding:10px 16px;border-radius:8px;border:1px solid #7c3aed;">View listing</a>
      </td>
    </tr>
    <tr>
      <td style="padding-top:16px;font-size:13px;line-height:1.5;color:#52525b;">
        Use your email app&apos;s <strong>Reply</strong> button, or email
        <a href="mailto:${safeSenderEmail}" style="color:#7c3aed;">${safeSenderEmail}</a>
        directly.
      </td>
    </tr>
  `);

  const { error } = await client.resend.emails.send({
    from: client.from,
    to: params.to,
    replyTo,
    subject: `[${LISTING_MESSAGE_SITE_NAME}] Message from ${params.senderLabel} about "${params.listingTitle}"`,
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
    `Your message about "${params.listingTitle}" was sent to the listing author by email.`,
    "",
    "Your message:",
    params.messageBody,
    "",
    "If they reply, it will go to the email address on your account.",
  ].join("\n");

  const html = buildEmailHtml(`
    <tr>
      <td style="font-size:18px;font-weight:700;padding-bottom:8px;">Message sent</td>
    </tr>
    <tr>
      <td style="font-size:14px;line-height:1.6;color:#3f3f46;padding-bottom:16px;">
        Your message about <strong>${safeTitle}</strong> was emailed to the listing author.
      </td>
    </tr>
    <tr>
      <td style="font-size:14px;line-height:1.7;color:#27272a;background:#fafafa;border:1px solid #e4e4e7;border-radius:8px;padding:16px;">${safeBody}</td>
    </tr>
  `);

  const { error } = await client.resend.emails.send({
    from: client.from,
    to: params.to,
    subject: `Copy: your message about "${params.listingTitle}"`,
    text,
    html,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}
