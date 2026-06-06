"use client";

import { useEffect, useState } from "react";
import { ListingDetailDialog } from "@/components/ListingDetailDialog";
import type { EntryWithAuthor } from "@/lib/profiles";

type ListingDeepLinkProps = {
  entries: EntryWithAuthor[];
  listingId: string | null;
  isSignedIn: boolean;
};

/**
 * Opens the listing detail dialog when the browse URL includes ?listing=id.
 */
export function ListingDeepLink({
  entries,
  listingId,
  isSignedIn,
}: ListingDeepLinkProps) {
  const [open, setOpen] = useState(false);
  const entry = listingId
    ? entries.find((item) => item.id === listingId)
    : undefined;

  useEffect(() => {
    if (entry) {
      setOpen(true);
    }
  }, [entry]);

  if (!entry) {
    return null;
  }

  return (
    <ListingDetailDialog
      entry={entry}
      open={open}
      onClose={() => setOpen(false)}
      isSignedIn={isSignedIn}
    />
  );
}
