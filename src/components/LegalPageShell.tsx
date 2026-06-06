import type { ReactNode } from "react";
import { AppNav } from "@/components/AppNav";

type LegalPageShellProps = {
  title: string;
  children: ReactNode;
};

/**
 * Shared layout for Impressum, privacy, and terms pages.
 */
export function LegalPageShell({ title, children }: LegalPageShellProps) {
  return (
    <div className="min-h-full bg-zinc-50">
      <AppNav active="browse" />

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <article className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-10">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            {title}
          </h1>
          <div className="mt-8 space-y-6 text-sm leading-relaxed text-zinc-700">
            {children}
          </div>
        </article>
      </main>
    </div>
  );
}
