"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  deleteListing,
  type DeleteListingState,
} from "@/app/actions/delete-listing";
import {
  updateListing,
  type UpdateListingState,
} from "@/app/actions/update-listing";
import { ListingFormFields } from "@/components/ListingFormFields";
import { getListingTypeLabel } from "@/lib/constants";
import type { Entry } from "@/types/entry";

const initialUpdateState: UpdateListingState = {
  success: false,
  message: "",
};

const initialDeleteState: DeleteListingState = {
  success: false,
  message: "",
};

type UserListingEditorProps = {
  entry: Entry;
};

/**
 * Displays one of the user's listings with an expandable edit form.
 */
export function UserListingEditor({ entry }: UserListingEditorProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [updateState, updateAction, isUpdatePending] = useActionState(
    updateListing,
    initialUpdateState,
  );
  const [deleteState, deleteAction, isDeletePending] = useActionState(
    deleteListing,
    initialDeleteState,
  );

  useEffect(() => {
    if (updateState.success) {
      setEditing(false);
      router.refresh();
    }
  }, [updateState.success, router]);

  useEffect(() => {
    if (deleteState.success) {
      setConfirmDelete(false);
      router.refresh();
    }
  }, [deleteState.success, router]);

  const publishedDate = entry.published_at
    ? new Date(entry.published_at).toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "Unknown date";

  const listingTypeLabel = getListingTypeLabel(entry.listing_type);

  return (
    <li className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      {editing ? (
        <form action={updateAction} className="flex flex-col gap-4">
          <input type="hidden" name="entry_id" value={entry.id} />
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-zinc-900">Edit listing</h3>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="text-sm font-medium text-zinc-500 hover:text-zinc-800"
            >
              Cancel
            </button>
          </div>
          <ListingFormFields entry={entry} />
          {updateState.message ? (
            <p
              className={`rounded-lg px-4 py-3 text-sm ${
                updateState.success
                  ? "bg-green-50 text-green-800"
                  : "bg-red-50 text-red-800"
              }`}
            >
              {updateState.message}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={isUpdatePending}
              className="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700 disabled:opacity-60"
            >
              {isUpdatePending ? "Saving..." : "Save changes"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded-lg border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : confirmDelete ? (
        <form action={deleteAction} className="flex flex-col gap-3">
          <input type="hidden" name="entry_id" value={entry.id} />
          <p className="text-sm text-zinc-700">
            Delete <span className="font-medium">{entry.title}</span>? This cannot
            be undone.
          </p>
          {deleteState.message && !deleteState.success ? (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">
              {deleteState.message}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={isDeletePending}
              className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-60"
            >
              {isDeletePending ? "Deleting..." : "Yes, delete"}
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="rounded-lg border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
              <time dateTime={entry.published_at ?? undefined}>
                {publishedDate}
              </time>
              {listingTypeLabel ? (
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 font-medium text-zinc-700">
                  {listingTypeLabel}
                </span>
              ) : null}
            </div>
            <h3 className="font-semibold text-zinc-900">{entry.title}</h3>
            {entry.description ? (
              <p className="mt-2 line-clamp-3 text-sm text-zinc-600">
                {entry.description}
              </p>
            ) : null}
            {entry.genres?.length ? (
              <div className="mt-2 flex flex-wrap gap-1">
                {entry.genres.map((genre) => (
                  <span
                    key={genre}
                    className="rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-800"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setConfirmDelete(false);
                setEditing(true);
              }}
              className="rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:border-violet-200 hover:text-violet-700"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setConfirmDelete(true);
              }}
              className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </li>
  );
}
