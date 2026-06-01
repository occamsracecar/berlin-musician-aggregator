"use client";

import { useEffect, useId, useRef } from "react";
import { BoardTag } from "@/components/BoardTag";
import { ListingContactActions } from "@/components/ListingContactActions";
import { ListingNewBadge } from "@/components/ListingNewBadge";
import { ProfileAuthorStrip } from "@/components/ProfileAuthorStrip";
import { getListingTypeLabel, isRecentListing } from "@/lib/constants";
import type { EntryWithAuthor } from "@/lib/profiles";

type ListingDetailDialogProps = {
  entry: EntryWithAuthor;
  open: boolean;
  onClose: () => void;
  isSignedIn: boolean;
};

/**
 * Modal overlay showing the full listing text and metadata.
 */
export function ListingDetailDialog({
  entry,
  open,
  onClose,
  isSignedIn,
}: ListingDetailDialogProps) {
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

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
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
      role="presentation"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-zinc-900/50 backdrop-blur-[2px]" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 flex max-h-[min(90vh,48rem)] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-zinc-100 px-5 py-4 sm:px-6">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
              <BoardTag boardName={entry.board_name} />
              {listingTypeLabel ? (
                <span className="rounded-full bg-zinc-100 px-2.5 py-1 font-medium text-zinc-700">
                  {listingTypeLabel}
                </span>
              ) : null}
              {isNew ? <ListingNewBadge /> : null}
              <time dateTime={entry.published_at ?? undefined}>
                {publishedDate}
              </time>
            </div>
            <h2
              id={titleId}
              className="text-xl font-semibold text-zinc-900 sm:text-2xl"
            >
              {entry.title}
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800"
            aria-label="Close details"
          >
            <span aria-hidden="true" className="text-xl leading-none">
              ×
            </span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-6">
          {entry.genres?.length ? (
            <div className="mb-4 flex flex-wrap gap-1.5">
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
            <div className="whitespace-pre-wrap text-sm leading-7 text-zinc-700">
              {entry.description}
            </div>
          ) : (
            <p className="text-sm text-zinc-500">No description available.</p>
          )}

          <div className="mt-4 px-5 sm:px-6">
            <ProfileAuthorStrip profile={entry.author_profile} />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 px-5 py-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <ListingContactActions entry={entry} isSignedIn={isSignedIn} />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
