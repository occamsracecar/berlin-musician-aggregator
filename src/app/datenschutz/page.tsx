import Link from "next/link";
import { LegalPageShell } from "@/components/LegalPageShell";
import { LegalSection } from "@/components/LegalSection";
import {
  getLegalContactEmail,
  LEGAL_SERVICE_NAME,
} from "@/lib/legal-config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description: `Datenschutzerklärung für ${LEGAL_SERVICE_NAME} — welche Daten wir verarbeiten und welche Rechte du hast.`,
};

/**
 * Datenschutzerklärung zur Einhaltung der DSGVO.
 */
export default function PrivacyPage() {
  const contactEmail = getLegalContactEmail();

  return (
    <LegalPageShell title="Datenschutzerklärung">
      <p className="text-zinc-600">Stand: Juni 2026</p>

      <LegalSection title="1. Verantwortlicher">
        <p>{LEGAL_SERVICE_NAME}</p>
        {contactEmail ? (
          <p>
            Kontakt:{" "}
            <a
              href={`mailto:${contactEmail}`}
              className="font-medium text-violet-600 hover:text-violet-800"
            >
              {contactEmail}
            </a>
          </p>
        ) : null}
      </LegalSection>

      <LegalSection title="2. Was diese Seite macht">
        <p>
          {LEGAL_SERVICE_NAME} sammelt öffentlich sichtbare Musiker- und
          Band-Inserate von externen Boards und ermöglicht angemeldeten
          Nutzerinnen und Nutzern, Community-Inserate zu veröffentlichen. Wir
          verkaufen keine personenbezogenen Daten.
        </p>
      </LegalSection>

      <LegalSection title="3. Verarbeitete Daten">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Kontodaten</strong> — E-Mail-Adresse und Profilangaben, die
            du bei der Registrierung angibst (über Supabase Auth, optional auch
            per Google-Anmeldung).
          </li>
          <li>
            <strong>Community-Inserate</strong> — Titel, Beschreibung, Genres,
            optionale Kontaktlinks und hochgeladenes Profilbild.
          </li>
          <li>
            <strong>Nachrichten</strong> — wenn du eine Autorin oder einen
            Autor eines Community-Inserats kontaktierst, speichern wir die
            Nachricht und versenden E-Mail über Resend.
          </li>
          <li>
            <strong>Technische Daten</strong> — IP-Adresse, Browsertyp und
            Anfrageprotokolle, die unser Host (Vercel) zu Sicherheit und Betrieb
            verarbeitet.
          </li>
          <li>
            <strong>Gescrapte Inserate</strong> — Text und Metadaten, die
            bereits auf Drittanbieter-Musiker-Boards veröffentlicht sind; es
            werden keine zusätzlichen personenbezogenen Daten über das hinaus
            erhoben, was diese Seiten veröffentlichen.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Zwecke und Rechtsgrundlagen">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Bereitstellung des Such- und Inseratdienstes (Art. 6 Abs. 1 lit. b
            DSGVO — Vertrag bzw. vorvertragliche Maßnahmen).
          </li>
          <li>
            Versand von Kontaktnachrichten auf deine Anfrage (Art. 6 Abs. 1
            lit. b DSGVO).
          </li>
          <li>
            Absicherung und Betrieb der Website (Art. 6 Abs. 1 lit. f DSGVO —
            berechtigtes Interesse).
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Auftragsverarbeiter und Dritte">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Supabase</strong> — Authentifizierung und Datenbank-Hosting.
          </li>
          <li>
            <strong>Vercel</strong> — Website-Hosting.
          </li>
          <li>
            <strong>Resend</strong> — Transaktions-E-Mails für
            Community-Inserat-Nachrichten.
          </li>
          <li>
            <strong>Google</strong> — optionale OAuth-Anmeldung (wenn du sie
            wählst).
          </li>
        </ul>
        <p>
          Jeder Anbieter verarbeitet Daten nach seiner eigenen
          Datenschutzerklärung. Daten können außerhalb der EU verarbeitet
          werden, sofern Anbieter Standardvertragsklauseln oder gleichwertige
          Schutzmaßnahmen nutzen.
        </p>
      </LegalSection>

      <LegalSection title="6. Cookies und lokaler Speicher">
        <p>
          Wir verwenden notwendige Cookies und Browserspeicher für
          Anmeldesitzungen (Supabase Auth). Wir setzen keine Werbe- oder
          Analyse-Cookies ein.
        </p>
      </LegalSection>

      <LegalSection title="7. Speicherdauer">
        <p>
          Konto- und Inseratdaten bleiben gespeichert, bis du Inserate oder dein
          Konto löschst. Serverprotokolle werden gemäß den Richtlinien unseres
          Hosts aufbewahrt. An Autorinnen und Autoren gesendete Nachrichten
          werden gespeichert, damit sie im Profil-Posteingang gelesen werden
          können.
        </p>
      </LegalSection>

      <LegalSection title="8. Deine Rechte">
        <p>
          Nach der DSGVO kannst du Auskunft, Berichtigung, Löschung,
          Einschränkung, Datenübertragbarkeit verlangen und der Verarbeitung
          widersprechen. Du kannst außerdem Beschwerde bei einer
          Aufsichtsbehörde einlegen.
          {contactEmail ? (
            <>
              {" "}
              Kontakt:{" "}
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
              Siehe unser{" "}
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
          Angemeldete Nutzerinnen und Nutzer können einzelne Community-Inserate
          und das gesamte Konto auf der{" "}
          <Link
            href="/profile"
            className="font-medium text-violet-600 hover:text-violet-800"
          >
            Profilseite
          </Link>{" "}
          löschen.
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
