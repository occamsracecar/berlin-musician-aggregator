# Auth and listing messages

## Supabase Auth

1. In [Supabase Dashboard](https://supabase.com/dashboard) → **Authentication** → **Providers**:
   - Enable **Email** (password sign-up).
   - Enable **Google** and add your Google OAuth client ID/secret.

### Google sign-in branding (“Berlin Musicians”)

The name on Google’s consent screen comes from your **Google Cloud OAuth consent screen**, not from this repo.

1. Open [Google Cloud Console](https://console.cloud.google.com/) → the project that owns the OAuth client used in Supabase.
2. **APIs & Services** → **OAuth consent screen**.
3. Set **App name** to `Berlin Musicians` (or similar).
4. Add a **User support email** and, if you publish the app, an **App logo** (optional but helps trust).
5. Under **App domain**, set **Application home page** to `https://berlinbandhub.de`.
6. Save. New sign-ins should show “Berlin Musicians” instead of the Supabase project hostname.

The redirect URI stays `https://<project-ref>.supabase.co/auth/v1/callback` in Google’s **Authorized redirect URIs** — that URL is normal and users rarely see it if the app name is set correctly.

2. Under **Authentication** → **URL configuration**:
   - **Site URL:** `https://berlinbandhub.de`
   - **Redirect URLs** (add every environment you use — required for Google to return to the right app):
     - `http://localhost:3000/**`
     - `http://127.0.0.1:3000/**`
     - `https://berlinbandhub.de/**`
     - `https://www.berlinbandhub.de/**` (if you use www)

   If the custom domain is missing here, Supabase ignores the app’s redirect and sends you to **Site URL** with `?code=` on `/` (often the old `*.vercel.app` URL).

### Custom domain (Vercel)

1. Vercel → project → **Settings** → **Domains** → add `berlinbandhub.de` (and `www` if needed). Set one as **Primary**.
2. Vercel → **Settings** → **Environment Variables** → Production:
   - `NEXT_PUBLIC_SITE_URL` = `https://berlinbandhub.de`
3. Redeploy after changing env vars.

The app redirects other production hosts (including `*.vercel.app`) to `NEXT_PUBLIC_SITE_URL` and recovers OAuth codes sent to `/` by forwarding them to `/auth/callback`.

### Local development checklist

1. Run the app at `http://localhost:3000` (not the Vercel URL).
2. Open **Sign in** on localhost (`/login`).
3. Confirm Supabase **Redirect URLs** include `http://localhost:3000/**`.
4. Google Cloud **Authorized redirect URIs** stay as  
   `https://aobxhqhgsahmcssledmq.supabase.co/auth/v1/callback` only (do not put localhost in Google).

3. Run the migration `20260602120000_user_profiles_and_messages.sql` (or apply via Supabase CLI).

## Email (Resend) — community listings

Contact messages on **community** listings are emailed via [Resend](https://resend.com).

Add to `.env.local` and Vercel (required for email to work):

- `RESEND_API_KEY` — from Resend dashboard
- `RESEND_FROM_EMAIL` — verified sender, e.g. `Berlin Musician Listings <notifications@yourdomain.com>`
- `NEXT_PUBLIC_SITE_URL` — production URL for links in emails (e.g. `https://berlinbandhub.de`)
- `SUPABASE_SERVICE_ROLE_KEY` — already needed; used to resolve the listing owner's email

Without `RESEND_API_KEY`, the **Email author** button still appears but sending fails with a clear error.

Apply migration `20260603120000_community_listing_email.sql` for optional `profiles.contact_email`.

## Behaviour

- **Submit listing** requires sign-in (email or Google).
- Community listings store `created_by` = your user id.
- **Email author** appears only on community listings posted on this site.
- Signed-in users send a message; the owner receives HTML email with **Reply-To** set to the sender's account email.
- The sender gets a confirmation copy. Messages also appear under **Profile → Messages**.
- Owners can set **Contact email** on `/profile` (defaults to sign-in email).
- Email links open the listing via `/?listing=<entry-id>`.

## Profile (`/profile`)

- Upload a **profile image** (drag and drop, max 2 MB).
- Add **SoundCloud, YouTube, Bandcamp, Spotify** links.
- Photo and platform icons appear on all listings you post.
- Avatars are stored in the Supabase `avatars` storage bucket (public read).
- **Your listings** on `/profile`: edit or delete community posts you created.
- **Delete account** at the bottom of `/profile`: removes profile, avatar, listings, and auth user (type `DELETE` to confirm). Requires `SUPABASE_SERVICE_ROLE_KEY` on the server.
