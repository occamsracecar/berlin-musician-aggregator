import { GENRES } from "@/lib/constants";

type GenreTag = (typeof GENRES)[number];

/** Parent genre definition for SEO category pages (Phase 1). */
export type ParentGenrePage = {
  slug: string;
  genreTag: GenreTag;
  title: string;
  metaDescription: string;
  intro: string;
};

/**
 * Parent genre pages ordered by typical listing volume (highest first).
 */
export const PARENT_GENRE_PAGES: ParentGenrePage[] = [
  {
    slug: "rock",
    genreTag: "Rock",
    title: "Rock-Musiker & Bands in Berlin",
    metaDescription:
      "Rock-Anzeigen in Berlin — Alternative, Classic Rock, Indie, Garage und mehr. Bands suchen Musiker, Musiker suchen Bands.",
    intro:
      "Finde Rock-Musiker, Bands und Projekte in Berlin. Anzeigen zu Alternative, Classic Rock, Indie, Psychedelic, Shoegaze und Garage — Bands auf Mitglieder-Suche und Musiker, die einer Gruppe beitreten wollen.",
  },
  {
    slug: "metal",
    genreTag: "Metal",
    title: "Metal-Musiker & Bands in Berlin",
    metaDescription:
      "Metal-Anzeigen in Berlin — Thrash, Death, Black, Doom, Metalcore und mehr. Musiker finden oder einer Metal-Band beitreten.",
    intro:
      "Berlin hat eine aktive Metal-Szene. Durchsuche Bands und Musiker mit Metal-Tag — von Thrash und Death Metal bis Doom, Black Metal, Metalcore und Crossover-Projekten in der Stadt.",
  },
  {
    slug: "punk",
    genreTag: "Punk",
    title: "Punk-Musiker & Bands in Berlin",
    metaDescription:
      "Punk- und Hardcore-Anzeigen in Berlin — Bands und Musiker auf der Suche nach Mitspielern. Post-Punk, Grunge, Emo und mehr.",
    intro:
      "Punk, Hardcore, Post-Punk, Grunge und verwandte Anzeigen aus Berlins Musikerbörsen. Finde eine Band, besetze eine Position oder vernetze dich mit anderen Punk-Musikern.",
  },
  {
    slug: "pop",
    genreTag: "Pop",
    title: "Pop-Musiker & Bands in Berlin",
    metaDescription:
      "Pop-Anzeigen in Berlin — Coverbands, Indie Pop, Schlager und Session-Musiker auf Projektsuche.",
    intro:
      "Pop- und mainstreamnahe Projekte in Berlin, darunter Coverbands, Indie-Pop-Acts, Schlager-Gruppen und Musiker für pop-orientierte Zusammenarbeit.",
  },
  {
    slug: "blues",
    genreTag: "Blues",
    title: "Blues-Musiker in Berlin",
    metaDescription:
      "Blues-Musiker und Band-Anzeigen in Berlin. Gitarristen, Sänger, Mundharmonika-Spieler und Blues-Bands finden.",
    intro:
      "Blues-Musiker, Bands und Jam-Projekte in Berlin. Anzeigen zu traditionellem Blues, Rhythm and Blues und Blues-Rock in der lokalen Szene.",
  },
  {
    slug: "funk-soul",
    genreTag: "Funk / Soul",
    title: "Funk- & Soul-Musiker in Berlin",
    metaDescription:
      "Funk-, Soul- und Disco-Anzeigen in Berlin. Bläser, Rhythmusgruppen, Sänger und Bands finden.",
    intro:
      "Funk-, Soul-, R&B-, Disco- und Neo-Soul-Anzeigen aus Berlin — Bands suchen Musiker, Musiker suchen groove-orientierte Projekte.",
  },
  {
    slug: "electronic",
    genreTag: "Electronic",
    title: "Electronic-Musiker in Berlin",
    metaDescription:
      "Electronic-Anzeigen in Berlin — Techno, House, Synth, Ambient und Live-Electronic-Acts auf Mitspielersuche.",
    intro:
      "Electronic-Musiker und Live-Acts in Berlin. Anzeigen zu Techno, House, Synth, Ambient, EDM und anderen elektronischen Projekten — passend zur Club- und Producer-Kultur der Stadt.",
  },
  {
    slug: "jazz",
    genreTag: "Jazz",
    title: "Jazz-Musiker in Berlin",
    metaDescription:
      "Jazz-Anzeigen in Berlin — Trios, Bigbands, Fusion-Projekte und Session-Musiker auf Gigsuche.",
    intro:
      "Jazz-Anzeigen in Berlin, darunter Fusion, Swing, Bossa, Bigband und Kleinformations-Projekte. Musiker und Ensembles suchen Bläser, Rhythmusgruppen, Sänger und mehr.",
  },
  {
    slug: "folk-acoustic",
    genreTag: "Folk / Acoustic",
    title: "Folk- & Akustik-Musiker in Berlin",
    metaDescription:
      "Folk-, Akustik-, Country- und Singer-Songwriter-Anzeigen in Berlin. Duos, Bands und Mitspieler finden.",
    intro:
      "Folk-, Akustik-, Country-, Bluegrass- und Singer-Songwriter-Anzeigen aus Berlin — für intime Projekte, Open Mics und akustische Zusammenarbeit.",
  },
  {
    slug: "hip-hop",
    genreTag: "Hip-Hop",
    title: "Hip-Hop- & Rap-Musiker in Berlin",
    metaDescription:
      "Hip-Hop- und Rap-Anzeigen in Berlin — MCs, Producer, Beatmaker und Live-Acts auf Mitspielersuche.",
    intro:
      "Hip-Hop-, Rap- und Beatmaker-Anzeigen in Berlin. Finde MCs, Producer, DJs und Live-Hip-Hop-Acts auf der Suche nach Kollaborationen.",
  },
  {
    slug: "classical",
    genreTag: "Classical",
    title: "Klassik-Musiker in Berlin",
    metaDescription:
      "Klassik-Anzeigen in Berlin — Orchester, Chor, Oper und Kammer-Musiker auf Projektsuche.",
    intro:
      "Klassik- und Orchester-Anzeigen in Berlin, darunter Chor, Oper, Kammermusik und Klassik-Projekte. Musiker suchen Ensembles, Gruppen suchen Mitspieler.",
  },
  {
    slug: "reggae",
    genreTag: "Reggae",
    title: "Reggae- & Ska-Musiker in Berlin",
    metaDescription:
      "Reggae-, Ska- und Dub-Anzeigen in Berlin. Bands und Session-Musiker finden.",
    intro:
      "Reggae-, Ska- und Dub-Anzeigen aus Berlins Musiker-Community — Bands suchen Mitglieder, Musiker suchen Reggae-orientierte Projekte.",
  },
  {
    slug: "latin",
    genreTag: "Latin",
    title: "Latin-Musiker in Berlin",
    metaDescription:
      "Latin-Anzeigen in Berlin — Salsa, Cumbia, Samba und Latin Jazz. Musiker und Bands finden.",
    intro:
      "Latin-Musik-Anzeigen in Berlin — Salsa, Cumbia, Samba, Latin Jazz und andere latin-orientierte Bands und Musiker.",
  },
  {
    slug: "world",
    genreTag: "World",
    title: "Weltmusik-Musiker in Berlin",
    metaDescription:
      "Weltmusik-Anzeigen in Berlin — Balkan, Klezmer, Afrobeat und internationale Musiker auf Mitspielersuche.",
    intro:
      "Weltmusik- und internationale Anzeigen in Berlin, darunter Balkan, Klezmer, Afrobeat und andere globale Stilrichtungen in der lokalen Musikerszene.",
  },
];

