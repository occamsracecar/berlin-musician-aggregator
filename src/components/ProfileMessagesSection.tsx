import type { Entry } from "@/types/entry";

export type ProfileListingMessage = {
  id: string;
  body: string;
  created_at: string;
  entry_id: string;
  entry_title: string;
  sender_label: string;
};

type ProfileMessagesSectionProps = {
  messages: ProfileListingMessage[];
};

/**
 * Lists email messages received on the signed-in user's community listings.
 */
export function ProfileMessagesSection({ messages }: ProfileMessagesSectionProps) {
  if (messages.length === 0) {
    return (
      <section className="mt-8 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900">Messages</h2>
        <p className="mt-2 text-sm text-zinc-600">
          When someone emails you through a community listing, a copy appears
          here. Replies go to your contact email inbox.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-8 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-zinc-900">Messages</h2>
      <p className="mt-2 text-sm text-zinc-600">
        Sent via your community listings. Reply from the email notification to
        reach the sender.
      </p>

      <ul className="mt-4 flex flex-col gap-3">
        {messages.map((message) => (
          <li
            key={message.id}
            className="rounded-lg border border-zinc-100 bg-zinc-50 p-4"
          >
            <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
              <time dateTime={message.created_at}>
                {new Date(message.created_at).toLocaleString("de-DE", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </time>
              <span className="font-medium text-zinc-700">
                {message.sender_label}
              </span>
            </div>
            <p className="mt-1 text-sm font-medium text-violet-700">
              Re: {message.entry_title}
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-700">
              {message.body}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * Joins listing messages with entry titles and sender display names.
 */
export function buildProfileListingMessages(
  messages: {
    id: string;
    body: string;
    created_at: string;
    entry_id: string;
    sender_id: string;
  }[],
  listings: Pick<Entry, "id" | "title">[],
  senderNamesById: Map<string, string>,
): ProfileListingMessage[] {
  const titleByEntryId = new Map(listings.map((listing) => [listing.id, listing.title]));

  return messages.map((message) => ({
    id: message.id,
    body: message.body,
    created_at: message.created_at,
    entry_id: message.entry_id,
    entry_title: titleByEntryId.get(message.entry_id) ?? "Your listing",
    sender_label: senderNamesById.get(message.sender_id) ?? "Someone",
  }));
}
