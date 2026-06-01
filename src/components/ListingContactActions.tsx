"use client";

import { useState } from "react";
import { ContactListingDialog } from "@/components/ContactListingDialog";
import { isUserSubmittedListing } from "@/lib/listings";
import type { Entry } from "@/types/entry";

type ListingContactActionsProps = {
  entry: Entry;
  isSignedIn: boolean;
};

/**
 * Outbound links and in-app message button for a listing card or detail view.
 */
export function ListingContactActions({
  entry,
  isSignedIn,
}: ListingContactActionsProps) {
  const [contactOpen, setContactOpen] = useState(false);
  const isAppListing = isUserSubmittedListing(entry);
  const isCommunityListing = entry.board_name === "community";
  const outboundUrl = isCommunityListing ? entry.contact_url : entry.original_url;

  return (
    <>
      {isAppListing ? (
        <button
          type="button"
          onClick={() => setContactOpen(true)}
          className="font-medium text-violet-600 hover:text-violet-800"
        >
          Send message
        </button>
      ) : null}

      {outboundUrl ? (
        <a
          href={outboundUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-violet-600 hover:text-violet-800"
        >
          {isCommunityListing ? "Contact link →" : "View original listing →"}
        </a>
      ) : isCommunityListing && !isAppListing ? (
        <span className="text-zinc-500">Community listing</span>
      ) : null}

      {isAppListing ? (
        <ContactListingDialog
          entry={entry}
          open={contactOpen}
          onClose={() => setContactOpen(false)}
          isSignedIn={isSignedIn}
        />
      ) : null}
    </>
  );
}
