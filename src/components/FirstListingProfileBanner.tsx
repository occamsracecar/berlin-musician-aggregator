import Link from "next/link";

/**
 * Explains why first-time posters landed on the profile page, with a continue link.
 */
export function FirstListingProfileBanner() {
  return (
    <div className="mb-6 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm text-violet-950">
      <p>
        Foto, Anzeigename und Musik-Links erscheinen auf deinem Inserat. Du
        kannst Felder leer lassen und später ergänzen.
      </p>
      <Link
        href="/submit"
        className="mt-2 inline-block font-medium text-violet-700 underline hover:text-violet-900"
      >
        Weiter zum Inserat
      </Link>
    </div>
  );
}
