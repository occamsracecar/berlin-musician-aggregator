"use client";

import { useActionState, useEffect, useId, useRef } from "react";
import Link from "next/link";
import {
  sendListingMessage,
  type SendListingMessageState,
} from "@/app/actions/send-listing-message";
import type { Entry } from "@/types/entry";

type ContactListingDialogProps = {
  entry: Entry;
  open: boolean;
  onClose: () => void;
  isSignedIn: boolean;
};

const initialState: SendListingMessageState = {
  success: false,
  message: "",
};

/**
 * Modal for signed-in users to message the author of an app-submitted listing.
 */
export function ContactListingDialog({
  entry,
  open,
  onClose,
  isSignedIn,
}: ContactListingDialogProps) {
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [state, formAction, isPending] = useActionState(
    sendListingMessage,
    initialState,
  );

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

  useEffect(() => {
    if (state.success) {
      const timer = window.setTimeout(onClose, 2000);
      return () => window.clearTimeout(timer);
    }
  }, [state.success, onClose]);

  if (!open) {
    return null;
  }

  const inputClassName =
    "w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none ring-violet-500 focus:ring-2";

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
        className="relative z-10 w-full max-w-lg rounded-xl border border-zinc-200 bg-white p-5 shadow-xl sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 id={titleId} className="text-lg font-semibold text-zinc-900">
              Inserat-Autor kontaktieren
            </h2>
            <p className="mt-1 text-sm text-zinc-600 line-clamp-2">
              {entry.title}
            </p>
            <p className="mt-2 text-xs text-zinc-500">
              Deine Nachricht wird per E-Mail an den Autor gesendet. Er kann
              direkt an deine Konto-E-Mail antworten.
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm text-zinc-500 hover:bg-zinc-100"
          >
            Schließen
          </button>
        </div>

        {!isSignedIn ? (
          <div className="rounded-lg bg-violet-50 px-4 py-3 text-sm text-violet-900">
            <p className="mb-3">
              Melde dich an, um eine Nachricht zu senden. Der Autor erhält sie
              per E-Mail.
            </p>
            <Link
              href={`/login?next=${encodeURIComponent("/")}`}
              className="font-medium text-violet-700 underline"
            >
              Anmelden oder Konto erstellen
            </Link>
          </div>
        ) : (
          <form action={formAction} className="flex flex-col gap-4">
            <input type="hidden" name="entry_id" value={entry.id} />
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-zinc-700">Deine Nachricht</span>
              <textarea
                name="body"
                required
                rows={5}
                maxLength={2000}
                placeholder="Stelle dich vor und beschreibe, wonach du suchst…"
                className={`${inputClassName} resize-y`}
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
              disabled={isPending || state.success}
              className="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700 disabled:opacity-60"
            >
              {isPending ? "Wird gesendet…" : "Nachricht senden"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
