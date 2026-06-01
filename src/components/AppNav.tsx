import Link from "next/link";
import type { ReactNode } from "react";

type AppNavProps = {
  active: "browse" | "submit";
  sticky?: boolean;
  children?: ReactNode;
};

/**
 * Top navigation tabs; optional sticky bar with browse search and filters.
 */
export function AppNav({ active, sticky = false, children }: AppNavProps) {
  const tabClassName = (isActive: boolean) =>
    [
      "rounded-lg px-4 py-2 text-sm font-medium transition",
      isActive
        ? "bg-violet-600 text-white"
        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
    ].join(" ");

  return (
    <nav
      className={[
        "border-b border-zinc-200 bg-white",
        sticky
          ? "sticky top-0 z-20 bg-white/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/90"
          : "",
      ].join(" ")}
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-2 gap-y-2 px-4 py-3 sm:gap-3 sm:px-6">
        <div className="flex shrink-0 items-center gap-2">
          <Link href="/" className={tabClassName(active === "browse")}>
            Browse listings
          </Link>
          <Link href="/submit" className={tabClassName(active === "submit")}>
            Submit listing
          </Link>
        </div>
        {children}
      </div>
    </nav>
  );
}
