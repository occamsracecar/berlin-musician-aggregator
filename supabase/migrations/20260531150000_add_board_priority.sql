-- Rank boards for browse results: lower values appear first.
ALTER TABLE public.entries
ADD COLUMN IF NOT EXISTS board_priority integer GENERATED ALWAYS AS (
  CASE board_name
    WHEN 'noisy-rooms.com' THEN 1
    WHEN 'backstagepro.de' THEN 2
    WHEN 'berlinmusiker.de' THEN 3
    WHEN 'community' THEN 4
    WHEN 'musiker-sucht.de' THEN 5
    WHEN 'bandmix.de' THEN 100
    ELSE 50
  END
) STORED;

CREATE INDEX IF NOT EXISTS entries_board_priority_published_at_idx
  ON public.entries (board_priority ASC, published_at DESC);
