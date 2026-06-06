import { createServerClient } from "@supabase/ssr";
import {
  buildCanonicalRedirectUrl,
  buildOAuthCallbackRecoveryUrl,
  getCanonicalSiteOrigin,
  shouldRedirectToCanonicalHost,
} from "@/lib/site-url";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refreshes the Supabase session and protects routes that require sign-in.
 */
export async function middleware(request: NextRequest) {
  const canonicalOrigin = getCanonicalSiteOrigin();

  if (
    process.env.VERCEL_ENV === "production" &&
    canonicalOrigin &&
    shouldRedirectToCanonicalHost(request.nextUrl.hostname, canonicalOrigin)
  ) {
    const redirectUrl = buildCanonicalRedirectUrl(
      request.nextUrl,
      canonicalOrigin,
    );
    return NextResponse.redirect(redirectUrl, 308);
  }

  const oauthRecoveryUrl = buildOAuthCallbackRecoveryUrl(request.nextUrl);

  if (oauthRecoveryUrl) {
    return NextResponse.redirect(oauthRecoveryUrl);
  }

  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return response;
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }

        response = NextResponse.next({ request: { headers: request.headers } });

        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  if (!user && (pathname === "/submit" || pathname === "/profile")) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (user && pathname === "/login") {
    const next = request.nextUrl.searchParams.get("next") || "/";
    return NextResponse.redirect(new URL(next, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
