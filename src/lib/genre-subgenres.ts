import {
  getSubgenrePath,
  normalizeSubgenreSlug,
} from "@/lib/genre-match";
import { getParentGenreBySlug } from "@/lib/genre-pages";

/** Subgenre category page linked under a parent genre. */
export type SubgenrePage = {
  parentSlug: string;
  slug: string;
  name: string;
  keywords: string[];
  title: string;
  metaDescription: string;
  intro: string;
  seoParagraph: string;
};

type SubgenreSeed = {
  slug: string;
  name: string;
  keywords: string[];
  intro: string;
  metaDescription?: string;
  seoParagraph?: string;
};

/**
 * Builds a bottom-of-page SEO paragraph for a subgenre category.
 */
function buildSubgenreSeoParagraph(
  name: string,
  parentGenreTag: string,
): string {
  return `Diese Seite bündelt Musiker- und Band-Inserate für ${name} in Berlin. Im ${parentGenreTag}-Spektrum der Hauptstadt suchen Projekte und Einzelmusiker laufend nach Verstärkung — ob fester Bandplatz, Session-Gig oder neue Kollaboration. Berlin Bandhub sammelt passende Anzeigen aus Musikerbörsen wie Berlin Musiker, Backstage PRO und Noisy Rooms sowie aus der Community und stellt sie hier übersichtlich dar. So findest du schneller Kontakte für dein ${name}-Projekt, ohne jedes Portal einzeln durchsuchen zu müssen.`;
}

/**
 * Builds SEO fields for a subgenre page from its display name.
 */
function buildSubgenreSeo(name: string, intro: string, metaDescription?: string) {
  return {
    title: `${name} – Musiker & Bands in Berlin`,
    metaDescription:
      metaDescription ??
      `Anzeigen für ${name.toLowerCase()} in Berlin: Bands und Musiker auf der Suche nach Projekten und Bandmitgliedern.`,
    intro,
  };
}

/**
 * Creates a validated subgenre page definition under a parent slug.
 */
function createSubgenre(parentSlug: string, seed: SubgenreSeed): SubgenrePage {
  const parent = getParentGenreBySlug(parentSlug);

  if (!parent) {
    throw new Error(`Unknown parent genre slug: ${parentSlug}`);
  }

  const seo = buildSubgenreSeo(seed.name, seed.intro, seed.metaDescription);

  return {
    parentSlug,
    slug: normalizeSubgenreSlug(parentSlug, seed.slug),
    name: seed.name,
    keywords: seed.keywords,
    ...seo,
    seoParagraph:
      seed.seoParagraph ??
      buildSubgenreSeoParagraph(seed.name, parent.genreTag),
  };
}

