import { cookies } from "next/headers";
import { AppNav } from "@/components/AppNav";
import { FirstListingProfileDialog } from "@/components/FirstListingProfileDialog";
import { SubmitListingForm } from "@/components/SubmitListingForm";
import {
  FIRST_LISTING_PROFILE_COOKIE,
  shouldPromptFirstListingProfileSetup,
} from "@/lib/first-listing-setup";
import { countUserCommunityListings } from "@/lib/listings";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * Community listing submission page, with a one-time first-listing profile prompt.
 */
export default async function SubmitPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const cookieStore = await cookies();
  const communityListingCount = user
    ? await countUserCommunityListings(supabase, user.id)
    : null;
  const promptFirstProfile = shouldPromptFirstListingProfileSetup({
    isSignedIn: Boolean(user),
    communityListingCount,
    cookieValue: cookieStore.get(FIRST_LISTING_PROFILE_COOKIE)?.value,
  });

  return (
    <div className="min-h-full bg-zinc-50">
      <AppNav active="submit" sticky />

      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
          <p className="text-sm font-medium uppercase tracking-wide text-violet-600">
            Berlin Bandhub
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900">
            Inserat aufgeben
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Als angemeldetes Mitglied veröffentlichen. Andere können dir per
            E-Mail Nachrichten senden.
            {user?.email ? (
              <>
                {" "}
                Veröffentlicht als{" "}
                <span className="font-medium">{user.email}</span>.
              </>
            ) : null}
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <SubmitListingForm />
        </div>
      </main>

      <FirstListingProfileDialog initiallyOpen={promptFirstProfile} />
    </div>
  );
}
