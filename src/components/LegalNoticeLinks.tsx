import Link from "next/link";

type LegalNoticeLinksProps = {
  context: "auth" | "submit";
};

/**
 * Art. 13 notice linking Datenschutz and Nutzungsbedingungen at data collection.
 */
export function LegalNoticeLinks({ context }: LegalNoticeLinksProps) {
  const linkClassName = "font-medium text-violet-600 hover:text-violet-800";

  if (context === "submit") {
    return (
      <p className="text-xs leading-relaxed text-zinc-500">
        Mit dem Veröffentlichen gelten die{" "}
        <Link href="/nutzungsbedingungen" className={linkClassName}>
          Nutzungsbedingungen
        </Link>
        . Hinweise zur Datenverarbeitung stehen in der{" "}
        <Link href="/datenschutz" className={linkClassName}>
          Datenschutzerklärung
        </Link>
        .
      </p>
    );
  }

  return (
    <p className="text-center text-xs leading-relaxed text-zinc-500">
      Mit der Registrierung oder Anmeldung über Google gelten die{" "}
      <Link href="/nutzungsbedingungen" className={linkClassName}>
        Nutzungsbedingungen
      </Link>{" "}
      und die{" "}
      <Link href="/datenschutz" className={linkClassName}>
        Datenschutzerklärung
      </Link>
      .
    </p>
  );
}
