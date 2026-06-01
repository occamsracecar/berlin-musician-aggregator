import Link from "next/link";
import type { ReactNode } from "react";
import { NavAuth } from "@/components/NavAuth";

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
      "rounded-lg px-3 py-2.5 text-center text-sm font-medium transition sm:px-4",
      isActive
        ? "bg-violet-600 text-white"
        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
    ].join(" ");

  return (
    <nav
      className={[
        "overflow-visible border-b border-zinc-200 bg-white",
        sticky
          ? "sticky top-0 z-30 bg-white/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/90"
          : "relative z-30",
      ].join(" ")}
    >
      <div className="mx-auto flex w-full min-w-0 max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6">
        <div className="flex w-full min-w-0 items-center gap-2">
          <div className="flex min-w-0 flex-1 gap-2">
            <Link href="/" className={tabClassName(active === "browse")}>
              <span className="sm:hidden">Browse</span>
              <span className="hidden sm:inline">Browse listings</span>
            </Link>
            <Link href="/submit" className={tabClassName(active === "submit")}>
              <span className="sm:hidden">Submit</span>
              <span className="hidden sm:inline">Submit listing</span>
            </Link>
          </div>
          <NavAuth />
        </div>

        {children ? (
          <div className="relative z-40 w-full min-w-0 overflow-visible">
            {children}
          </div>
        ) : null}
      </div>
    </nav>
  );
}
