-- Sync contact_email from auth.users so listing messages work without service-role API calls.

UPDATE public.profiles AS p
SET contact_email = lower(trim(u.email))
FROM auth.users AS u
WHERE p.id = u.id
  AND u.email IS NOT NULL
  AND (
    p.contact_email IS NULL
    OR trim(p.contact_email) = ''
  );

/**
 * Creates a profile row when a new auth user signs up, including contact email.
 */
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, contact_email)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data ->> 'full_name',
      NEW.raw_user_meta_data ->> 'name',
      split_part(NEW.email, '@', 1)
    ),
    NULLIF(lower(trim(NEW.email)), '')
  )
  ON CONFLICT (id) DO UPDATE
  SET contact_email = COALESCE(
    public.profiles.contact_email,
    EXCLUDED.contact_email
  );

  RETURN NEW;
END;
$$;
