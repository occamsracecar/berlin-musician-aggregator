"use client";

import { useActionState } from "react";
import {
  submitListing,
  type SubmitListingState,
} from "@/app/actions/submit-listing";
import { LISTING_TYPES } from "@/lib/constants";

const initialState: SubmitListingState = {
  success: false,
  message: "",
};

/**
 * Form for submitting a new community listing.
 */
export function SubmitListingForm() {
  const [state, formAction, isPending] = useActionState(
    submitListing,
    initialState,
  );

  const inputClassName =
    "w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none ring-violet-500 focus:ring-2";

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-zinc-700">Title</span>
        <input
          type="text"
          name="title"
          required
          maxLength={200}
          placeholder="e.g. Rock band looking for drummer"
          className={inputClassName}
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-zinc-700">Description</span>
        <textarea
          name="description"
          required
          rows={8}
          maxLength={5000}
          placeholder="Describe what you are looking for, your style, rehearsal area, experience level..."
          className={`${inputClassName} resize-y`}
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-zinc-700">Listing type</span>
        <select name="listing_type" required className={inputClassName} defaultValue="">
          <option value="" disabled>
            Select one
          </option>
          {LISTING_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-zinc-700">
          Contact link <span className="font-normal text-zinc-500">(optional)</span>
        </span>
        <input
          type="text"
          name="contact_url"
          maxLength={500}
          placeholder="https://..., mailto:you@example.com"
          className={inputClassName}
        />
      </label>

      {state.message ? (
        <p
          className={`rounded-lg px-4 py-3 text-sm ${
            state.success
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Publishing..." : "Publish listing"}
      </button>
    </form>
  );
}
