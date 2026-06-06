# Google Search Console (GSC)

Use GSC to see whether Google is indexing **https://berlinbandhub.de** and how it appears in search.

## 1. Verify the site

1. Open [Google Search Console](https://search.google.com/search-console).
2. **Add property** → choose **URL prefix**: `https://berlinbandhub.de`
3. Pick **HTML tag** verification.
4. Copy the `content` value from the meta tag, e.g.  
   `<meta name="google-site-verification" content="ABC123..." />` → `ABC123...`
5. In **Vercel** → project → **Settings** → **Environment Variables** → Production:

   ```bash
   GOOGLE_SITE_VERIFICATION=ABC123...
   ```

6. **Redeploy** the site.
7. In GSC, click **Verify**.

The app adds the tag via `metadata.verification.google` in `src/app/layout.tsx`.

## 2. Submit the sitemap

After verification:

1. GSC → **Sitemaps** (left menu).
2. Enter: `sitemap.xml`
3. Click **Submit**.

Full URL: **https://berlinbandhub.de/sitemap.xml**

The sitemap includes:

- Homepage and legal pages
- Listing deep links (`/?listing=<id>`) — up to 10,000 newest entries

## 3. Request indexing (optional)

GSC → **URL inspection** → enter `https://berlinbandhub.de` → **Request indexing**.

Do the same for a few listing URLs if you want them crawled sooner.

## 4. What to expect

- **Verification** — usually immediate after redeploy.
- **First impressions in GSC** — often 2–7 days after sitemap submit.
- **Ranking in Google Search** — can take weeks for a new domain; aggregated listing pages compete with source sites.

Check **Pages** → **Indexed** vs **Not indexed** after a few days.

## 5. robots.txt

**https://berlinbandhub.de/robots.txt**

Allows crawling of public pages. Blocks `/login`, `/profile`, `/auth/`, and `/submit`.

## 6. Tips

- Keep **Supabase Site URL** and **NEXT_PUBLIC_SITE_URL** on `https://berlinbandhub.de` so canonical URLs stay consistent.
- In GSC **Settings** → **Users**, add a backup Google account if you use a work email.
- Use **Performance** after ~1 week to see queries and average position.

## Local check

After deploy:

```bash
curl -s https://berlinbandhub.de/robots.txt
curl -s https://berlinbandhub.de/sitemap.xml | head -30
curl -s https://berlinbandhub.de | grep google-site-verification
```
