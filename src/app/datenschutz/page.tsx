import Link from "next/link";
import { LegalPageShell } from "@/components/LegalPageShell";
import { LegalSection } from "@/components/LegalSection";
import {
  getLegalContactEmail,
  LEGAL_SERVICE_NAME,
} from "@/lib/legal-config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Berlin Musician Listings",
  description:
    "Privacy policy for Berlin Musician Listings — data we process and your rights.",
};

/**
 * Privacy policy (Datenschutzerklärung) for GDPR compliance.
 */
export default function PrivacyPage() {
  const contactEmail = getLegalContactEmail();

  return (
    <LegalPageShell title="Privacy Policy">
      <p className="text-zinc-600">Last updated: June 2026</p>

      <LegalSection title="1. Controller">
        <p>{LEGAL_SERVICE_NAME}</p>
        {contactEmail ? (
          <p>
            Contact:{" "}
            <a
              href={`mailto:${contactEmail}`}
              className="font-medium text-violet-600 hover:text-violet-800"
            >
              {contactEmail}
            </a>
          </p>
        ) : null}
      </LegalSection>

      <LegalSection title="2. What this site does">
        <p>
          Berlin Musician Listings aggregates publicly visible musician and band
          listings from external boards and lets signed-in users post community
          listings. We do not sell personal data.
        </p>
      </LegalSection>

      <LegalSection title="3. Data we process">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Account data</strong> — email address and profile details
            you provide when you sign up (via Supabase Auth, including optional
            Google sign-in).
          </li>
          <li>
            <strong>Community listings</strong> — title, description, genres,
            optional contact links, and avatar you upload.
          </li>
          <li>
            <strong>Messages</strong> — when you contact a community listing
            author, we store the message and send email via Resend.
          </li>
          <li>
            <strong>Technical data</strong> — IP address, browser type, and
            request logs processed by our host (Vercel) for security and
            operation.
          </li>
          <li>
            <strong>Scraped listings</strong> — text and metadata already
            published on third-party musician boards; no additional personal
            data is collected beyond what those sites publish.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Purposes and legal bases">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Providing the search and listing service (Art. 6(1)(b) GDPR —
            contract / pre-contractual steps).
          </li>
          <li>
            Sending contact messages you request (Art. 6(1)(b) GDPR).
          </li>
          <li>
            Securing and operating the website (Art. 6(1)(f) GDPR — legitimate
            interest).
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Processors and third parties">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Supabase</strong> — authentication and database hosting.
          </li>
          <li>
            <strong>Vercel</strong> — website hosting.
          </li>
          <li>
            <strong>Resend</strong> — transactional email for community listing
            messages.
          </li>
          <li>
            <strong>Google</strong> — optional OAuth sign-in (if you choose it).
          </li>
        </ul>
        <p>
          Each provider processes data under its own privacy policy. Data may be
          processed outside the EU where providers use standard contractual
          clauses or equivalent safeguards.
        </p>
      </LegalSection>

      <LegalSection title="6. Cookies and local storage">
        <p>
          We use essential cookies and browser storage for sign-in sessions
          (Supabase Auth). We do not use advertising or analytics cookies.
        </p>
      </LegalSection>

      <LegalSection title="7. Retention">
        <p>
          Account and listing data remain until you delete listings or your
          account. Server logs are retained according to our host&apos;s
          policies. Messages sent to listing authors are stored so authors can
          read them in their profile inbox.
        </p>
      </LegalSection>

      <LegalSection title="8. Your rights">
        <p>
          Under the GDPR you may request access, rectification, erasure,
          restriction, portability, and object to processing. You may also
          lodge a complaint with a supervisory authority.
          {contactEmail ? (
            <>
              {" "}
              Contact:{" "}
              <a
                href={`mailto:${contactEmail}`}
                className="font-medium text-violet-600 hover:text-violet-800"
              >
                {contactEmail}
              </a>
            </>
          ) : (
            <>
              {" "}
              See our{" "}
              <Link
                href="/impressum"
                className="font-medium text-violet-600 hover:text-violet-800"
              >
                Impressum
              </Link>
              .
            </>
          )}
        </p>
        <p>
          Signed-in users can delete individual community listings and their
          entire account from the{" "}
          <Link
            href="/profile"
            className="font-medium text-violet-600 hover:text-violet-800"
          >
            profile page
          </Link>
          .
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
