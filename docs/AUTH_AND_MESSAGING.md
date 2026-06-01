# Auth and listing messages

## Supabase Auth

1. In [Supabase Dashboard](https://supabase.com/dashboard) → **Authentication** → **Providers**:
   - Enable **Email** (password sign-up).
   - Enable **Google** and add your Google OAuth client ID/secret.

2. Under **Authentication** → **URL configuration**:
   - **Site URL:** `https://berlin-musician-aggregator.vercel.app` (production default)
   - **Redirect URLs** (add every environment you use — required for Google to return to the right app):
     - `http://localhost:3000/**`
     - `http://127.0.0.1:3000/**`
     - `https://berlin-musician-aggregator.vercel.app/**`

   If `localhost` is missing, Supabase ignores the app’s redirect and sends you to **Site URL** (Vercel) after sign-in.

### Local development checklist

1. Run the app at `http://localhost:3000` (not the Vercel URL).
2. Open **Sign in** on localhost (`/login`).
3. Confirm Supabase **Redirect URLs** include `http://localhost:3000/**`.
4. Google Cloud **Authorized redirect URIs** stay as  
   `https://aobxhqhgsahmcssledmq.supabase.co/auth/v1/callback` only (do not put localhost in Google).

3. Run the migration `20260602120000_user_profiles_and_messages.sql` (or apply via Supabase CLI).

## Email (Resend)

Contact messages are emailed to listing owners via [Resend](https://resend.com).

Add to `.env.local` and Vercel:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL` (must be a verified sender domain in Resend)
- `NEXT_PUBLIC_SITE_URL` (production site URL for links in emails)

## Behaviour

- **Submit listing** requires sign-in (email or Google).
- Listings store `created_by` = your user id.
- **Send message** appears only on app-submitted listings (`created_by` set).
- Only signed-in users can send messages; the owner receives an email with reply-to set to the sender.

## Profile (`/profile`)

- Upload a **profile image** (drag and drop, max 2 MB).
- Add **SoundCloud, YouTube, Bandcamp, Spotify** links.
- Photo and platform icons appear on all listings you post.
- Avatars are stored in the Supabase `avatars` storage bucket (public read).
