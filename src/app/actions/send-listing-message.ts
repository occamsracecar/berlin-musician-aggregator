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
    return { success: false, message: "Inserat nicht gefunden." };
  }

  if (!body || body.length > MAX_MESSAGE_LENGTH) {
    return {
      success: false,
      message: `Bitte gib eine Nachricht mit maximal ${MAX_MESSAGE_LENGTH} Zeichen ein.`,
    };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return {
      success: false,
      message: "Melde dich an, um dem Inserat-Autor eine Nachricht zu senden.",
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
      message:
        "Nur Community-Inserate auf dieser Plattform können Nachrichten empfangen.",
    };
  }

  if (entry.created_by === user.id) {
    return {
      success: false,
      message: "Du kannst dein eigenes Inserat nicht kontaktieren.",
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
        "Der Autor dieses Inserats hat noch keine Kontakt-E-Mail im Profil hinterlegt. Er kann sie unter Profil → Kontakt-E-Mail hinzufügen.",
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
      message: "Nachricht konnte nicht gesendet werden. Bitte versuche es erneut.",
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
      "Deine Nachricht wurde gesendet. Der Inserat-Autor erhält sie per E-Mail und kann dir direkt antworten.",
  };
}