const ROCK_SUBGENRES: SubgenreSeed[] = [
  {
    slug: "alternative",
    name: "Alternative Rock",
    keywords: ["alternative", "alternative rock"],
    intro:
      "Alternative- und Alt-Rock-Anzeigen in Berlin — indie-orientierte Bands und Musiker auf der Suche nach Kollaborationen abseits des Mainstreams.",
  },
  {
    slug: "classic-rock",
    name: "Classic Rock",
    keywords: ["classic rock"],
    intro:
      "Classic-Rock-Bands und Musiker in Berlin auf der Suche nach Gitarristen, Sängern, Schlagzeugern und weiteren Spielern für rockorientierte Projekte.",
  },
  {
    slug: "psychedelic",
    name: "Psychedelic Rock",
    keywords: ["psychedelic", "psychedelic rock"],
    intro:
      "Psychedelic-Rock-Projekte in Berlin — Bands und Musiker mit Hang zu expansiven, experimentellen oder retro-psychischen Klängen.",
  },
  {
    slug: "shoegaze",
    name: "Shoegaze",
    keywords: ["shoegaze"],
    intro:
      "Shoegaze- und Dream-Pop-orientierte Anzeigen in Berlin. Finde Gitarristen, Sänger und Bands, die nach geschichteten, atmosphärischen Rock-Klängen suchen.",
  },
  {
    slug: "indie-rock",
    name: "Indie Rock",
    keywords: ["indie rock"],
    intro:
      "Indie-Rock-Musiker und Bands in Berlin — kleinere Projekte, DIY-Bands und Kollaborateure, die unabhängige Rock-Line-ups aufbauen.",
  },
  {
    slug: "hard-rock",
    name: "Hard Rock",
    keywords: ["hard rock"],
    intro:
      "Hard-Rock-Bands und Musiker in Berlin auf der Suche nach kraftvollen Stimmen, schweren Gitarren und treibenden Rhythmussektionen.",
  },
  {
    slug: "garage-rock",
    name: "Garage Rock",
    keywords: ["garage rock", "garage"],
    intro:
      "Garage-Rock-Anzeigen in Berlin — rohe, energiegeladene Bands und Musiker auf der Suche nach schnellen, lauten und unkomplizierten Kollaborationen.",
  },
  {
    slug: "post-rock",
    name: "Post-Rock",
    keywords: ["post-rock", "post rock"],
    intro:
      "Post-Rock- und instrumentelle Rock-Projekte in Berlin auf der Suche nach geduldigen, cineastischen oder experimentellen Band-Setups.",
  },
  {
    slug: "rockabilly",
    name: "Rockabilly",
    keywords: ["rockabilly"],
    intro:
      "Rockabilly-Musiker und Bands in Berlin — Kontrabass, twangige Gitarre und vintage Rock-'n'-Roll-Line-ups.",
  },
  {
    slug: "progressive-rock",
    name: "Progressive Rock",
    keywords: ["progressive rock", "prog rock"],
    intro:
      "Progressive-Rock-Anzeigen in Berlin — Musiker mit Interesse an komplexen Arrangements, ungeraden Taktarten und ambitionierten Rock-Projekten.",
  },
];

const METAL_SUBGENRES: SubgenreSeed[] = [
  {
    slug: "heavy-metal",
    name: "Heavy Metal",
    keywords: ["heavy metal"],
    intro:
      "Heavy-Metal-Bands und Musiker in Berlin auf der Suche nach Mitgliedern im klassischen und modernen Metal-Spektrum.",
  },
  {
    slug: "hardcore",
    name: "Hardcore",
    keywords: ["hardcore"],
    intro:
      "Hardcore-Anzeigen in Berlin — schnelle, aggressive Bands und Musiker mit Crossover-Appeal zu Metal und Punk.",
  },
  {
    slug: "metalcore",
    name: "Metalcore",
    keywords: ["metalcore"],
    intro:
      "Metalcore-Projekte in Berlin, die schwere Riffs mit Hardcore-Energie verbinden. Gesucht: Sänger, Gitarristen und Schlagzeuger.",
  },
  {
    slug: "death-metal",
    name: "Death Metal",
    keywords: ["death metal"],
    intro:
      "Death-Metal-Bands und Musiker in Berlin auf der Suche nach technischen Spielern, Growl-Sängern und Extreme-Metal-Kollaborateuren.",
  },
  {
    slug: "black-metal",
    name: "Black Metal",
    keywords: ["black metal"],
    intro:
      "Black-Metal-Anzeigen in Berlin — rohe, atmosphärische oder symphonische Projekte auf der Suche nach engagierten Underground-Musikern.",
  },
  {
    slug: "thrash-metal",
    name: "Thrash Metal",
    keywords: ["thrash metal", "thrash", "crossover thrash"],
    intro:
      "Thrash- und Crossover-Thrash-Anzeigen in Berlin — Speed, Aggression und klassisch inspirierte Bay-Area-Metal-Projekte.",
  },
  {
    slug: "doom-metal",
    name: "Doom Metal",
    keywords: ["doom metal", "doom"],
    intro:
      "Doom-Metal-Musiker in Berlin — langsame, schwere Bands auf der Suche nach rifforientierten Gitarristen, Sängern und Rhythmussektionen.",
  },
  {
    slug: "groove-metal",
    name: "Groove Metal",
    keywords: ["groove metal", "groove"],
    intro:
      "Groove-Metal-Anzeigen in Berlin — midtempo schwere Bands auf der Suche nach straffen, druckvollen Spielern und starken Sängern.",
  },
  {
    slug: "crossover",
    name: "Crossover Thrash",
    keywords: ["crossover"],
    intro:
      "Crossover-Thrash-Projekte in Berlin, die Metal- und Punk-Attitüde zu energiegeladenen Live-Bands verbinden.",
  },
  {
    slug: "symphonic-metal",
    name: "Symphonic Metal",
    keywords: ["symphonic metal", "symphonic"],
    intro:
      "Symphonic-Metal-Anzeigen in Berlin — dramatische Stimmen, geschichtete Arrangements und schwer orchestrale Rock-Metal-Projekte.",
  },
  {
    slug: "sludge",
    name: "Sludge Metal",
    keywords: ["sludge"],
    intro:
      "Sludge-Metal-Bands und Musiker in Berlin mit Hang zu dicken Riffs, langsamen Grooves und abrasiven Underground-Klängen.",
  },
  {
    slug: "industrial-metal",
    name: "Industrial Metal",
    keywords: ["industrial metal", "industrial"],
    intro:
      "Industrial-Metal-Anzeigen in Berlin — mechanische, elektronisch orientierte Heavy-Projekte auf der Suche nach engagierten Kollaborateuren.",
  },
  {
    slug: "power-metal",
    name: "Power Metal",
    keywords: ["power metal"],
    intro:
      "Power-Metal-Musiker in Berlin — melodische Stimmen, schnelles Picking und hymnische Heavy-Metal-Bandprojekte.",
  },
];

