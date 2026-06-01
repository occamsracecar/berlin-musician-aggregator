-- Add filter and classification columns to entries
ALTER TABLE public.entries
  ADD COLUMN IF NOT EXISTS listing_type text,
  ADD COLUMN IF NOT EXISTS genres text[] NOT NULL DEFAULT '{}';

CREATE INDEX IF NOT EXISTS entries_listing_type_idx ON public.entries (listing_type);
CREATE INDEX IF NOT EXISTS entries_genres_idx ON public.entries USING gin (genres);
