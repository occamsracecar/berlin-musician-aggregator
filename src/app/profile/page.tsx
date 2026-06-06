import { AppNav } from "@/components/AppNav";
import { DeleteAccountSection } from "@/components/DeleteAccountSection";
import {
  buildProfileListingMessages,
  ProfileMessagesSection,
} from "@/components/ProfileMessagesSection";
import { ProfileForm } from "@/components/ProfileForm";
import { UserListingsSection } from "@/components/UserListingsSection";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Entry } from "@/types/entry";
import type { Profile } from "@/types/profile";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

/**
 * Signed-in user's profile settings and editable listings.
 */
export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/profile");
  }

  const [{ data: profile }, { data: listings }] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        "id, display_name, contact_email, avatar_url, soundcloud_url, youtube_url, bandcamp_url, spotify_url",
      )
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("entries")
      .select(
        "id, board_name, title, description, original_url, published_at, listing_type, genres, contact_url, created_by",
      )
      .eq("created_by", user.id)
      .eq("board_name", "community")
      .order("published_at", { ascending: false }),
  ]);

  const communityListings = (listings ?? []) as Entry[];
  const entryIds = communityListings.map((listing) => listing.id);

  let profileMessages = buildProfileListingMessages([], communityListings, new Map());

  if (entryIds.length > 0) {
    const { data: rawMessages } = await supabase
      .from("listing_messages")
      .select("id, body, created_at, entry_id, sender_id")
      .in("entry_id", entryIds)
      .order("created_at", { ascending: false })
      .limit(50);

    const senderIds = [
      ...new Set((rawMessages ?? []).map((message) => message.sender_id)),
    ];

    const senderNamesById = new Map<string, string>();

    if (senderIds.length > 0) {
      const { data: senderProfiles } = await supabase
        .from("profiles")
        .select("id, display_name")
        .in("id", senderIds);

      for (const senderProfile of senderProfiles ?? []) {
        senderNamesById.set(
          senderProfile.id,
          senderProfile.display_name?.trim() || "Someone",
        );
      }
    }

    profileMessages = buildProfileListingMessages(
      rawMessages ?? [],
      communityListings,
      senderNamesById,
    );
  }

  return (
    <div className="min-h-full bg-zinc-50">
      <AppNav active="browse" sticky />

      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-zinc-900">Your profile</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Your photo and music links are shown on every listing you publish.
          </p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <ProfileForm
            userId={user.id}
            profile={(profile as Profile | null) ?? null}
            email={user.email ?? ""}
          />
        </div>

        <UserListingsSection listings={communityListings} />

        <ProfileMessagesSection messages={profileMessages} />

        <DeleteAccountSection />
      </main>
    </div>
  );
}
