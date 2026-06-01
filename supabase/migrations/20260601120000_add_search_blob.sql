-- Normalized text for generous search (ignores spaces, hyphens, underscores).
CREATE EXTENSION IF NOT EXISTS pg_trgm;

ALTER TABLE public.entries
ADD COLUMN IF NOT EXISTS search_blob text GENERATED ALWAYS AS (
  lower(
    regexp_replace(
      coalesce(title, '') || coalesce(description, ''),
      '[\s\-_]+',
      '',
      'g'
    )
  )
) STORED;

CREATE INDEX IF NOT EXISTS entries_search_blob_trgm_idx
  ON public.entries USING gin (search_blob gin_trgm_ops);
