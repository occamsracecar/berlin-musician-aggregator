"use server";

import {
  sendListingMessageConfirmationEmail,
  sendListingMessageEmail,
} from "@/lib/email";
import { canReceiveListingMessages } from "@/lib/listings";
import { getListingBrowseUrl } from "@/lib/site-url";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type SendListingMessageState = {
  success: boolean;
  message: string;
};

const MAX_MESSAGE_LENGTH = 2000;

/**
 * Stores a message and emails the community listing owner (sender must be signed in).
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

  if (entryError || !entry || !canReceiveListingMessages(entry)) {
    return {
      success: false,
      message: "Only community listings posted here can receive messages.",
    };
  }

  if (entry.created_by === user.id) {
    return {
      success: false,
      message: "You cannot message your own listing.",
    };
  }

  const { data: ownerProfile, error: ownerProfileError } = await supabase
    .from("profiles")
    .select("display_name, contact_email")
    .eq("id", entry.created_by!)
    .maybeSingle();

  const ownerEmail = ownerProfile?.contact_email?.trim() || null;

  if (ownerProfileError || !ownerEmail) {
    return {
      success: false,
      message:
        "This listing author has no contact email on their profile yet. They can add one under Profile → Contact email.",
    };
  }

  const { data: inserted, error: insertError } = await supabase
    .from("listing_messages")
    .insert({
      entry_id: entryId,
      sender_id: user.id,
      body,
    })
    .select("id")
    .single();

  if (insertError || !inserted) {
    return {
      success: false,
      message: "Could not send your message. Please try again.",
    };
  }

  const { data: senderProfile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .maybeSingle();

  const listingUrl = getListingBrowseUrl(entry.id);

  const emailResult = await sendListingMessageEmail({
    to: ownerEmail,
    listingTitle: entry.title,
    senderLabel: senderProfile?.display_name ?? user.email,
    senderEmail: user.email,
    messageBody: body,
    listingUrl,
  });

  if (!emailResult.ok) {
    await supabase.from("listing_messages").delete().eq("id", inserted.id);

    return {
      success: false,
      message: emailResult.error,
    };
  }

  await sendListingMessageConfirmationEmail({
    to: user.email,
    listingTitle: entry.title,
    messageBody: body,
  });

  return {
    success: true,
    message:
      "Your message was sent. The listing author will receive it by email and can reply to you directly.",
  };
}
