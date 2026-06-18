import { LegalPageShell } from "@/components/LegalPageShell";
import { LegalSection } from "@/components/LegalSection";
import { getLegalContactEmail, LEGAL_SERVICE_NAME } from "@/lib/legal-config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum",
  description: `Impressum und rechtliche Angaben zu ${LEGAL_SERVICE_NAME}.`,
};

/**
 * Impressum — nur Seitenname, keine persönlichen Betreiberangaben.
 */
export default function ImpressumPage() {
  const contactEmail = getLegalContactEmail();

  return (
    <LegalPageShell title="Impressum">
      <p className="text-zinc-600">
        Angaben gemäß § 5 TMG (Telemediengesetz) und § 18 MStV.
      </p>

      <LegalSection title="Diensteanbieter">
        <p>{LEGAL_SERVICE_NAME}</p>
        <p className="text-zinc-600">
          Ein Aggregator für Musiker-Inserate in Berlin. Community-Inserate
          werden von registrierten Nutzerinnen und Nutzern veröffentlicht;
          aggregierte Inserate stammen von öffentlichen Drittanbieter-Boards.
        </p>
      </LegalSection>

      <LegalSection title="Kontakt">
        {contactEmail ? (
          <p>
            E-Mail:{" "}
            <a
              href={`mailto:${contactEmail}`}
              className="font-medium text-violet-600 hover:text-violet-800"
            >
              {contactEmail}
            </a>
          </p>
        ) : (
          <p>
            Für Community-Inserate nutze die Nachrichtenfunktion direkt beim
            Inserat. Für rechtliche Anfragen zu dieser Website verwende die
            Kontaktmöglichkeiten, sobald sie auf der Seite veröffentlicht sind.
          </p>
        )}
      </LegalSection>

      <LegalSection title="Verantwortlich für den Inhalt (§ 18 Abs. 2 MStV)">
        <p>{LEGAL_SERVICE_NAME}</p>
      </LegalSection>

      <LegalSection title="Haftung für Inhalte">
        <p>
          Wir stellen öffentlich zugängliche Musiker-Inserate von
          Drittanbieter-Boards zusammen. Für Vollständigkeit, Richtigkeit und
          Aktualität aggregierter Inhalte übernehmen wir keine Gewähr.
          Verpflichtungen zur Entfernung oder Sperrung der Nutzung von
          Informationen nach den allgemeinen Gesetzen bleiben unberührt.
        </p>
      </LegalSection>

      <LegalSection title="Haftung für Links">
        <p>
          Diese Seite enthält Links zu externen Websites. Auf deren Inhalte
          haben wir keinen Einfluss und übernehmen keine Haftung. Für die
          verlinkten Seiten ist jeweils der jeweilige Anbieter verantwortlich.
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