const parentGenreBySlug = new Map(
  PARENT_GENRE_PAGES.map((genre) => [genre.slug, genre]),
);

/**
 * Returns all parent genre page definitions.
 */
export function getAllParentGenres(): ParentGenrePage[] {
  return PARENT_GENRE_PAGES;
}

/**
 * Resolves a parent genre by URL slug, or null when unknown.
 */
export function getParentGenreBySlug(slug: string): ParentGenrePage | null {
  return parentGenreBySlug.get(slug) ?? null;
}

/**
 * Returns the canonical path for a parent genre page.
 */
export function getParentGenrePath(slug: string): string {
  return `/genre/${slug}`;
}

/**
 * Returns sitemap entries for parent genre pages.
 */
export function getParentGenreSitemapPaths(): string[] {
  return PARENT_GENRE_PAGES.map((genre) => getParentGenrePath(genre.slug));
}

/**
 * Validates that every parent genre maps to an allowed GENRES tag.
 */
export function assertParentGenreTagsValid(): void {
  const allowed = new Set<string>(GENRES);

  for (const genre of PARENT_GENRE_PAGES) {
    if (!allowed.has(genre.genreTag)) {
      throw new Error(`Invalid genre tag for slug "${genre.slug}": ${genre.genreTag}`);
    }
  }
}

assertParentGenreTagsValid();
