-- Allow community submissions and optional contact links
ALTER TABLE public.entries
  ADD COLUMN IF NOT EXISTS contact_url text;

CREATE POLICY "Anyone can submit community listings"
  ON public.entries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    board_name = 'community'
    AND char_length(trim(title)) > 0
    AND char_length(trim(title)) <= 200
    AND char_length(trim(description)) > 0
    AND char_length(trim(description)) <= 5000
    AND listing_type IN ('band_seeking', 'musician_seeking')
    AND original_url LIKE 'community://%'
    AND (
      contact_url IS NULL
      OR char_length(trim(contact_url)) <= 500
    )
  );
