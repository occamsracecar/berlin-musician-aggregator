"use client";

import { useCallback, useEffect, useId, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { markFirstListingProfileSeen } from "@/app/actions/mark-first-listing-profile-seen";
import { FIRST_LISTING_PROFILE_HREF } from "@/lib/first-listing-setup";

type FirstListingProfileDialogProps = {
  initiallyOpen: boolean;
};

/**
 * One-time, skippable prompt to set up a profile before the first listing.
 */
export function FirstListingProfileDialog({
  initiallyOpen,
}: FirstListingProfileDialogProps) {
  const titleId = useId();
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const [open, setOpen] = useState(initiallyOpen);
  const [isPending, startTransition] = useTransition();

  const skip = useCallback(() => {
    if (isPending) {
      return;
    }

    startTransition(async () => {
      await markFirstListingProfileSeen();
      setOpen(false);
    });
  }, [isPending]);

  const goToProfile = useCallback(() => {
    if (isPending) {
      return;
    }

    startTransition(async () => {
      await markFirstListingProfileSeen();
      router.push(FIRST_LISTING_PROFILE_HREF);
    });
  }, [isPending, router]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    profileButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        skip();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, skip]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
      role="presentation"
      onClick={skip}
    >
      <div className="absolute inset-0 bg-zinc-900/50 backdrop-blur-[2px]" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-md rounded-xl border border-zinc-200 bg-white p-5 shadow-xl sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id={titleId} className="text-lg font-semibold text-zinc-900">
          Kurz zu deinem Profil
        </h2>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          Foto, Anzeigename und Musik-Links erscheinen auf deinem Inserat.
          Du kannst das jetzt einrichten oder später nachholen — nur beim
          ersten Inserat.
        </p>

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={skip}
            disabled={isPending}
            className="rounded-lg border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-60"
          >
            Überspringen
          </button>
          <button
            ref={profileButtonRef}
            type="button"
            onClick={goToProfile}
            disabled={isPending}
            className="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700 disabled:opacity-60"
          >
            {isPending ? "Einen Moment…" : "Zum Profil"}
          </button>
        </div>
      </div>
    </div>
  );
}
