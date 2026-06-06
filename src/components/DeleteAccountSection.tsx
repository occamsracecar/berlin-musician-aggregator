"use client";

import { useActionState } from "react";
import {
  deleteAccount,
  type DeleteAccountState,
} from "@/app/actions/delete-account";

const initialState: DeleteAccountState = {
  success: false,
  message: "",
};

/**
 * Danger-zone form for permanently deleting the signed-in user's account.
 */
export function DeleteAccountSection() {
  const [state, formAction, isPending] = useActionState(
    deleteAccount,
    initialState,
  );

  return (
    <section className="mt-8 rounded-xl border border-red-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-zinc-900">Delete account</h2>
      <p className="mt-2 text-sm text-zinc-600">
        Permanently removes your profile, avatar, community listings, and sign-in.
        This cannot be undone.
      </p>

      <form action={formAction} className="mt-4 flex flex-col gap-3">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-zinc-700">
            Type <span className="font-mono text-red-700">DELETE</span> to confirm
          </span>
          <input
            type="text"
            name="confirm"
            autoComplete="off"
            placeholder="DELETE"
            className="w-full max-w-xs rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none ring-red-500 focus:ring-2"
          />
        </label>

        {state.message ? (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">
            {state.message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className="w-fit rounded-lg border border-red-300 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-800 transition hover:bg-red-100 disabled:opacity-60"
        >
          {isPending ? "Deleting account..." : "Delete my account"}
        </button>
      </form>
    </section>
  );
}
