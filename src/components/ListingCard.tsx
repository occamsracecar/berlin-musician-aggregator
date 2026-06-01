"use client";

import { useState } from "react";
import { BoardTag } from "@/components/BoardTag";
import { ListingDetailDialog } from "@/components/ListingDetailDialog";
import { ListingNewBadge } from "@/components/ListingNewBadge";
import { ListingContactActions } from "@/components/ListingContactActions";
import { ProfileAuthorStrip } from "@/components/ProfileAuthorStrip";
import { getListingTypeLabel, isRecentListing } from "@/lib/constants";
import type { EntryWithAuthor } from "@/lib/profiles";

type ListingCardProps = {
  entry: EntryWithAuthor;
  isSignedIn: boolean;
};

/**
 * Renders a single musician listing card with preview text and detail modal.
 */
export function ListingCard({ entry, isSignedIn }: ListingCardProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);

  const publishedDate = entry.published_at
    ? new Date(entry.published_at).toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "Unknown date";

  const listingTypeLabel = getListingTypeLabel(entry.listing_type);
  const isNew = isRecentListing(entry.published_at);

  return (
    <>
      <article className="flex h-full flex-col rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-violet-200 hover:shadow-md">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
          <BoardTag boardName={entry.board_name} />
          {listingTypeLabel ? (
            <span className="rounded-full bg-zinc-100 px-2.5 py-1 font-medium text-zinc-700">
              {listingTypeLabel}
            </span>
          ) : null}
          {isNew ? <ListingNewBadge /> : null}
          <time dateTime={entry.published_at ?? undefined}>{publishedDate}</time>
        </div>

        <h2 className="mb-2 line-clamp-2 text-lg font-semibold text-zinc-900">
          {entry.title}
        </h2>

        {entry.genres?.length ? (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {entry.genres.map((genre) => (
              <span
                key={genre}
                className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800"
              >
                {genre}
              </span>
            ))}
          </div>
        ) : null}

        {entry.description ? (
          <p className="mb-4 line-clamp-4 flex-1 text-sm leading-6 text-zinc-600">
            {entry.description}
          </p>
        ) : (
          <div className="flex-1" />
        )}

        <ProfileAuthorStrip profile={entry.author_profile} />

        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-2 text-sm">
          <button
            type="button"
            onClick={() => setDetailsOpen(true)}
            className="font-medium text-violet-600 hover:text-violet-800"
          >
            Details
          </button>
          <ListingContactActions entry={entry} isSignedIn={isSignedIn} />
        </div>
      </article>

      <ListingDetailDialog
        entry={entry}
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        isSignedIn={isSignedIn}
      />
    </>
  );
}
