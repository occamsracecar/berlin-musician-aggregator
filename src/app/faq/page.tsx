import Link from "next/link";
import { FaqItem } from "@/components/FaqItem";
import { LegalPageShell } from "@/components/LegalPageShell";
import { LegalSection } from "@/components/LegalSection";
import { getLegalContactEmail, LEGAL_SERVICE_NAME } from "@/lib/legal-config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "How Berlin Musician Listings works: search musicians and bands in Berlin, post community listings, contact authors, and more.",
};

/**
 * Frequently asked questions about using Berlin Musician Listings.
 */
export default function FaqPage() {
  const contactEmail = getLegalContactEmail();

  return (
    <LegalPageShell title="Frequently asked questions">
      <p className="text-zinc-600">
        {LEGAL_SERVICE_NAME} ({" "}
        <Link href="/" className="font-medium text-violet-600 hover:text-violet-800">
          berlinbandhub.de
        </Link>
        ) helps you find musicians, bands, and collaborators in Berlin. Below
        are answers to common questions about browsing, posting, and contacting
        people.
      </p>

      <LegalSection title="About the site">
        <FaqItem question="What is Berlin Musician Listings?">
          <p>
            It is a search directory for musician and band listings in Berlin.
            We aggregate public posts from boards such as Noisy Rooms, Backstage
            PRO, Berlin Musiker, Musiker-sucht, and Bandmix, and we also host{" "}
            <strong>community listings</strong> posted directly on this site.
          </p>
        </FaqItem>

        <FaqItem question="Is it free to use?">
          <p>
            Yes. Browsing and searching listings is free. Creating an account
            and posting a community listing is also free.
          </p>
        </FaqItem>

        <FaqItem question="What is the difference between aggregated and community listings?">
          <p>
            <strong>Aggregated listings</strong> are imported from external
            musician boards. They link back to the original post so you can
            contact the author on that site.
          </p>
          <p>
            <strong>Community listings</strong> are posted here by signed-in
            members. They appear with a community badge and can be contacted
            through the in-app <strong>Email author</strong> feature.
          </p>
        </FaqItem>

        <FaqItem question="How often are listings updated?">
          <p>
            External boards are refreshed regularly by an automated scraper.
            Community listings appear as soon as they are published. Use the{" "}
            <strong>Newest first</strong> sort and time filters to see recent
            posts.
          </p>
        </FaqItem>
      </LegalSection>

      <LegalSection title="Searching and browsing">
        <FaqItem question="How do I find musicians or bands in Berlin?">
          <p>
            Use the search bar and filters on the{" "}
            <Link href="/" className="font-medium text-violet-600 hover:text-violet-800">
              browse page
            </Link>
            . You can filter by board, genre, listing type (band seeking musician
            or musician seeking band), and date range.
          </p>
        </FaqItem>

        <FaqItem question="Can I search in any order?">
          <p>
            Yes. Search matches words in any order, so queries like{" "}
            <em>drummer metal berlin</em> and <em>berlin metal drummer</em> both
            work.
          </p>
        </FaqItem>

        <FaqItem question="What do the listing types mean?">
          <p>
            <strong>Band looking for musician</strong> — a band or project
            searching for a member (e.g. vocalist, drummer).
          </p>
          <p>
            <strong>Musician looking for band</strong> — an individual searching
            for a band or collaboration.
          </p>
        </FaqItem>
      </LegalSection>

      <LegalSection title="Posting a listing">
        <FaqItem question="How do I post my own listing?">
          <p>
            <Link
              href="/login"
              className="font-medium text-violet-600 hover:text-violet-800"
            >
              Sign in
            </Link>{" "}
            with email or Google, then go to{" "}
            <Link
              href="/submit"
              className="font-medium text-violet-600 hover:text-violet-800"
            >
              Submit a listing
            </Link>
            . Add a title, description, genres, and optional contact link.
          </p>
        </FaqItem>

        <FaqItem question="Do I need an account to post?">
          <p>
            Yes. Community listings are tied to your account so other members
            can message you and you can manage your posts under{" "}
            <Link
              href="/profile"
              className="font-medium text-violet-600 hover:text-violet-800"
            >
              Profile
            </Link>
            .
          </p>
        </FaqItem>

        <FaqItem question="Can I edit or delete my listing later?">
          <p>
            Yes. Open{" "}
            <Link
              href="/profile"
              className="font-medium text-violet-600 hover:text-violet-800"
            >
              Profile
            </Link>{" "}
            to edit or remove listings you have posted.
          </p>
        </FaqItem>
      </LegalSection>

      <LegalSection title="Contacting people">
        <FaqItem question="How do I contact someone about a listing?">
          <p>
            For <strong>aggregated listings</strong>, click{" "}
            <strong>View original listing</strong> to open the source board and
            contact the author there.
          </p>
          <p>
            For <strong>community listings</strong>, sign in and click{" "}
            <strong>Email author</strong>. Your message is sent by email; the
            author can reply directly to your account email.
          </p>
        </FaqItem>

        <FaqItem question="Why is there no Email author button on some listings?">
          <p>
            Only community listings posted on this site support in-app messaging.
            Scraped listings from external boards must be contacted on the
            original site. Some community listings may also lack a contact email
            if the author has not set one on their profile.
          </p>
        </FaqItem>

        <FaqItem question="Where do replies go when someone emails me?">
          <p>
            Replies go to the <strong>contact email</strong> on your profile
            (defaults to your sign-in email). You can change it under{" "}
            <Link
              href="/profile"
              className="font-medium text-violet-600 hover:text-violet-800"
            >
              Profile → Contact email
            </Link>
            . Incoming messages also appear under{" "}
            <strong>Profile → Messages</strong>.
          </p>
        </FaqItem>
      </LegalSection>

      <LegalSection title="Account and profile">
        <FaqItem question="What can I add to my profile?">
          <p>
            A display name, profile photo, contact email, and links to SoundCloud,
            YouTube, Bandcamp, or Spotify. Your profile appears on listings you
            post.
          </p>
        </FaqItem>

        <FaqItem question="How do I delete my account?">
          <p>
            Go to{" "}
            <Link
              href="/profile"
              className="font-medium text-violet-600 hover:text-violet-800"
            >
              Profile
            </Link>{" "}
            and use the account deletion option in the danger zone. This
            permanently removes your account, listings, and profile data.
          </p>
        </FaqItem>
      </LegalSection>

      <LegalSection title="Privacy and legal">
        <FaqItem question="What data do you collect?">
          <p>
            See our{" "}
            <Link
              href="/datenschutz"
              className="font-medium text-violet-600 hover:text-violet-800"
            >
              Privacy policy
            </Link>{" "}
            for details on account data, cookies, and how listings are processed.
          </p>
        </FaqItem>

        <FaqItem question="How do I report a problem or ask a legal question?">
          <p>
            {contactEmail ? (
              <>
                Email us at{" "}
                <a
                  href={`mailto:${contactEmail}`}
                  className="font-medium text-violet-600 hover:text-violet-800"
                >
                  {contactEmail}
                </a>
                . For operator details, see{" "}
                <Link
                  href="/impressum"
                  className="font-medium text-violet-600 hover:text-violet-800"
                >
                  Impressum
                </Link>
                .
              </>
            ) : (
              <>
                Use the contact options on our{" "}
                <Link
                  href="/impressum"
                  className="font-medium text-violet-600 hover:text-violet-800"
                >
                  Impressum
                </Link>{" "}
                page when available.
              </>
            )}
          </p>
        </FaqItem>
      </LegalSection>
    </LegalPageShell>
  );
}
