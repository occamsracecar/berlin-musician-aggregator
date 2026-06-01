-- Browse sort is published_at first, board_priority as tie-breaker.
DROP INDEX IF EXISTS public.entries_board_priority_published_at_idx;

CREATE INDEX IF NOT EXISTS entries_published_at_board_priority_idx
  ON public.entries (published_at DESC NULLS LAST, board_priority ASC);
