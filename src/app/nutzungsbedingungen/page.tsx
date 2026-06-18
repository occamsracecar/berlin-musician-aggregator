import Link from "next/link";
import { LegalPageShell } from "@/components/LegalPageShell";
import { LegalSection } from "@/components/LegalSection";
import { getLegalContactEmail, LEGAL_SERVICE_NAME } from "@/lib/legal-config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nutzungsbedingungen",
  description: `Nutzungsbedingungen für ${LEGAL_SERVICE_NAME}.`,
};

/**
 * Nutzungsbedingungen für Community-Inserate und aggregierte Inhalte.
 */
export default function TermsPage() {
  const contactEmail = getLegalContactEmail();

  return (
    <LegalPageShell title="Nutzungsbedingungen">
      <p className="text-zinc-600">Stand: Juni 2026</p>

      <LegalSection title="1. Geltungsbereich">
        <p>
          Diese Nutzungsbedingungen gelten für deine Nutzung von{" "}
          {LEGAL_SERVICE_NAME}. Mit der Kontoerstellung oder Veröffentlichung
          eines Community-Inserats stimmst du ihnen zu.
        </p>
      </LegalSection>

      <LegalSection title="2. Aggregierte Inserate">
        <p>
          Die meisten Inserate werden automatisch von öffentlichen
          Musiker-Boards gesammelt (z. B. Berlinmusiker, Backstage PRO, Noisy
          Rooms). Wir sind nicht Herausgeber dieser Inserate. Links können zu
          Drittanbieter-Seiten mit eigenen Bedingungen führen. Wir garantieren
          nicht, dass aggregierte Informationen vollständig, aktuell oder
          richtig sind.
        </p>
      </LegalSection>

      <LegalSection title="3. Community-Inserate">
        <p>
          Wenn du angemeldet ein Inserat veröffentlichst, bestätigst du, dass
          du berechtigt bist, die Inhalte zu veröffentlichen, und dass sie
          rechtmäßig sind. Du bist für deine Beiträge verantwortlich,
          einschließlich Kontaktdaten und Links.
        </p>
        <p>
          Veröffentliche keine illegalen Inhalte, keinen Spam, keine
          Hassrede und keine irreführenden Angaben. Wir können Inserate
          entfernen oder Konten sperren, die gegen diese Regeln oder geltendes
          Recht verstoßen.
        </p>
      </LegalSection>

      <LegalSection title="4. Nachrichten">
        <p>
          Die Nachrichtenfunktion sendet E-Mails an Autorinnen und Autoren von
          Community-Inseraten über unseren E-Mail-Anbieter. Nutze sie nur für
          echte Anfragen zu einem Inserat. Missbrauch kann zur Sperrung des
          Kontos führen.
        </p>
      </LegalSection>

      <LegalSection title="5. Konten">
        <p>
          Bewahre deine Zugangsdaten sicher auf. Du kannst dein Konto und
          zugehörige Inserate jederzeit in deinem{" "}
          <Link
            href="/profile"
            className="font-medium text-violet-600 hover:text-violet-800"
          >
            Profil
          </Link>{" "}
          löschen.
        </p>
      </LegalSection>

      <LegalSection title="6. Verfügbarkeit">
        <p>
          Wir stellen den Dienst ohne Gewährleistung bereit („wie besehen“). Wir
          können Funktionen ändern, das Scraping pausieren oder den Dienst
          einstellen — soweit möglich mit angemessener Vorankündigung.
        </p>
      </LegalSection>

      <LegalSection title="7. Haftung">
        <p>
          Wir haften unbeschränkt bei Vorsatz und grober Fahrlässigkeit sowie
          bei Verletzung von Leben, Körper oder Gesundheit. Im Übrigen ist die
          Haftung auf vorhersehbare, typische Schäden bei wesentlicher
          Verletzung wesentlicher Vertragspflichten beschränkt. Die Haftung für
          mittelbare Schäden und entgangenen Gewinn ist ausgeschlossen, soweit
          gesetzlich zulässig.
        </p>
      </LegalSection>

      <LegalSection title="8. Kontakt">
        <p>
          Fragen zu diesen Nutzungsbedingungen:{" "}
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
