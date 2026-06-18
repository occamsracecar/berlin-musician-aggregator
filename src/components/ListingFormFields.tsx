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
        <span className="font-medium text-zinc-700">Titel</span>
        <input
          type="text"
          name="title"
          required
          maxLength={200}
          defaultValue={entry?.title ?? ""}
          placeholder="z. B. Rockband sucht Schlagzeuger"
          className={inputClassName}
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-zinc-700">Beschreibung</span>
        <textarea
          name="description"
          required
          rows={8}
          maxLength={5000}
          defaultValue={entry?.description ?? ""}
          placeholder="Beschreibe, wonach du suchst, deinen Stil, Probenort, Erfahrungslevel…"
          className={`${inputClassName} resize-y`}
        />
      </label>

      <fieldset className="flex flex-col gap-2 text-sm">
        <legend className="font-medium text-zinc-700">
          Tags{" "}
          <span className="font-normal text-zinc-500">
            (optional, bis zu {MAX_LISTING_GENRE_TAGS})
          </span>
        </legend>
        <p className="text-xs text-zinc-500">
          Wähle Genres, die zu deinem Inserat passen. Passende Tags aus deiner
          Beschreibung können automatisch ergänzt werden.
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
        <span className="font-medium text-zinc-700">Inserattyp</span>
        <select
          name="listing_type"
          required
          className={inputClassName}
          defaultValue={entry?.listing_type ?? ""}
        >
          <option value="" disabled>
            Bitte wählen
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
          Angemeldete Mitglieder können dich über dein Inserat per E-Mail
          kontaktieren. Lege unter deinem Profil eine Kontakt-E-Mail fest, wenn
          du Nachrichten in einem anderen Postfach erhalten möchtest.
        </p>
      ) : null}
    </>
  );
}
