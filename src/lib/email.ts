import { Resend } from "resend";

type ListingMessageEmailParams = {
  to: string;
  listingTitle: string;
  senderLabel: string;
  senderEmail: string;
  messageBody: string;
  listingUrl: string;
};

/**
 * Sends a listing contact message to the listing owner's email via Resend.
 */
export async function sendListingMessageEmail(
  params: ListingMessageEmailParams,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return {
      ok: false,
      error: "Email delivery is not configured (RESEND_API_KEY).",
    };
  }

  const from =
    process.env.RESEND_FROM_EMAIL ?? "Berlin Musician Listings <onboarding@resend.dev>";
  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from,
    to: params.to,
    replyTo: params.senderEmail,
    subject: `Message about your listing: ${params.listingTitle}`,
    text: [
      `${params.senderLabel} (${params.senderEmail}) sent you a message about your listing "${params.listingTitle}":`,
      "",
      params.messageBody,
      "",
      `View your listing: ${params.listingUrl}`,
      "",
      "You received this because you posted on Berlin Musician Listings.",
    ].join("\n"),
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}
