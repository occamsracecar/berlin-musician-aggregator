-- Optional notification email on profile; restrict messages to community listings.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS contact_email text;

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_contact_email_format;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_contact_email_format CHECK (
    contact_email IS NULL
    OR (
      char_length(trim(contact_email)) >= 3
      AND char_length(trim(contact_email)) <= 254
      AND contact_email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
    )
  );

DROP POLICY IF EXISTS "Authenticated users send listing messages" ON public.listing_messages;

CREATE POLICY "Authenticated users send community listing messages"
  ON public.listing_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1
      FROM public.entries e
      WHERE e.id = entry_id
        AND e.board_name = 'community'
        AND e.created_by IS NOT NULL
        AND e.created_by <> auth.uid()
    )
  );
