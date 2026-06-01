import Link from "next/link";

type AppNavProps = {
  active: "browse" | "submit";
};

/**
 * Top navigation tabs for browsing and submitting listings.
 */
export function AppNav({ active }: AppNavProps) {
  const tabClassName = (isActive: boolean) =>
    [
      "rounded-lg px-4 py-2 text-sm font-medium transition",
      isActive
        ? "bg-violet-600 text-white"
        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
    ].join(" ");

  return (
    <nav className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 sm:px-6">
        <Link href="/" className={tabClassName(active === "browse")}>
          Browse listings
        </Link>
        <Link href="/submit" className={tabClassName(active === "submit")}>
          Submit listing
        </Link>
      </div>
    </nav>
  );
}
