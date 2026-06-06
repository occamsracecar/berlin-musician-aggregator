import { GENRES, LISTING_TYPES } from "@/lib/constants";
import { MAX_LISTING_GENRE_TAGS } from "@/lib/classify";
import type { Entry } from "@/types/entry";

type ListingFormFieldsProps = {
  entry?: Pick<Entry, "title" | "description" | "listing_type" | "genres">;
  showProfileHint?: boolean;
};

/**
 * Shared title, description, tags, and type fields for create/edit listing forms.
 */
export function ListingFormFields({
  entry,
  showProfileHint = false,
}: ListingFormFieldsProps) {
  const inputClassName =
    "w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none ring-violet-500 focus:ring-2";
  const selectedGenres = new Set(entry?.genres ?? []);

  return (
    <>
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-zinc-700">Title</span>
        <input
          type="text"
          name="title"
          required
          maxLength={200}
          defaultValue={entry?.title ?? ""}
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
          defaultValue={entry?.description ?? ""}
          placeholder="Describe what you are looking for, your style, rehearsal area, experience level..."
          className={`${inputClassName} resize-y`}
        />
      </label>

      <fieldset className="flex flex-col gap-2 text-sm">
        <legend className="font-medium text-zinc-700">
          Tags{" "}
          <span className="font-normal text-zinc-500">
            (optional, up to {MAX_LISTING_GENRE_TAGS})
          </span>
        </legend>
        <p className="text-xs text-zinc-500">
          Pick genres that fit your listing. Matching tags from your description
          may be added automatically.
        </p>
        <div className="flex flex-wrap gap-2">
          {GENRES.map((genre) => (
            <label
              key={genre}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-700 transition has-[:checked]:border-violet-300 has-[:checked]:bg-violet-50 has-[:checked]:text-violet-800"
            >
              <input
                type="checkbox"
                name="genres"
                value={genre}
                defaultChecked={selectedGenres.has(genre)}
                className="size-3.5 rounded border-zinc-300 text-violet-600 focus:ring-violet-500"
              />
              {genre}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-zinc-700">Listing type</span>
        <select
          name="listing_type"
          required
          className={inputClassName}
          defaultValue={entry?.listing_type ?? ""}
        >
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

      {showProfileHint ? (
        <p className="text-sm text-zinc-600">
          Signed-in members can email you from your listing. Set your contact
          email on your profile if you want messages in a different inbox.
        </p>
      ) : null}
    </>
  );
}
