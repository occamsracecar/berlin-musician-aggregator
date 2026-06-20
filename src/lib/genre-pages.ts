import { GENRES } from "@/lib/constants";

type GenreTag = (typeof GENRES)[number];

/** Parent genre definition for SEO category pages (Phase 1). */
export type ParentGenrePage = {
  slug: string;
  genreTag: GenreTag;
  title: string;
  metaDescription: string;
  intro: string;
  seoParagraph: string;
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
    seoParagraph:
      "Rock gehört in Berlin zu den am häufigsten gesuchten Genres — von Alternative und Indie über Classic Rock bis Garage und Psychedelic. Auf dieser Seite findest du aktuelle Inserate von Bands, die Gitarristen, Bassisten, Schlagzeuger oder Sänger suchen, sowie Musiker, die einem Rock-Projekt beitreten möchten. Die Anzeigen stammen aus Musikerbörsen wie Berlin Musiker, Backstage PRO und Noisy Rooms und aus der Berlin-Bandhub-Community. Nutze die Unterkategorien für feinere Stilrichtungen oder die Suche, um gezielt nach Instrument und Bezirk zu filtern.",
  },
  {
    slug: "metal",
    genreTag: "Metal",
    title: "Metal-Musiker & Bands in Berlin",
    metaDescription:
      "Metal-Anzeigen in Berlin — Thrash, Death, Black, Doom, Metalcore und mehr. Musiker finden oder einer Metal-Band beitreten.",
    intro:
      "Berlin hat eine aktive Metal-Szene. Durchsuche Bands und Musiker mit Metal-Tag — von Thrash und Death Metal bis Doom, Black Metal, Metalcore und Crossover-Projekten in der Stadt.",
    seoParagraph:
      "Die Berliner Metal-Szene reicht von Thrash und Death Metal über Black und Doom bis zu Metalcore und modernen Crossover-Projekten. Diese Übersicht zeigt alle aktuellen Metal-Inserate an einem Ort: Bands auf der Suche nach Gitarristen, Bassisten, Drummern oder Sängern und Musiker, die einer bestehenden Gruppe beitreten wollen. Berlin Bandhub aggregiert Anzeigen aus etablierten Musikerbörsen und Community-Beiträge, damit du nicht mehrere Portale parallel durchsuchen musst. Über die Unterseiten kannst du gezielt nach Subgenres wie Black Metal, Death Metal oder Metalcore filtern.",
  },
  {
    slug: "punk",
    genreTag: "Punk",
    title: "Punk-Musiker & Bands in Berlin",
    metaDescription:
      "Punk- und Hardcore-Anzeigen in Berlin — Bands und Musiker auf der Suche nach Mitspielern. Post-Punk, Grunge, Emo und mehr.",
    intro:
      "Punk, Hardcore, Post-Punk, Grunge und verwandte Anzeigen aus Berlins Musikerbörsen. Finde eine Band, besetze eine Position oder vernetze dich mit anderen Punk-Musikern.",
    seoParagraph:
      "Punk und verwandte Stilrichtungen — Hardcore, Post-Punk, Grunge, Emo — haben in Berlin eine lebendige Underground-Szene mit regelmäßigen Projekten und Besetzungswechseln. Hier siehst du alle aktuellen Punk-Inserate: Bands, die Mitglieder suchen, und Musiker, die einer Gruppe anschließen möchten. Die Liste wird aus öffentlichen Musikerbörsen und der Berlin-Bandhub-Community zusammengestellt und regelmäßig aktualisiert. Für engere Stilfilter nutze die Unterkategorien oder öffne die Suche mit dem Punk-Genre-Filter.",
  },
  {
    slug: "pop",
    genreTag: "Pop",
    title: "Pop-Musiker & Bands in Berlin",
    metaDescription:
      "Pop-Anzeigen in Berlin — Coverbands, Indie Pop, Schlager und Session-Musiker auf Projektsuche.",
    intro:
      "Pop- und mainstreamnahe Projekte in Berlin, darunter Coverbands, Indie-Pop-Acts, Schlager-Gruppen und Musiker für pop-orientierte Zusammenarbeit.",
    seoParagraph:
      "Pop-Musik in Berlin umfasst Coverbands, Indie-Pop, Schlager, Session-Projekte und chartnahe Acts — oft mit Bedarf an Sängern, Keyboardern, Gitarristen oder kompletten Lineups. Auf dieser Seite findest du Pop-Inserate aus Musikerbörsen und der Community, sortiert nach Aktualität. Ob du eine Band gründest, ein bestehendes Projekt vervollständigst oder als Musiker ein pop-orientiertes Engagement suchst: hier siehst du, wer in der Hauptstadt gerade aktiv sucht. Unterkategorien wie Indie Pop oder Schlager helfen bei der genaueren Einordnung.",
  },
  {
    slug: "blues",
    genreTag: "Blues",
    title: "Blues-Musiker in Berlin",
    metaDescription:
      "Blues-Musiker und Band-Anzeigen in Berlin. Gitarristen, Sänger, Mundharmonika-Spieler und Blues-Bands finden.",
    intro:
      "Blues-Musiker, Bands und Jam-Projekte in Berlin. Anzeigen zu traditionellem Blues, Rhythm and Blues und Blues-Rock in der lokalen Szene.",
    seoParagraph:
      "Blues in Berlin lebt in Clubs, Jams und kleinen Ensembles — von traditionellem Blues über R&B bis Blues-Rock. Diese Seite sammelt aktuelle Inserate von Gitarristen, Harpspielern, Sängern, Bassisten und Bands, die Mitspieler oder neue Projekte suchen. Berlin Bandhub bündelt Anzeigen aus Musikerbörsen und Community-Beiträge, damit du schneller passende Kontakte findest. Ideal, wenn du einer Blues-Band beitreten, eine Session besetzen oder ein neues Jam-Projekt starten möchtest.",
  },
  {
    slug: "funk-soul",
    genreTag: "Funk / Soul",
    title: "Funk- & Soul-Musiker in Berlin",
    metaDescription:
      "Funk-, Soul- und Disco-Anzeigen in Berlin. Bläser, Rhythmusgruppen, Sänger und Bands finden.",
    intro:
      "Funk-, Soul-, R&B-, Disco- und Neo-Soul-Anzeigen aus Berlin — Bands suchen Musiker, Musiker suchen groove-orientierte Projekte.",
    seoParagraph:
      "Funk, Soul, R&B, Disco und Neo-Soul brauchen in Berlin oft gut besetzte Rhythmusgruppen, Bläsersektionen und charismatische Sänger. Hier findest du Inserate von Bands und Projekten, die genau diese Positionen suchen, sowie Musiker auf der Suche nach groove-orientierten Acts. Die Anzeigen werden aus Musikerbörsen und der Berlin-Bandhub-Community zusammengeführt. Ob Live-Band, Tribute-Projekt oder Session — diese Übersicht hilft dir, in der Hauptstadt schneller die richtigen Mitspieler zu finden.",
  },
  {
    slug: "electronic",
    genreTag: "Electronic",
    title: "Electronic-Musiker in Berlin",
    metaDescription:
      "Electronic-Anzeigen in Berlin — Techno, House, Synth, Ambient und Live-Electronic-Acts auf Mitspielersuche.",
    intro:
      "Electronic-Musiker und Live-Acts in Berlin. Anzeigen zu Techno, House, Synth, Ambient, EDM und anderen elektronischen Projekten — passend zur Club- und Producer-Kultur der Stadt.",
    seoParagraph:
      "Berlin ist weltweit für elektronische Musik bekannt — von Techno und House über Synth-Pop und Ambient bis zu Live-Electronic-Acts. Diese Seite zeigt Inserate von Produzenten, DJs, Live-Acts und Bands mit elektronischem Schwerpunkt, die Mitspieler, Vocalists oder Session-Musiker suchen. Anzeigen aus Musikerbörsen und der Community werden hier zentral dargestellt. Nutze die Unterkategorien für Techno, House, Synth und mehr, oder filtere in der Suche nach Instrument und Bezirk.",
  },
  {
    slug: "jazz",
    genreTag: "Jazz",
    title: "Jazz-Musiker in Berlin",
    metaDescription:
      "Jazz-Anzeigen in Berlin — Trios, Bigbands, Fusion-Projekte und Session-Musiker auf Gigsuche.",
    intro:
      "Jazz-Anzeigen in Berlin, darunter Fusion, Swing, Bossa, Bigband und Kleinformations-Projekte. Musiker und Ensembles suchen Bläser, Rhythmusgruppen, Sänger und mehr.",
    seoParagraph:
      "Jazz in Berlin spielt sich in Clubs, Kneipen, Bigbands und kleinen Ensembles ab — von Swing und Bossa über Fusion bis zu experimentellen Projekten. Auf dieser Seite findest du Jazz-Inserate von Bands und Musikern, die Bläser, Rhythmusgruppen, Pianisten oder Sänger suchen, sowie Spieler, die einem Ensemble beitreten möchten. Berlin Bandhub fasst Anzeigen aus Musikerbörsen und Community-Beiträgen zusammen. Für feinere Stilfilter stehen Unterkategorien wie Fusion, Swing oder Bigband zur Verfügung.",
  },
  {
    slug: "folk-acoustic",
    genreTag: "Folk / Acoustic",
    title: "Folk- & Akustik-Musiker in Berlin",
    metaDescription:
      "Folk-, Akustik-, Country- und Singer-Songwriter-Anzeigen in Berlin. Duos, Bands und Mitspieler finden.",
    intro:
      "Folk-, Akustik-, Country-, Bluegrass- und Singer-Songwriter-Anzeigen aus Berlin — für intime Projekte, Open Mics und akustische Zusammenarbeit.",
    seoParagraph:
      "Folk, Akustik, Country, Bluegrass und Singer-Songwriter-Projekte sind in Berlin oft in kleineren Besetzungen, auf Open-Mic-Bühnen und in Wohnzimmerkonzerten zu Hause. Diese Übersicht listet aktuelle Inserate von Duos, Bands und Solokünstlern, die Mitspieler oder Kollaborationspartner suchen. Anzeigen aus Musikerbörsen und der Community werden hier gebündelt. Ob du Gitarre, Mandoline, Geige oder Gesang anbietest — hier findest du passende Folk- und Akustik-Projekte in der Hauptstadt.",
  },
  {
    slug: "hip-hop",
    genreTag: "Hip-Hop",
    title: "Hip-Hop- & Rap-Musiker in Berlin",
    metaDescription:
      "Hip-Hop- und Rap-Anzeigen in Berlin — MCs, Producer, Beatmaker und Live-Acts auf Mitspielersuche.",
    intro:
      "Hip-Hop-, Rap- und Beatmaker-Anzeigen in Berlin. Finde MCs, Producer, DJs und Live-Hip-Hop-Acts auf der Suche nach Kollaborationen.",
    seoParagraph:
      "Hip-Hop und Rap in Berlin leben von MCs, Produzenten, Beatmakern und Live-Acts, die zusammenfinden wollen. Auf dieser Seite siehst du aktuelle Inserate — von Producer-Suche und Feature-Anfragen bis zu kompletten Live-Bands. Berlin Bandhub sammelt Anzeigen aus Musikerbörsen und der Community an einem Ort. Ideal für Kollaborationen im Studio, auf der Bühne oder in neuen Projekten. Unterkategorien wie Rap oder Beatmaking helfen bei der gezielteren Suche.",
  },
  {
    slug: "classical",
    genreTag: "Classical",
    title: "Klassik-Musiker in Berlin",
    metaDescription:
      "Klassik-Anzeigen in Berlin — Orchester, Chor, Oper und Kammer-Musiker auf Projektsuche.",
    intro:
      "Klassik- und Orchester-Anzeigen in Berlin, darunter Chor, Oper, Kammermusik und Klassik-Projekte. Musiker suchen Ensembles, Gruppen suchen Mitspieler.",
    seoParagraph:
      "Klassische Musik in Berlin umfasst Orchester, Chor, Oper, Kammermusik und freie Ensembles — oft mit Bedarf an Streicher, Bläser, Sängern oder Dirigenten. Diese Seite bündelt Klassik-Inserate aus Musikerbörsen und der Berlin-Bandhub-Community: Ensembles suchen Mitspieler, Musiker suchen Projekte. So findest du schneller passende Kontakte für Proben, Konzerte oder langfristige Engagements in der Hauptstadt.",
  },
  {
    slug: "reggae",
    genreTag: "Reggae",
    title: "Reggae- & Ska-Musiker in Berlin",
    metaDescription:
      "Reggae-, Ska- und Dub-Anzeigen in Berlin. Bands und Session-Musiker finden.",
    intro:
      "Reggae-, Ska- und Dub-Anzeigen aus Berlins Musiker-Community — Bands suchen Mitglieder, Musiker suchen Reggae-orientierte Projekte.",
    seoParagraph:
      "Reggae, Ska und Dub haben in Berlin eine feste Nische mit Bands, Soundsystem-Kultur und regelmäßigen Live-Acts. Hier findest du Inserate von Gruppen, die Bassisten, Gitarristen, Bläser oder Sänger suchen, und Musiker, die einem Reggae-Projekt beitreten möchten. Anzeigen aus Musikerbörsen und der Community werden zentral dargestellt und regelmäßig ergänzt. Nutze die Unterkategorien für Ska oder Dub, wenn du gezielter filtern möchtest.",
  },
  {
    slug: "latin",
    genreTag: "Latin",
    title: "Latin-Musiker in Berlin",
    metaDescription:
      "Latin-Anzeigen in Berlin — Salsa, Cumbia, Samba und Latin Jazz. Musiker und Bands finden.",
    intro:
      "Latin-Musik-Anzeigen in Berlin — Salsa, Cumbia, Samba, Latin Jazz und andere latin-orientierte Bands und Musiker.",
    seoParagraph:
      "Latin-Musik in Berlin bringt Salsa, Cumbia, Samba, Latin Jazz und verwandte Stile auf Bühnen und in Proberäume — oft mit Bedarf an Percussion, Bläsern, Bass und Gesang. Diese Seite zeigt aktuelle Latin-Inserate von Bands und Musikern in der Hauptstadt. Berlin Bandhub fasst Anzeigen aus Musikerbörsen und Community-Beiträgen zusammen, damit du schneller passende Mitspieler findest. Unterkategorien wie Salsa oder Samba unterstützen eine feinere Suche.",
  },
  {
    slug: "world",
    genreTag: "World",
    title: "Weltmusik-Musiker in Berlin",
    metaDescription:
      "Weltmusik-Anzeigen in Berlin — Balkan, Klezmer, Afrobeat und internationale Musiker auf Mitspielersuche.",
    intro:
      "Weltmusik- und internationale Anzeigen in Berlin, darunter Balkan, Klezmer, Afrobeat und andere globale Stilrichtungen in der lokalen Musikerszene.",
    seoParagraph:
      "Weltmusik in Berlin verbindet Balkan, Klezmer, Afrobeat, Oriental und viele weitere internationale Stilrichtungen — oft in gemischten Ensembles mit spezifischen Instrumentenbedarf. Auf dieser Seite findest du aktuelle Inserate von Bands und Musikern, die Mitspieler für interkulturelle Projekte suchen. Anzeigen aus Musikerbörsen und der Berlin-Bandhub-Community werden hier übersichtlich dargestellt. Ideal, wenn du ein Ensemble vervollständigen oder einem internationalen Projekt in der Hauptstadt beitreten möchtest.",
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
