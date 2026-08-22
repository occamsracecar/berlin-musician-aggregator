"use client";

import { useState } from "react";
import { LegalNoticeLinks } from "@/components/LegalNoticeLinks";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type AuthFormProps = {
  nextPath?: string;
  initialMode?: "signin" | "signup";
};

/**
 * Email/password and Google sign-in form for Supabase Auth.
 */
export function AuthForm({
  nextPath = "/",
  initialMode = "signin",
}: AuthFormProps) {
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const inputClassName =
    "w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none ring-violet-500 focus:ring-2";

  /**
   * Builds the OAuth/email redirect URL after authentication.
   */
  function getRedirectUrl() {
    const origin = window.location.origin;
    return `${origin}/auth/callback?next=${encodeURIComponent(nextPath)}`;
  }

  /**
   * Signs the user in with email and password.
   */
  async function handleEmailAuth(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage(null);

    const supabase = createSupabaseBrowserClient();

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: getRedirectUrl() },
      });

      setPending(false);

      if (error) {
        setMessage(error.message);
        return;
      }

      setMessage(
        "Bitte bestätige dein Konto per E-Mail und melde dich dann an.",
      );
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setPending(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    window.location.href = nextPath;
  }

  /**
   * Starts Google OAuth sign-in.
   */
  async function handleGoogleSignIn() {
    setPending(true);
    setMessage(null);

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: getRedirectUrl() },
    });

    setPending(false);

    if (error) {
      setMessage(error.message);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <LegalNoticeLinks context="auth" />

      <button
        type="button"
        disabled={pending}
        onClick={handleGoogleSignIn}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50 disabled:opacity-60"
      >
        Mit Google fortfahren
      </button>

      <div className="flex items-center gap-3 text-xs text-zinc-400">
        <span className="h-px flex-1 bg-zinc-200" />
        oder E-Mail
        <span className="h-px flex-1 bg-zinc-200" />
      </div>

      <form onSubmit={handleEmailAuth} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-zinc-700">E-Mail</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={inputClassName}
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-zinc-700">Passwort</span>
          <input
            type="password"
            required
            minLength={6}
            autoComplete={
              mode === "signup" ? "new-password" : "current-password"
            }
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={inputClassName}
          />
        </label>

        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700 disabled:opacity-60"
        >
          {pending
            ? "Bitte warten…"
            : mode === "signup"
              ? "Konto erstellen"
              : "Anmelden"}
        </button>
      </form>

      <p className="text-center text-sm text-zinc-600">
        {mode === "signin" ? (
          <>
            Noch kein Konto?{" "}
            <button
              type="button"
              className="font-medium text-violet-600 hover:text-violet-800"
              onClick={() => setMode("signup")}
            >
              Registrieren
            </button>
          </>
        ) : (
          <>
            Bereits ein Konto?{" "}
            <button
              type="button"
              className="font-medium text-violet-600 hover:text-violet-800"
              onClick={() => setMode("signin")}
            >
              Anmelden
            </button>
          </>
        )}
      </p>

      {message ? (
        <p className="rounded-lg bg-zinc-100 px-4 py-3 text-sm text-zinc-700">
          {message}
        </p>
      ) : null}
    </div>
  );
}
