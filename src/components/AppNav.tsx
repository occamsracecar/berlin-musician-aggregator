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
      "flex-1 rounded-lg px-3 py-2.5 text-center text-sm font-medium transition sm:flex-none sm:px-4",
      isActive
        ? "bg-violet-600 text-white"
        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
    ].join(" ");

  return (
    <nav
      className={[
        "overflow-x-hidden border-b border-zinc-200 bg-white",
        sticky
          ? "sticky top-0 z-20 bg-white/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/90"
          : "",
      ].join(" ")}
    >
      <div
        className={[
          "mx-auto flex w-full min-w-0 max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6",
          children ? "lg:flex-row lg:items-center lg:gap-4" : "",
        ].join(" ")}
      >
        <div className="flex w-full min-w-0 gap-2 sm:w-auto">
          <Link href="/" className={tabClassName(active === "browse")}>
            <span className="sm:hidden">Browse</span>
            <span className="hidden sm:inline">Browse listings</span>
          </Link>
          <Link href="/submit" className={tabClassName(active === "submit")}>
            <span className="sm:hidden">Submit</span>
            <span className="hidden sm:inline">Submit listing</span>
          </Link>
        </div>
        {children ? (
          <div className="w-full min-w-0 lg:min-w-0 lg:flex-1">{children}</div>
        ) : null}
      </div>
    </nav>
  );
}
