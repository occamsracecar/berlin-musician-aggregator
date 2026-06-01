"use client";

import { useActionState } from "react";
import {
  submitListing,
  type SubmitListingState,
} from "@/app/actions/submit-listing";
import { ListingFormFields } from "@/components/ListingFormFields";

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

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <ListingFormFields showProfileHint />

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
