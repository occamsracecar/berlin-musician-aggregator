import { mergeListingGenres, parseSubmittedGenres } from "@/lib/classify";

export const LISTING_FORM_LIMITS = {
  maxTitle: 200,
  maxDescription: 5000,
} as const;

export type ParsedListingForm = {
  title: string;
  description: string;
  listingType: string;
  genres: string[];
};

/**
 * Parses and validates listing fields from a form submission.
 */
export function parseListingFormData(
  formData: FormData,
): { ok: true; data: ParsedListingForm } | { ok: false; message: string } {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const listingType = String(formData.get("listing_type") ?? "").trim();
  const selectedGenres = parseSubmittedGenres(formData.getAll("genres"));

  if (!title || title.length > LISTING_FORM_LIMITS.maxTitle) {
    return {
      ok: false,
      message: `Please enter a title up to ${LISTING_FORM_LIMITS.maxTitle} characters.`,
    };
  }

  if (
    !description ||
    description.length > LISTING_FORM_LIMITS.maxDescription
  ) {
    return {
      ok: false,
      message: `Please enter a description up to ${LISTING_FORM_LIMITS.maxDescription} characters.`,
    };
  }

  if (!["band_seeking", "musician_seeking"].includes(listingType)) {
    return {
      ok: false,
      message: "Please select a listing type.",
    };
  }

  const genres = mergeListingGenres(selectedGenres, title, description);

  return {
    ok: true,
    data: { title, description, listingType, genres },
  };
}
