import Link from "next/link";
import { FaqItem } from "@/components/FaqItem";
import { LegalPageShell } from "@/components/LegalPageShell";
import { LegalSection } from "@/components/LegalSection";
import { getLegalContactEmail, LEGAL_SERVICE_NAME } from "@/lib/legal-config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Häufige Fragen",
  description:
    "So funktioniert Berlin Bandhub: Musiker und Bands in Berlin finden, Community-Inserate schalten, Autorinnen und Autoren kontaktieren und mehr.",
};

/**
 * Häufig gestellte Fragen zur Nutzung von Berlin Bandhub.
 */
export default function FaqPage() {
  const contactEmail = getLegalContactEmail();

  return (
    <LegalPageShell title="Häufige Fragen">
      <p className="text-zinc-600">
        {LEGAL_SERVICE_NAME} ({" "}
        <Link href="/" className="font-medium text-violet-600 hover:text-violet-800">
          berlinbandhub.de
        </Link>
        ) hilft dir, Musikerinnen, Musiker, Bands und Mitspieler in Berlin zu
        finden. Unten findest du Antworten auf häufige Fragen zum Stöbern,
        Veröffentlichen und Kontaktieren.
      </p>

      <LegalSection title="Über die Seite">
        <FaqItem question="Was ist Berlin Bandhub?">
          <p>
            Es ist ein Suchverzeichnis für Musiker- und Band-Inserate in Berlin.
            Wir sammeln öffentliche Beiträge von Plattformen wie Noisy Rooms,
            Backstage PRO, Berlin Musiker, Musiker-sucht, Bandmix und mukken und
            hosten außerdem <strong>Community-Inserate</strong>, die direkt auf
            dieser Seite veröffentlicht werden.
          </p>
        </FaqItem>

        <FaqItem question="Ist die Nutzung kostenlos?">
          <p>
            Ja. Das Durchsuchen und Stöbern in Inseraten ist kostenlos. Ein
            Konto anzulegen und ein Community-Inserat zu veröffentlichen ist
            ebenfalls kostenlos.
          </p>
        </FaqItem>

        <FaqItem question="Was ist der Unterschied zwischen aggregierten und Community-Inseraten?">
          <p>
            <strong>Aggregierte Inserate</strong> werden von externen
            Musiker-Boards importiert. Sie verlinken zum Originalbeitrag, damit
            du die Autorin oder den Autor dort kontaktieren kannst.
          </p>
          <p>
            <strong>Community-Inserate</strong> werden hier von angemeldeten
            Mitgliedern veröffentlicht. Sie erscheinen mit einem
            Community-Badge und können über die Funktion{" "}
            <strong>Autor per E-Mail kontaktieren</strong> angeschrieben werden.
          </p>
        </FaqItem>

        <FaqItem question="Wie oft werden Inserate aktualisiert?">
          <p>
            Externe Boards werden regelmäßig von einem automatisierten Scraper
            aktualisiert. Community-Inserate erscheinen sofort nach der
            Veröffentlichung. Nutze die Sortierung{" "}
            <strong>Neueste zuerst</strong> und die Zeiträume, um aktuelle
            Beiträge zu sehen.
          </p>
        </FaqItem>
      </LegalSection>

      <LegalSection title="Suchen und Stöbern">
        <FaqItem question="Wie finde ich Musiker oder Bands in Berlin?">
          <p>
            Nutze die Suchleiste und Filter auf der{" "}
            <Link href="/" className="font-medium text-violet-600 hover:text-violet-800">
              Startseite
            </Link>
            . Du kannst nach Board, Genre, Inseratstyp (Band sucht Musiker oder
            Musiker sucht Band) und Zeitraum filtern.
          </p>
        </FaqItem>

        <FaqItem question="Kann ich in beliebiger Reihenfolge suchen?">
          <p>
            Ja. Die Suche findet Wörter in beliebiger Reihenfolge – Anfragen wie{" "}
            <em>drummer metal berlin</em> und <em>berlin metal drummer</em>
            funktionieren beide.
          </p>
        </FaqItem>

        <FaqItem question="Was bedeuten die Inseratstypen?">
          <p>
            <strong>Band sucht Musiker</strong> — eine Band oder ein Projekt
            sucht ein Mitglied (z. B. Sängerin, Schlagzeuger).
          </p>
          <p>
            <strong>Musiker sucht Band</strong> — eine Einzelperson sucht eine
            Band oder eine Zusammenarbeit.
          </p>
        </FaqItem>
      </LegalSection>

      <LegalSection title="Inserat veröffentlichen">
        <FaqItem question="Wie veröffentliche ich mein eigenes Inserat?">
          <p>
            <Link
              href="/login"
              className="font-medium text-violet-600 hover:text-violet-800"
            >
              Melde dich an
            </Link>{" "}
            per E-Mail oder Google an und gehe dann zu{" "}
            <Link
              href="/submit"
              className="font-medium text-violet-600 hover:text-violet-800"
            >
              Inserat veröffentlichen
            </Link>
            . Füge Titel, Beschreibung, Genres und optional einen Kontaktlink
            hinzu.
          </p>
        </FaqItem>

        <FaqItem question="Brauche ich ein Konto zum Veröffentlichen?">
          <p>
            Ja. Community-Inserate sind mit deinem Konto verknüpft, damit andere
            Mitglieder dir schreiben können und du deine Beiträge unter{" "}
            <Link
              href="/profile"
              className="font-medium text-violet-600 hover:text-violet-800"
            >
              Profil
            </Link>{" "}
            verwalten kannst.
          </p>
        </FaqItem>

        <FaqItem question="Kann ich mein Inserat später bearbeiten oder löschen?">
          <p>
            Ja. Öffne{" "}
            <Link
              href="/profile"
              className="font-medium text-violet-600 hover:text-violet-800"
            >
              Profil
            </Link>
            , um von dir veröffentlichte Inserate zu bearbeiten oder zu
            entfernen.
          </p>
        </FaqItem>
      </LegalSection>

      <LegalSection title="Kontakt aufnehmen">
        <FaqItem question="Wie kontaktiere ich jemanden zu einem Inserat?">
          <p>
            Bei <strong>aggregierten Inseraten</strong> klicke auf{" "}
            <strong>Original-Inserat ansehen</strong>, um das Quell-Board zu
            öffnen und die Autorin oder den Autor dort zu kontaktieren.
          </p>
          <p>
            Bei <strong>Community-Inseraten</strong> melde dich an und klicke
            auf <strong>Autor per E-Mail kontaktieren</strong>. Deine Nachricht
            wird per E-Mail versendet; die Autorin oder der Autor kann direkt
            auf deine Konto-E-Mail antworten.
          </p>
        </FaqItem>

        <FaqItem question='Warum gibt es bei manchen Inseraten keinen Button „Autor per E-Mail kontaktieren"?'>
          <p>
            Nur Community-Inserate auf dieser Seite unterstützen Nachrichten
            über die App. Gescrapte Inserate von externen Boards müssen auf der
            Originalseite kontaktiert werden. Manche Community-Inserate haben
            auch keinen Kontakt-Button, wenn die Autorin oder der Autor keine
            Kontakt-E-Mail im Profil hinterlegt hat.
          </p>
        </FaqItem>

        <FaqItem question="Wohin gehen Antworten, wenn mir jemand schreibt?">
          <p>
            Antworten gehen an die <strong>Kontakt-E-Mail</strong> in deinem
            Profil (standardmäßig deine Anmelde-E-Mail). Du kannst sie unter{" "}
            <Link
              href="/profile"
              className="font-medium text-violet-600 hover:text-violet-800"
            >
              Profil → Kontakt-E-Mail
            </Link>{" "}
            ändern. Eingehende Nachrichten erscheinen auch unter{" "}
            <strong>Profil → Nachrichten</strong>.
          </p>
        </FaqItem>
      </LegalSection>

      <LegalSection title="Konto und Profil">
        <FaqItem question="Was kann ich in meinem Profil angeben?">
          <p>
            Anzeigename, Profilfoto, Kontakt-E-Mail und Links zu SoundCloud,
            YouTube, Bandcamp oder Spotify. Dein Profil wird bei Inseraten
            angezeigt, die du veröffentlichst.
          </p>
        </FaqItem>

        <FaqItem question="Wie lösche ich mein Konto?">
          <p>
            Gehe zu{" "}
            <Link
              href="/profile"
              className="font-medium text-violet-600 hover:text-violet-800"
            >
              Profil
            </Link>{" "}
            und nutze die Kontolöschung im Gefahrenbereich. Dadurch werden dein
            Konto, deine Inserate und deine Profildaten dauerhaft entfernt.
          </p>
        </FaqItem>
      </LegalSection>

      <LegalSection title="Datenschutz und Rechtliches">
        <FaqItem question="Welche Daten werden erhoben?">
          <p>
            Details zu Kontodaten, Cookies und der Verarbeitung von Inseraten
            findest du in unserer{" "}
            <Link
              href="/datenschutz"
              className="font-medium text-violet-600 hover:text-violet-800"
            >
              Datenschutzerklärung
            </Link>
            .
          </p>
        </FaqItem>

        <FaqItem question="Wie melde ich ein Problem oder stelle eine rechtliche Frage?">
          <p>
            {contactEmail ? (
              <>
                Schreib uns an{" "}
                <a
                  href={`mailto:${contactEmail}`}
                  className="font-medium text-violet-600 hover:text-violet-800"
                >
                  {contactEmail}
                </a>
                . Angaben zum Betreiber findest du im{" "}
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
                Nutze die Kontaktmöglichkeiten im{" "}
                <Link
                  href="/impressum"
                  className="font-medium text-violet-600 hover:text-violet-800"
                >
                  Impressum
                </Link>
                , sobald sie verfügbar sind.
              </>
            )}
          </p>
        </FaqItem>
      </LegalSection>
    </LegalPageShell>
  );
}
