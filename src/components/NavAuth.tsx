"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import type { User } from "@supabase/supabase-js";

/**
 * Shows sign-in link or account menu in the navigation bar.
 */
export function NavAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  /**
   * Signs the user out and refreshes the page.
   */
  async function handleSignOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.refresh();
    router.push("/");
  }

  const loginHref = `/login?next=${encodeURIComponent(pathname || "/")}`;

  if (loading) {
    return (
      <span
        className="h-9 w-[4.5rem] shrink-0 animate-pulse rounded-lg bg-zinc-100"
        aria-hidden
      />
    );
  }

  if (!user) {
    if (pathname === "/login") {
      return null;
    }

    return (
      <Link
        href={loginHref}
        className="shrink-0 rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 text-sm font-medium text-violet-700 transition hover:bg-violet-100"
      >
        Sign in
      </Link>
    );
  }

  const label = user.email?.split("@")[0] ?? "Account";

  return (
    <div className="flex shrink-0 items-center gap-1 sm:gap-2">
      <Link
        href="/profile"
        className="rounded-lg px-2 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 sm:px-3"
      >
        Profile
      </Link>
      <span className="hidden max-w-[6rem] truncate text-sm text-zinc-500 md:inline lg:max-w-[8rem]">
        {label}
      </span>
      <button
        type="button"
        onClick={handleSignOut}
        className="rounded-lg px-2 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 sm:px-3"
      >
        Sign out
      </button>
    </div>
  );
}
