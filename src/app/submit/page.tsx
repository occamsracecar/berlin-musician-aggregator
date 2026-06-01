import { AppNav } from "@/components/AppNav";
import { SubmitListingForm } from "@/components/SubmitListingForm";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function SubmitPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-full bg-zinc-50">
      <AppNav active="submit" sticky />

      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
          <p className="text-sm font-medium uppercase tracking-wide text-violet-600">
            Berlin Musician Listings
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900">
            Submit a listing
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Post as a signed-in member. Others can send you messages by email.
            {user?.email ? (
              <>
                {" "}
                Posting as <span className="font-medium">{user.email}</span>.
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
    </div>
  );
}