const PUNK_SUBGENRES: SubgenreSeed[] = [
  {
    slug: "punk-rock",
    name: "Punk Rock",
    keywords: ["punk rock", "punkrock"],
    intro:
      "Punk-Rock-Bands und Musiker in Berlin — laute, direkte und schnelle Projekte auf der Suche nach engagierten Spielern.",
  },
  {
    slug: "punk",
    name: "Punk",
    keywords: ["punk"],
    intro:
      "Allgemeine Punk-Anzeigen in Berlin — DIY-Bands, Kellerprojekte und Musiker auf der Suche nach punkorientierten Kollaborateuren.",
  },
  {
    slug: "grunge",
    name: "Grunge",
    keywords: ["grunge"],
    intro:
      "Grunge-inspirierte Anzeigen in Berlin — 90er-orientierte Rock-Bands und Musiker auf der Suche nach schweren, melodischen und rohen Klängen.",
  },
  {
    slug: "post-punk",
    name: "Post-Punk",
    keywords: ["post-punk", "post punk"],
    intro:
      "Post-Punk-Projekte in Berlin — kantige Gitarren, treibender Bass und Art-School-Energie in Live-Band-Setups.",
  },
  {
    slug: "emo",
    name: "Emo",
    keywords: ["emo"],
    intro:
      "Emo- und emotional getriebene Punk-Rock-Anzeigen in Berlin auf der Suche nach Sängern, Gitarristen und straffen Rhythmussektionen.",
  },
  {
    slug: "hardcore-punk",
    name: "Hardcore Punk",
    keywords: ["hardcore punk"],
    intro:
      "Hardcore-Punk-Bands in Berlin — kurze, schnelle und intensive Projekte auf der Suche nach zuverlässigen Live-Musikern.",
  },
  {
    slug: "screamo",
    name: "Screamo",
    keywords: ["screamo"],
    intro:
      "Screamo- und chaotische Punk-Anzeigen in Berlin für Musiker mit Hang zu intensiven Vocals und dynamischen Songstrukturen.",
  },
];

