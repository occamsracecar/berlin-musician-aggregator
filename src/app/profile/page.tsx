import { AppNav } from "@/components/AppNav";
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
        "id, display_name, avatar_url, soundcloud_url, youtube_url, bandcamp_url, spotify_url",
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

        <UserListingsSection listings={(listings ?? []) as Entry[]} />
      </main>
    </div>
  );
}
