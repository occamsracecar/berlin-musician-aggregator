"use client";

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
};

/**
 * Editable profile form with avatar upload and music platform links.
 */
export function ProfileForm({ userId, profile, email }: ProfileFormProps) {
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
        Signed in as <span className="font-medium text-zinc-800">{email}</span>
      </p>

      <ProfileAvatarUpload
        userId={userId}
        initialUrl={profile?.avatar_url ?? null}
        onUrlChange={setAvatarUrl}
      />

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-zinc-700">Display name</span>
        <input
          type="text"
          name="display_name"
          maxLength={80}
          defaultValue={profile?.display_name ?? ""}
          placeholder="Your name or band name"
          className={inputClassName}
        />
      </label>

      <fieldset className="flex flex-col gap-4">
        <legend className="text-sm font-medium text-zinc-700">
          Music links
        </legend>
        <p className="text-xs text-zinc-500">
          These appear on all listings you post. Leave blank to hide.
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

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700 disabled:opacity-60"
      >
        {isPending ? "Saving..." : "Save profile"}
      </button>
    </form>
  );
}
