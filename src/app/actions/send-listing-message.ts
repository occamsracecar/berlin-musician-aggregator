"use server";

import { sendListingMessageEmail } from "@/lib/email";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type SendListingMessageState = {
  success: boolean;
  message: string;
};

const MAX_MESSAGE_LENGTH = 2000;

/**
 * Stores a message and emails the listing owner (sender must be signed in).
 */
export async function sendListingMessage(
  _prevState: SendListingMessageState,
  formData: FormData,
): Promise<SendListingMessageState> {
  const entryId = String(formData.get("entry_id") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();

  if (!entryId) {
    return { success: false, message: "Listing not found." };
  }

  if (!body || body.length > MAX_MESSAGE_LENGTH) {
    return {
      success: false,
      message: `Please enter a message up to ${MAX_MESSAGE_LENGTH} characters.`,
    };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return {
      success: false,
      message: "Sign in to send a message to the listing author.",
    };
  }

  const { data: entry, error: entryError } = await supabase
    .from("entries")
    .select("id, title, created_by, board_name")
    .eq("id", entryId)
    .maybeSingle();

  if (entryError || !entry?.created_by) {
    return {
      success: false,
      message: "This listing cannot receive messages.",
    };
  }

  if (entry.created_by === user.id) {
    return {
      success: false,
      message: "You cannot message your own listing.",
    };
  }

  const { error: insertError } = await supabase.from("listing_messages").insert({
    entry_id: entryId,
    sender_id: user.id,
    body,
  });

  if (insertError) {
    return {
      success: false,
      message: "Could not send your message. Please try again.",
    };
  }

  const admin = createSupabaseAdminClient();
  const { data: ownerAuth, error: ownerError } =
    await admin.auth.admin.getUserById(entry.created_by);

  if (ownerError || !ownerAuth.user?.email) {
    return {
      success: false,
      message: "Message saved but the owner email could not be found.",
    };
  }

  const { data: senderProfile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .maybeSingle();

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.VERCEL_URL ??
    "http://localhost:3000";
  const origin = siteUrl.startsWith("http") ? siteUrl : `https://${siteUrl}`;
  const listingUrl = `${origin}/?q=${encodeURIComponent(entry.title)}`;

  const emailResult = await sendListingMessageEmail({
    to: ownerAuth.user.email,
    listingTitle: entry.title,
    senderLabel: senderProfile?.display_name ?? user.email,
    senderEmail: user.email,
    messageBody: body,
    listingUrl,
  });

  if (!emailResult.ok) {
    return {
      success: false,
      message: emailResult.error,
    };
  }

  return {
    success: true,
    message: "Your message was sent. The listing author will receive it by email.",
  };
}
