import {
  getBoardFaviconUrl,
  getBoardLabel,
} from "@/lib/constants";

type BoardTagProps = {
  boardName: string;
};

/**
 * Renders the board source pill with favicon (or community icon) and label.
 */
export function BoardTag({ boardName }: BoardTagProps) {
  const label = getBoardLabel(boardName);
  const faviconUrl = getBoardFaviconUrl(boardName);

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-2.5 py-1 font-medium text-violet-700">
      {faviconUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- external favicon, tiny size
        <img
          src={faviconUrl}
          alt=""
          width={14}
          height={14}
          className="size-3.5 shrink-0 rounded-sm"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <CommunityBoardIcon />
      )}
      {label}
    </span>
  );
}

/**
 * Simple people icon for community-submitted listings without an external board.
 */
function CommunityBoardIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className="size-3.5 shrink-0 text-violet-600"
      fill="currentColor"
    >
      <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5 6a5 5 0 0 1 10 0H3Z" />
    </svg>
  );
}
