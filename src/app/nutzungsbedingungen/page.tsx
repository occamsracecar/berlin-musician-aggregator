import Link from "next/link";
import { LegalPageShell } from "@/components/LegalPageShell";
import { LegalSection } from "@/components/LegalSection";
import { getLegalContactEmail } from "@/lib/legal-config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use | Berlin Musician Listings",
  description: "Terms of use for Berlin Musician Listings.",
};

/**
 * Terms of use for community listings and aggregated content.
 */
export default function TermsPage() {
  const contactEmail = getLegalContactEmail();

  return (
    <LegalPageShell title="Terms of Use">
      <p className="text-zinc-600">Last updated: June 2026</p>

      <LegalSection title="1. Scope">
        <p>
          These terms apply to your use of Berlin Musician Listings. By creating
          an account or posting a community listing, you agree to them.
        </p>
      </LegalSection>

      <LegalSection title="2. Aggregated listings">
        <p>
          Most listings are collected automatically from public musician boards
          (for example Berlinmusiker, Backstage PRO, Noisy Rooms). We are not the
          publisher of those listings. Links may take you to third-party sites
          with their own terms. We do not guarantee that aggregated information
          is complete, current, or accurate.
        </p>
      </LegalSection>

      <LegalSection title="3. Community listings">
        <p>
          When you submit a listing while signed in, you confirm that you have
          the right to publish the content and that it is lawful. You are
          responsible for what you post, including contact details and links you
          add.
        </p>
        <p>
          Do not post illegal content, spam, hate speech, or misleading
          information. We may remove listings or suspend accounts that violate
          these rules or applicable law.
        </p>
      </LegalSection>

      <LegalSection title="4. Messaging">
        <p>
          The in-app message feature sends email to community listing authors
          via our mail provider. Use it only for genuine enquiries about a
          listing. Misuse may result in account termination.
        </p>
      </LegalSection>

      <LegalSection title="5. Accounts">
        <p>
          Keep your login credentials secure. You may delete your account and
          associated listings at any time from your{" "}
          <Link
            href="/profile"
            className="font-medium text-violet-600 hover:text-violet-800"
          >
            profile
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="6. Availability">
        <p>
          We provide the service &quot;as is&quot; without warranty. We may
          change features, pause scraping, or discontinue the service with
          reasonable notice where possible.
        </p>
      </LegalSection>

      <LegalSection title="7. Liability">
        <p>
          We are liable without limitation for intent and gross negligence, and
          for injury to life, body, or health. Otherwise liability is limited to
          foreseeable, typical damage arising from a material breach of essential
          contractual obligations. Liability for indirect damage and lost profit
          is excluded where permitted by law.
        </p>
      </LegalSection>

      <LegalSection title="8. Contact">
        <p>
          Questions about these terms:{" "}
          {contactEmail ? (
            <a
              href={`mailto:${contactEmail}`}
              className="font-medium text-violet-600 hover:text-violet-800"
            >
              {contactEmail}
            </a>
          ) : (
            <Link
              href="/impressum"
              className="font-medium text-violet-600 hover:text-violet-800"
            >
              Impressum
            </Link>
          )}
          .
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