const ELECTRONIC_SUBGENRES: SubgenreSeed[] = [
  {
    slug: "synth",
    name: "Synth",
    keywords: ["synth", "synthesizer"],
    intro:
      "Synth-orientierte Musiker und Live-Elektronik-Acts in Berlin auf der Suche nach Kollaborateuren für Hardware- und Hybrid-Setups.",
  },
  {
    slug: "house",
    name: "House",
    keywords: ["house", "deep house"],
    intro:
      "House-Musik-Anzeigen in Berlin — DJs, Produzenten und Live-Acts auf der Suche nach cluborientierten Kollaborationen.",
  },
  {
    slug: "electro",
    name: "Electro",
    keywords: ["electro", "electronica"],
    intro:
      "Electro- und Electronica-Musiker in Berlin, die dancefloororientierte oder experimentelle elektronische Projekte aufbauen.",
  },
  {
    slug: "ambient",
    name: "Ambient",
    keywords: ["ambient"],
    intro:
      "Ambient- und atmosphärische Elektronik-Anzeigen in Berlin — Sounddesigner, Produzenten und Live-Acts auf der Suche nach Kollaborateuren.",
  },
  {
    slug: "techno",
    name: "Techno",
    keywords: ["techno", "industrial techno"],
    intro:
      "Techno-Produzenten und Live-Acts in Berlin — die Clubkultur der Stadt macht dies zu einer der stärksten elektronischen Szenen hier.",
  },
  {
    slug: "edm",
    name: "EDM",
    keywords: ["edm"],
    intro:
      "EDM-orientierte Musiker und Produzenten in Berlin auf der Suche nach festivalreifen oder energiegeladenen elektronischen Kollaborationen.",
  },
];

const JAZZ_SUBGENRES: SubgenreSeed[] = [
  {
    slug: "jazz",
    name: "Jazz",
    keywords: ["jazz"],
    intro:
      "Jazz-orientierte Anzeigen in Berlin — Trios, Quartette, Sänger und Instrumentalisten auf der Suche nach Standards, Eigenkompositionen und Gigs.",
  },
  {
    slug: "fusion",
    name: "Jazz Fusion",
    keywords: ["fusion", "jazz fusion"],
    intro:
      "Jazz-Fusion-Projekte in Berlin, die Improvisation mit Funk, Rock und zeitgenössischer Harmonie verbinden.",
  },
  {
    slug: "swing",
    name: "Swing",
    keywords: ["swing", "big band"],
    intro:
      "Swing- und Big-Band-orientierte Jazz-Anzeigen in Berlin — Bläser, Rhythmussektionen und Sänger für tanzbare Jazz-Projekte.",
  },
];

const POP_SUBGENRES: SubgenreSeed[] = [
  {
    slug: "pop",
    name: "Pop",
    keywords: ["pop"],
    intro:
      "Pop-orientierte Musiker und Bands in Berlin — chartnahe, melodische und mainstreamtaugliche Projekte auf der Suche nach Mitgliedern.",
  },
  {
    slug: "cover-band",
    name: "Coverband",
    keywords: ["cover band", "cover-duo", "cover duo"],
    intro:
      "Coverbands und Eventmusiker in Berlin auf der Suche nach zuverlässigen Spielern für Gigs, Hochzeiten und Clubauftritte.",
  },
  {
    slug: "schlager",
    name: "Schlager",
    keywords: ["schlager"],
    intro:
      "Schlager- und deutschsprachige Pop-Anzeigen in Berlin — Live-Bands und Entertainer auf der Suche nach gigreifen Line-ups.",
  },
  {
    slug: "indie-pop",
    name: "Indie Pop",
    keywords: ["indie pop"],
    intro:
      "Indie-Pop-Musiker in Berlin, die melodische, zugängliche Songs mit DIY- oder Kleinstlabel-Geist schreiben.",
  },
  {
    slug: "synth-pop",
    name: "Synth Pop",
    keywords: ["synth pop"],
    intro:
      "Synth-Pop-Projekte in Berlin — elektronische Pop-Bands und Produzenten auf der Suche nach Sängern und Live-Musikern.",
  },
];

