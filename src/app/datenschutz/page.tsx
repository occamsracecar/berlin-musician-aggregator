import Link from "next/link";
import { LegalPageShell } from "@/components/LegalPageShell";
import { LegalSection } from "@/components/LegalSection";
import {
  getLegalContactEmail,
  LEGAL_OPERATOR_NAME,
  LEGAL_PRIVACY_STAND,
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
      <p className="text-zinc-600">Stand: {LEGAL_PRIVACY_STAND}</p>

      <LegalSection title="1. Verantwortlicher">
        <p>
          Verantwortlicher im Sinne der DSGVO ist {LEGAL_OPERATOR_NAME},
          betrieben unter {LEGAL_SERVICE_NAME}.
        </p>
        <p>
          Kontakt:{" "}
          <a
            href={`mailto:${contactEmail}`}
            className="font-medium text-violet-600 hover:text-violet-800"
          >
            {contactEmail}
          </a>
        </p>
        <p className="text-zinc-600">
          Es wird keine postalische Anschrift veröffentlicht. Für
          Datenschutzanfragen, Auskunft und Löschung reicht die E-Mail.
        </p>
      </LegalSection>

      <LegalSection title="2. Was diese Seite macht">
        <p>
          {LEGAL_SERVICE_NAME} ist ein privates, nicht-kommerzielles Angebot.
          Die Seite sammelt öffentlich sichtbare Musiker- und Band-Inserate von
          externen Boards und ermöglicht angemeldeten Nutzerinnen und Nutzern,
          Community-Inserate zu veröffentlichen. Wir verkaufen keine
          personenbezogenen Daten und schalten keine Werbung.
        </p>
      </LegalSection>

      <LegalSection title="3. Verarbeitete Daten">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Kontodaten</strong> — E-Mail-Adresse und Passwort-Hash
            (Supabase Auth), optional Google-Konto-Daten, wenn du dich mit
            Google anmeldest.
          </li>
          <li>
            <strong>Profil</strong> — Anzeigename, Kontakt-E-Mail, Avatar und
            optionale Links zu SoundCloud, YouTube, Bandcamp oder Spotify.
            Diese Angaben erscheinen öffentlich bei deinen Community-Inseraten.
          </li>
          <li>
            <strong>Community-Inserate</strong> — Titel, Beschreibung, Genres,
            Inserattyp und optionale Kontaktlinks.
          </li>
          <li>
            <strong>Nachrichten</strong> — Text, Absender und Zeitpunkt, wenn
            du eine Autorin oder einen Autor eines Community-Inserats
            kontaktierst. Wir speichern die Nachricht und versenden E-Mail über
            Resend.
          </li>
          <li>
            <strong>Technische Daten</strong> — IP-Adresse, Browsertyp und
            Anfrageprotokolle, die Hosts zu Sicherheit und Betrieb verarbeiten.
          </li>
          <li>
            <strong>Gescrapte Inserate</strong> — Text und Metadaten, die
            bereits öffentlich auf Drittanbieter-Musiker-Boards stehen. Es
            werden keine zusätzlichen personenbezogenen Daten über das hinaus
            erhoben, was diese Seiten veröffentlichen.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Zwecke und Rechtsgrundlagen">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Konto, Community-Inserate und Nachrichten — Art. 6 Abs. 1 lit. b
            DSGVO (Vertrag bzw. vorvertragliche Maßnahmen).
          </li>
          <li>
            Betrieb, Sicherheit und Missbrauchsabwehr der Website — Art. 6 Abs.
            1 lit. f DSGVO (berechtigtes Interesse).
          </li>
          <li>
            Darstellung bereits öffentlicher Inserate von Musikerbörsen in einer
            Berlin-Suche — Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse):
            ein kostenloses Verzeichnis schon veröffentlichter Anzeigen, mit
            Quellenangabe und Link zur Originalseite. Eine individuelle
            Information jeder betroffenen Person nach Art. 14 DSGVO ist
            unverhältnismäßig (Art. 14 Abs. 5 lit. b), weil uns keine
            Kontaktdaten jenseits der öffentlichen Anzeige vorliegen. Betroffene
            können Widerspruch und Löschung per E-Mail verlangen (siehe
            Abschnitt 9).
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Auftragsverarbeiter und Drittlandtransfer">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Supabase Inc.</strong> (USA; Hosting u. a. in der EU) —
            Authentifizierung, Datenbank und Avatare.{" "}
            <a
              href="https://supabase.com/privacy"
              className="font-medium text-violet-600 hover:text-violet-800"
            >
              Datenschutz
            </a>
            ,{" "}
            <a
              href="https://supabase.com/legal/dpa"
              className="font-medium text-violet-600 hover:text-violet-800"
            >
              AVV / DPA
            </a>
          </li>
          <li>
            <strong>Vercel Inc.</strong> (USA; Edge/Hosting auch in der EU) —
            Website-Hosting und Serverprotokolle.{" "}
            <a
              href="https://vercel.com/legal/privacy-policy"
              className="font-medium text-violet-600 hover:text-violet-800"
            >
              Datenschutz
            </a>
            ,{" "}
            <a
              href="https://vercel.com/legal/dpa"
              className="font-medium text-violet-600 hover:text-violet-800"
            >
              AVV / DPA
            </a>
          </li>
          <li>
            <strong>Plus Five Five, Inc. (Resend)</strong> (USA) — Versand der
            Kontakt-E-Mails zu Community-Inseraten.{" "}
            <a
              href="https://resend.com/legal/privacy-policy"
              className="font-medium text-violet-600 hover:text-violet-800"
            >
              Datenschutz
            </a>
            ,{" "}
            <a
              href="https://resend.com/legal/dpa"
              className="font-medium text-violet-600 hover:text-violet-800"
            >
              AVV / DPA
            </a>
          </li>
          <li>
            <strong>Google LLC</strong> (USA) — nur wenn du „Mit Google
            fortfahren“ wählst. Google handelt dabei als eigener
            Verantwortlicher für den Login.{" "}
            <a
              href="https://policies.google.com/privacy"
              className="font-medium text-violet-600 hover:text-violet-800"
            >
              Datenschutz
            </a>
          </li>
        </ul>
        <p>
          Soweit diese Stellen personenbezogene Daten in den USA oder anderen
          Drittländern verarbeiten und kein Angemessenheitsbeschluss gilt,
          erfolgt der Transfer über Standardvertragsklauseln (Art. 46 DSGVO),
          die in den jeweiligen AVV/DPA enthalten sind.
        </p>
      </LegalSection>

      <LegalSection title="6. Cookies und lokaler Speicher">
        <p>
          Wir setzen keine Werbe- oder Analyse-Cookies ein (kein Google
          Analytics, kein Tracking-Pixel). Board-Icons werden von dieser
          Website selbst ausgeliefert, nicht von Google.
        </p>
        <p>
          <strong>Notwendige Cookies:</strong> Nach der Anmeldung setzt
          Supabase sitzungsbezogene Cookies (typisch{" "}
          <code className="rounded bg-zinc-100 px-1">sb-*-auth-token</code>
          ), damit du eingeloggt bleibst. Rechtsgrundlage ist § 25 Abs. 2 TDDDG
          (unbedingt erforderlich) zusammen mit Art. 6 Abs. 1 lit. b DSGVO.
          Ohne diese Cookies funktioniert das Konto nicht. Es gibt deshalb
          kein Einwilligungs-Banner. Vor dem ersten Community-Inserat speichern
          wir außerdem ein Cookie (
          <code className="rounded bg-zinc-100 px-1">
            bbh_first_profile_seen
          </code>
          ), wenn du den Profil-Hinweis überspringst oder aufrufst, damit er
          nicht erneut erscheint.
        </p>
      </LegalSection>

      <LegalSection title="7. Speicherdauer">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Konto, Profil und Community-Inserate — bis du sie löschst oder das
            Konto auf der{" "}
            <Link
              href="/profile"
              className="font-medium text-violet-600 hover:text-violet-800"
            >
              Profilseite
            </Link>{" "}
            entfernst.
          </li>
          <li>
            Nachrichten — bis das zugehörige Inserat oder Konto gelöscht wird,
            oder auf Anfrage früher.
          </li>
          <li>
            Gescrapte Inserate — solange sie auf der Quellseite öffentlich
            sind bzw. bis zu einem berechtigten Löschverlangen.
          </li>
          <li>
            Serverprotokolle — nach den Aufbewahrungsfristen von Vercel und
            Supabase (in der Regel wenige Tage bis Wochen).
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="8. Deine Rechte">
        <p>
          Du kannst Auskunft, Berichtigung, Löschung, Einschränkung,
          Datenübertragbarkeit und Widerspruch gegen Verarbeitungen auf
          berechtigtem Interesse verlangen (Art. 15–21 DSGVO). Schreib an{" "}
          <a
            href={`mailto:${contactEmail}`}
            className="font-medium text-violet-600 hover:text-violet-800"
          >
            {contactEmail}
          </a>
          .
        </p>
        <p>
          Angemeldete Nutzerinnen und Nutzer können Community-Inserate und das
          gesamte Konto selbst auf der{" "}
          <Link
            href="/profile"
            className="font-medium text-violet-600 hover:text-violet-800"
          >
            Profilseite
          </Link>{" "}
          löschen.
        </p>
        <p>
          Du kannst Beschwerde bei einer Aufsichtsbehörde einlegen. Zuständig
          für Berlin ist die Berliner Beauftragte für Datenschutz und
          Informationsfreiheit (BlnBDI),{" "}
          <a
            href="https://www.datenschutz-berlin.de/"
            className="font-medium text-violet-600 hover:text-violet-800"
          >
            datenschutz-berlin.de
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="9. Löschung gescrapter Inserate">
        <p>
          Steht dein öffentliches Inserat von einer anderen Musikerbörse hier
          und du möchtest es entfernen, schreib an{" "}
          <a
            href={`mailto:${contactEmail}`}
            className="font-medium text-violet-600 hover:text-violet-800"
          >
            {contactEmail}
          </a>{" "}
          mit dem Link zu diesem Eintrag oder zur Originalanzeige. Wir prüfen
          das und nehmen den Eintrag dann aus dem Verzeichnis.
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
