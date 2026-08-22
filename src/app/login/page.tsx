import { headers } from "next/headers";
import { AppNav } from "@/components/AppNav";
import { AuthForm } from "@/components/AuthForm";
import { AuthPageBrand } from "@/components/AuthPageBrand";

type LoginPageProps = {
  searchParams: Promise<{ next?: string; error?: string; mode?: string }>;
};

const ERROR_MESSAGES: Record<string, string> = {
  auth_callback: "Anmeldung fehlgeschlagen. Bitte versuche es erneut.",
  missing_code: "Anmelde-Link war ungültig. Bitte versuche es erneut.",
  config: "Authentifizierung ist nicht konfiguriert.",
};

/**
 * Sign-in and sign-up page for email and Google auth.
 */
export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextPath = params.next ?? "/submit";
  const initialMode = params.mode === "signup" ? "signup" : "signin";
  const errorMessage = params.error
    ? (ERROR_MESSAGES[params.error] ?? "Etwas ist schiefgelaufen.")
    : null;
  const host = (await headers()).get("host") ?? "";
  const isLocalDev =
    host.startsWith("localhost:") || host.startsWith("127.0.0.1:");

  return (
    <div className="min-h-full bg-zinc-50">
      <AppNav active="browse" />

      <main className="mx-auto max-w-md px-4 py-10 sm:px-6">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <AuthPageBrand />

          {errorMessage ? (
            <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">
              {errorMessage}
            </p>
          ) : null}

          {isLocalDev ? (
            <p className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900">
              Lokale Entwicklung: Melde dich in diesem Tab an ({host}). Wenn
              Google dich stattdessen zu Vercel weiterleitet, füge{" "}
              <code className="rounded bg-amber-100 px-1">
                http://localhost:3000/**
              </code>{" "}
              unter Supabase → Authentication → URL configuration → Redirect
              URLs hinzu.
            </p>
          ) : null}

          <div className="mt-6">
            <AuthForm nextPath={nextPath} initialMode={initialMode} />
          </div>
        </div>
      </main>
    </div>
  );
}
