/**
 * Shiny badge for listings published within the last week.
 */
export function ListingNewBadge() {
  return (
    <span className="inline-flex items-center rounded-full bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-950 shadow-sm ring-1 ring-amber-400/70 animate-pulse">
      New
    </span>
  );
}
