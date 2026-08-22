"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import {
  updateProfile,
  type UpdateProfileState,
} from "@/app/actions/update-profile";
import { ProfileAvatarUpload } from "@/components/ProfileAvatarUpload";
import { PROFILE_SOCIAL_FIELDS, type Profile } from "@/types/profile";

const initialState: UpdateProfileState = {
  success: false,
  message: "",
};

const SOCIAL_LABELS: Record<(typeof PROFILE_SOCIAL_FIELDS)[number], string> = {
  soundcloud_url: "SoundCloud",
  youtube_url: "YouTube",
  bandcamp_url: "Bandcamp",
  spotify_url: "Spotify",
};

type ProfileFormProps = {
  userId: string;
  profile: Profile | null;
  email: string;
  showContinueToSubmit?: boolean;
};

/**
 * Editable profile form with avatar upload and music platform links.
 */
export function ProfileForm({
  userId,
  profile,
  email,
  showContinueToSubmit = false,
}: ProfileFormProps) {
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? null);
  const [state, formAction, isPending] = useActionState(
    updateProfile,
    initialState,
  );

  const inputClassName =
    "w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none ring-violet-500 focus:ring-2";

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <input type="hidden" name="avatar_url" value={avatarUrl ?? ""} />

      <p className="text-sm text-zinc-600">
        Angemeldet als <span className="font-medium text-zinc-800">{email}</span>
      </p>

      <ProfileAvatarUpload
        userId={userId}
        initialUrl={profile?.avatar_url ?? null}
        onUrlChange={setAvatarUrl}
      />

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-zinc-700">Anzeigename</span>
        <input
          type="text"
          name="display_name"
          maxLength={80}
          defaultValue={profile?.display_name ?? ""}
          placeholder="Dein Name oder Bandname"
          className={inputClassName}
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-zinc-700">Kontakt-E-Mail</span>
        <input
          type="email"
          name="contact_email"
          autoComplete="email"
          defaultValue={profile?.contact_email ?? email}
          placeholder={email}
          className={inputClassName}
        />
        <span className="text-xs text-zinc-500">
          Nachrichten zu deinen Community-Inseraten werden an diese Adresse
          gesendet. Lass deine Anmelde-E-Mail stehen oder trage ein anderes
          Postfach ein, das du regelmäßig prüfst.
        </span>
      </label>

      <fieldset className="flex flex-col gap-4">
        <legend className="text-sm font-medium text-zinc-700">
          Musik-Links
        </legend>
        <p className="text-xs text-zinc-500">
          Diese erscheinen bei allen Inseraten, die du veröffentlichst. Leer
          lassen, um sie auszublenden.
        </p>
        {PROFILE_SOCIAL_FIELDS.map((field) => (
          <label key={field} className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-zinc-700">
              {SOCIAL_LABELS[field]}
            </span>
            <input
              type="url"
              name={field}
              defaultValue={profile?.[field] ?? ""}
              placeholder={`https://${field.replace("_url", "").replace("_", "")}.com/...`}
              className={inputClassName}
            />
          </label>
        ))}
      </fieldset>

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

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
        {showContinueToSubmit ? (
          <Link
            href="/submit"
            className="rounded-lg border border-zinc-200 px-4 py-2.5 text-center text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            Weiter zum Inserat
          </Link>
        ) : null}
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700 disabled:opacity-60"
        >
          {isPending ? "Wird gespeichert…" : "Profil speichern"}
        </button>
      </div>
    </form>
  );
}
