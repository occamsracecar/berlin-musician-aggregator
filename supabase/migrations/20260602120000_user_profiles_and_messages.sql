-- User profiles, listing ownership, and in-app messages with email delivery.

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  display_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.entries
  ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users (id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS entries_created_by_idx ON public.entries (created_by);

CREATE TABLE IF NOT EXISTS public.listing_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id uuid NOT NULL REFERENCES public.entries (id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT listing_messages_body_length CHECK (
    char_length(trim(body)) >= 1 AND char_length(trim(body)) <= 2000
  )
);

CREATE INDEX IF NOT EXISTS listing_messages_entry_id_idx
  ON public.listing_messages (entry_id);

CREATE INDEX IF NOT EXISTS listing_messages_sender_id_idx
  ON public.listing_messages (sender_id);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are readable by everyone"
  ON public.profiles
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

CREATE POLICY "Authenticated users send listing messages"
  ON public.listing_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1
      FROM public.entries e
      WHERE e.id = entry_id
        AND e.created_by IS NOT NULL
        AND e.created_by <> auth.uid()
    )
  );

CREATE POLICY "Participants can read listing messages"
  ON public.listing_messages
  FOR SELECT
  TO authenticated
  USING (
    sender_id = auth.uid()
    OR EXISTS (
      SELECT 1
      FROM public.entries e
      WHERE e.id = entry_id
        AND e.created_by = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Anyone can submit community listings" ON public.entries;

CREATE POLICY "Authenticated users submit own community listings"
  ON public.entries
  FOR INSERT
  TO authenticated
  WITH CHECK (
    board_name = 'community'
    AND created_by = auth.uid()
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

CREATE POLICY "Owners can update own community listings"
  ON public.entries
  FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid() AND board_name = 'community')
  WITH CHECK (created_by = auth.uid() AND board_name = 'community');

CREATE POLICY "Owners can delete own community listings"
  ON public.entries
  FOR DELETE
  TO authenticated
  USING (created_by = auth.uid() AND board_name = 'community');

/**
 * Creates a profile row when a new auth user signs up.
 */
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data ->> 'full_name',
      NEW.raw_user_meta_data ->> 'name',
      split_part(NEW.email, '@', 1)
    )
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
