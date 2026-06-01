import Link from "next/link";
import { UserListingEditor } from "@/components/UserListingEditor";
import type { Entry } from "@/types/entry";

type UserListingsSectionProps = {
  listings: Entry[];
};

/**
 * Lists the signed-in user's community listings with edit controls.
 */
export function UserListingsSection({ listings }: UserListingsSectionProps) {
  return (
    <section className="mt-8">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">Your listings</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Listings you published on the community board.
          </p>
        </div>
        <Link
          href="/submit"
          className="rounded-lg bg-violet-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-violet-700"
        >
          New listing
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-8 text-center">
          <p className="text-sm text-zinc-600">
            You have not posted any listings yet.
          </p>
          <Link
            href="/submit"
            className="mt-3 inline-block text-sm font-medium text-violet-600 hover:text-violet-800"
          >
            Submit your first listing →
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {listings.map((entry) => (
            <UserListingEditor key={entry.id} entry={entry} />
          ))}
        </ul>
      )}
    </section>
  );
}
