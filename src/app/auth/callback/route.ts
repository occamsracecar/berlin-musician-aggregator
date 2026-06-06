import { createServerClient } from "@supabase/ssr";
import { getAuthRedirectOrigin } from "@/lib/site-url";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * Exchanges an OAuth or email confirmation code for a Supabase session.
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/";
  const responseOrigin = getAuthRedirectOrigin(requestUrl.origin);

  if (!code) {
    return NextResponse.redirect(
      new URL("/login?error=missing_code", responseOrigin),
    );
  }

  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return NextResponse.redirect(
      new URL("/login?error=config", responseOrigin),
    );
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          cookieStore.set(name, value, options);
        }
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      new URL("/login?error=auth_callback", responseOrigin),
    );
  }

  return NextResponse.redirect(new URL(next, responseOrigin));
}