const FUNK_SOUL_SUBGENRES: SubgenreSeed[] = [
  {
    slug: "funk",
    name: "Funk",
    keywords: ["funk"],
    intro:
      "Funk-Musiker in Berlin — Bläsersektionen, Rhythmusspieler und grooveorientierte Bands auf der Suche nach straffen Line-ups.",
  },
  {
    slug: "soul",
    name: "Soul",
    keywords: ["soul"],
    intro:
      "Soul-Sänger und Bands in Berlin auf der Suche nach engagierten Spielern für kraftvolle Vocals und groovebasierte Arrangements.",
  },
  {
    slug: "rnb",
    name: "R&B",
    keywords: ["rnb", "r&b", "neo soul", "neosoul"],
    intro:
      "R&B- und Neo-Soul-Anzeigen in Berlin — gesangsführte Projekte auf der Suche nach Keys, Bass, Schlagzeug und Begleitmusikern.",
  },
  {
    slug: "disco",
    name: "Disco",
    keywords: ["disco"],
    intro:
      "Disco- und tanzorientierte Funk-Soul-Anzeigen in Berlin für Live-Bands und partyorientierte Kollaborationen.",
  },
];

const HIP_HOP_SUBGENRES: SubgenreSeed[] = [
  {
    slug: "rap",
    name: "Rap & Hip-Hop",
    keywords: ["rap", "hip hop", "hip-hop", "hiphop"],
    intro:
      "Rap- und Hip-Hop-Anzeigen in Berlin — MCs, Produzenten, Beatmaker und Live-Acts auf der Suche nach Kollaborateuren.",
  },
];

const FOLK_ACOUSTIC_SUBGENRES: SubgenreSeed[] = [
  {
    slug: "folk",
    name: "Folk",
    keywords: ["folk"],
    intro:
      "Folk-Musiker und Bands in Berlin — traditionelle und zeitgenössische Folk-Projekte, Duos und akustische Ensembles.",
  },
  {
    slug: "acoustic",
    name: "Akustik",
    keywords: ["acoustic"],
    intro:
      "Akustik-orientierte Anzeigen in Berlin für unplugged Bands, intime Gigs und Singer-Songwriter-Kollaborationen.",
  },
  {
    slug: "country",
    name: "Country",
    keywords: ["country"],
    intro:
      "Country- und Americana-orientierte Musiker in Berlin auf der Suche nach Pedal-Steel, Fiddle, Gitarre und Gesangskollaborateuren.",
  },
  {
    slug: "singer-songwriter",
    name: "Singer-Songwriter",
    keywords: ["singer-songwriter", "singer songwriter"],
    intro:
      "Singer-Songwriter-Anzeigen in Berlin — Solokünstler und kleine Gruppen auf der Suche nach Background-Gesang oder leichter Begleitung.",
  },
  {
    slug: "bluegrass",
    name: "Bluegrass",
    keywords: ["bluegrass"],
    intro:
      "Bluegrass-Musiker in Berlin auf der Suche nach Banjo, Mandoline, Fiddle und Projekten mit engen Gesangsharmonien.",
  },
];

const CLASSICAL_SUBGENRES: SubgenreSeed[] = [
  {
    slug: "orchestra",
    name: "Orchester",
    keywords: ["orchestra", "orchester"],
    intro:
      "Orchester- und Orchester-Musiker-Anzeigen in Berlin — Stimmen-Spieler und Ensembles auf der Suche nach Konzertprojekten.",
  },
  {
    slug: "choir",
    name: "Chor",
    keywords: ["choir", "chor"],
    intro:
      "Chor-Anzeigen in Berlin — Vokalensembles und Sänger auf der Suche nach klassischer und zeitgenössischer Chorarbeit.",
  },
  {
    slug: "classical",
    name: "Klassik",
    keywords: ["classical", "klassik"],
    intro:
      "Klassik-Anzeigen in Berlin — ausgebildete Musiker auf der Suche nach Kammergruppen, Pits, Konzerten und formellen Projekten.",
  },
];

