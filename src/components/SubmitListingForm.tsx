"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  submitListing,
  type SubmitListingState,
} from "@/app/actions/submit-listing";
import { LegalNoticeLinks } from "@/components/LegalNoticeLinks";
import { ListingFormFields } from "@/components/ListingFormFields";

const initialState: SubmitListingState = {
  success: false,
  message: "",
};

const SUBMIT_SIGN_IN_HREF = "/login?next=%2Fsubmit";
const SUBMIT_SIGN_UP_HREF = "/login?next=%2Fsubmit&mode=signup";

/**
 * Inline Anmelden / Registrieren links that return to the submit page.
 */
function SubmitAuthLinks({ className }: { className: string }) {
  return (
    <>
      <Link href={SUBMIT_SIGN_IN_HREF} className={className}>
        Anmelden
      </Link>
      {" · "}
      <Link href={SUBMIT_SIGN_UP_HREF} className={className}>
        Registrieren
      </Link>
    </>
  );
}

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
          {state.code === "unauthenticated" ? (
            <>
              {" "}
              <SubmitAuthLinks className="font-medium text-red-900 underline decoration-red-300 underline-offset-2 hover:text-red-950" />
            </>
          ) : null}
        </p>
      ) : null}

      <LegalNoticeLinks context="submit" />

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Wird veröffentlicht…" : "Inserat veröffentlichen"}
      </button>
    </form>
  );
}
