-- Create entries table for scraped musician listings
CREATE TABLE IF NOT EXISTS public.entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  board_name text NOT NULL,
  title text NOT NULL,
  description text,
  original_url text NOT NULL UNIQUE,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS entries_published_at_idx ON public.entries (published_at DESC);

ALTER TABLE public.entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for entries"
  ON public.entries
  FOR SELECT
  TO anon, authenticated
  USING (true);