const REGGAE_SUBGENRES: SubgenreSeed[] = [
  {
    slug: "reggae",
    name: "Reggae",
    keywords: ["reggae"],
    intro:
      "Reggae-Musiker und Bands in Berlin — Roots-, Dancehall-orientierte und Live-Reggae-Projekte auf der Suche nach Spielern.",
  },
  {
    slug: "ska",
    name: "Ska",
    keywords: ["ska"],
    intro:
      "Ska-Bands und Musiker in Berlin auf der Suche nach Bläsern, Upstroke-Gitarre und energiegeladenen Live-Line-ups.",
  },
  {
    slug: "dub",
    name: "Dub",
    keywords: ["dub"],
    intro:
      "Dub- und Reggae-nahe Anzeigen in Berlin — basslastige, studioorientierte und Live-Dub-Projekte.",
  },
];

const LATIN_SUBGENRES: SubgenreSeed[] = [
  {
    slug: "latin",
    name: "Latin",
    keywords: ["latin"],
    intro:
      "Latin-Musik-Anzeigen in Berlin — zweisprachige Bands und Musiker auf der Suche nach Percussion, Klavier, Bläsern und Gesangskollaborateuren.",
  },
  {
    slug: "cumbia",
    name: "Cumbia",
    keywords: ["cumbia"],
    intro:
      "Cumbia-Musiker und Bands in Berlin auf der Suche nach percussionlastigen, tanzbaren Latin-Line-ups.",
  },
];

const BLUES_SUBGENRES: SubgenreSeed[] = [
  {
    slug: "blues",
    name: "Blues",
    keywords: ["blues"],
    intro:
      "Blues-orientierte Anzeigen in Berlin — Gitarristen, Harpspieler, Sänger und Bands mit Fokus auf Blues und Blues-Rock.",
  },
];

const SUBGENRE_GROUPS: Array<{ parentSlug: string; seeds: SubgenreSeed[] }> = [
  { parentSlug: "rock", seeds: ROCK_SUBGENRES },
  { parentSlug: "metal", seeds: METAL_SUBGENRES },
  { parentSlug: "punk", seeds: PUNK_SUBGENRES },
  { parentSlug: "electronic", seeds: ELECTRONIC_SUBGENRES },
  { parentSlug: "jazz", seeds: JAZZ_SUBGENRES },
  { parentSlug: "pop", seeds: POP_SUBGENRES },
  { parentSlug: "funk-soul", seeds: FUNK_SOUL_SUBGENRES },
  { parentSlug: "hip-hop", seeds: HIP_HOP_SUBGENRES },
  { parentSlug: "folk-acoustic", seeds: FOLK_ACOUSTIC_SUBGENRES },
  { parentSlug: "classical", seeds: CLASSICAL_SUBGENRES },
  { parentSlug: "reggae", seeds: REGGAE_SUBGENRES },
  { parentSlug: "latin", seeds: LATIN_SUBGENRES },
  { parentSlug: "blues", seeds: BLUES_SUBGENRES },
];

/**
 * All subgenre page definitions for Phase 2 SEO categories.
 */
export const SUBGENRE_PAGES: SubgenrePage[] = SUBGENRE_GROUPS.flatMap(
  ({ parentSlug, seeds }) =>
    seeds.map((seed) => createSubgenre(parentSlug, seed)),
);

const subgenreByKey = new Map(
  SUBGENRE_PAGES.map((page) => [`${page.parentSlug}/${page.slug}`, page]),
);

/**
 * Returns all subgenre pages.
 */
export function getAllSubgenres(): SubgenrePage[] {
  return SUBGENRE_PAGES;
}

/**
 * Returns subgenre pages for a parent genre slug.
 */
export function getSubgenresForParent(parentSlug: string): SubgenrePage[] {
  return SUBGENRE_PAGES.filter((page) => page.parentSlug === parentSlug);
}

/**
 * Resolves a subgenre by parent and sub URL slugs.
 */
export function getSubgenreBySlug(
  parentSlug: string,
  subSlug: string,
): SubgenrePage | null {
  return subgenreByKey.get(`${parentSlug}/${subSlug}`) ?? null;
}

/**
 * Returns all subgenre sitemap path suffixes (`/genre/parent/sub`).
 */
export function getSubgenreSitemapPaths(): string[] {
  return SUBGENRE_PAGES.map((page) =>
    getSubgenrePath(page.parentSlug, page.slug),
  );
}
