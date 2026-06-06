import { LegalPageShell } from "@/components/LegalPageShell";
import { LegalSection } from "@/components/LegalSection";
import { getLegalContactEmail, LEGAL_SERVICE_NAME } from "@/lib/legal-config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum | Berlin Musician Listings",
  description: "Legal notice for Berlin Musician Listings.",
};

/**
 * Impressum (legal notice) page — site name only, no personal operator details.
 */
export default function ImpressumPage() {
  const contactEmail = getLegalContactEmail();

  return (
    <LegalPageShell title="Impressum">
      <p className="text-zinc-600">
        Information pursuant to § 5 TMG (Telemediengesetz) and § 18 MStV.
      </p>

      <LegalSection title="Service provider">
        <p>{LEGAL_SERVICE_NAME}</p>
        <p className="text-zinc-600">
          A musician listing aggregator for Berlin. Community listings are
          posted by registered users; scraped listings are sourced from public
          third-party boards.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        {contactEmail ? (
          <p>
            Email:{" "}
            <a
              href={`mailto:${contactEmail}`}
              className="font-medium text-violet-600 hover:text-violet-800"
            >
              {contactEmail}
            </a>
          </p>
        ) : (
          <p>
            For community listings, use the in-app message feature on a listing.
            For legal enquiries about this website, please use the contact
            options published on the site when available.
          </p>
        )}
      </LegalSection>

      <LegalSection title="Responsible for content (§ 18 Abs. 2 MStV)">
        <p>{LEGAL_SERVICE_NAME}</p>
      </LegalSection>

      <LegalSection title="Liability for content">
        <p>
          We compile publicly available musician listings from third-party
          boards. We do not guarantee completeness, accuracy, or timeliness of
          aggregated content. Obligations to remove or block use of information
          under general law remain unaffected.
        </p>
      </LegalSection>

      <LegalSection title="Liability for links">
        <p>
          This site contains links to external websites. We have no influence
          over their content and assume no liability. The respective provider is
          responsible for linked pages.
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
