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
    title: "Rock musicians & bands in Berlin",
    metaDescription:
      "Browse rock listings in Berlin — alternative, classic rock, indie, garage, and more. Bands seeking musicians and musicians looking for bands.",
    intro:
      "Find rock musicians, bands, and projects in Berlin. Listings include alternative, classic rock, indie, psychedelic, shoegaze, and garage bands — both bands looking for members and musicians looking to join a group.",
  },
  {
    slug: "metal",
    genreTag: "Metal",
    title: "Metal musicians & bands in Berlin",
    metaDescription:
      "Metal band listings in Berlin — thrash, death, black, doom, metalcore, and more. Find musicians or join a metal band in Berlin.",
    intro:
      "Berlin has an active metal scene. Browse bands and musicians tagged with metal — from thrash and death metal to doom, black metal, metalcore, and crossover projects across the city.",
  },
  {
    slug: "punk",
    genreTag: "Punk",
    title: "Punk musicians & bands in Berlin",
    metaDescription:
      "Punk and hardcore listings in Berlin — bands and musicians seeking collaborators. Post-punk, grunge, emo, and more.",
    intro:
      "Punk, hardcore, post-punk, grunge, and related listings from Berlin's musician boards. Find a band, fill a lineup slot, or connect with other punk musicians in the city.",
  },
  {
    slug: "pop",
    genreTag: "Pop",
    title: "Pop musicians & bands in Berlin",
    metaDescription:
      "Pop musician listings in Berlin — cover bands, indie pop, schlager, and session musicians looking for projects.",
    intro:
      "Pop and mainstream-leaning projects in Berlin, including cover bands, indie pop acts, schlager groups, and musicians open to pop-oriented collaborations.",
  },
  {
    slug: "blues",
    genreTag: "Blues",
    title: "Blues musicians in Berlin",
    metaDescription:
      "Blues musician and band listings in Berlin. Find guitarists, vocalists, harmonica players, and blues bands.",
    intro:
      "Blues musicians, bands, and jam projects in Berlin. Listings cover traditional blues, rhythm and blues, and blues-rock collaborations across the local scene.",
  },
  {
    slug: "funk-soul",
    genreTag: "Funk / Soul",
    title: "Funk & soul musicians in Berlin",
    metaDescription:
      "Funk, soul, and disco musician listings in Berlin. Find horn sections, rhythm sections, vocalists, and bands.",
    intro:
      "Funk, soul, R&B, disco, and neo-soul listings from Berlin — bands seeking musicians and players looking for groove-oriented projects.",
  },
  {
    slug: "electronic",
    genreTag: "Electronic",
    title: "Electronic musicians in Berlin",
    metaDescription:
      "Electronic music listings in Berlin — techno, house, synth, ambient, and live electronic acts seeking collaborators.",
    intro:
      "Electronic musicians and live acts in Berlin. Browse listings tagged with techno, house, synth, ambient, EDM, and other electronic projects — a natural fit for the city's club and producer culture.",
  },
  {
    slug: "jazz",
    genreTag: "Jazz",
    title: "Jazz musicians in Berlin",
    metaDescription:
      "Jazz musician listings in Berlin — trios, big bands, fusion projects, and session players seeking gigs and collaborators.",
    intro:
      "Jazz listings in Berlin, including fusion, swing, bossa, big band, and small-group projects. Musicians and ensembles looking for horns, rhythm sections, vocalists, and more.",
  },
  {
    slug: "folk-acoustic",
    genreTag: "Folk / Acoustic",
    title: "Folk & acoustic musicians in Berlin",
    metaDescription:
      "Folk, acoustic, country, and singer-songwriter listings in Berlin. Find duos, bands, and collaborators.",
    intro:
      "Folk, acoustic, country, bluegrass, and singer-songwriter listings from Berlin — ideal for intimate projects, open mics, and acoustic collaborations.",
  },
  {
    slug: "hip-hop",
    genreTag: "Hip-Hop",
    title: "Hip-hop & rap musicians in Berlin",
    metaDescription:
      "Hip-hop and rap listings in Berlin — MCs, producers, beatmakers, and live acts seeking collaborators.",
    intro:
      "Hip-hop, rap, and beatmaker listings in Berlin. Find MCs, producers, DJs, and live hip-hop acts looking for collaborators in the city.",
  },
  {
    slug: "classical",
    genreTag: "Classical",
    title: "Classical musicians in Berlin",
    metaDescription:
      "Classical musician listings in Berlin — orchestra, choir, opera, and chamber musicians seeking projects.",
    intro:
      "Classical and orchestral listings in Berlin, including choir, opera, chamber music, and Klassik projects. Musicians seeking ensembles and groups looking for players.",
  },
  {
    slug: "reggae",
    genreTag: "Reggae",
    title: "Reggae & ska musicians in Berlin",
    metaDescription:
      "Reggae, ska, and dub musician listings in Berlin. Find bands and session players.",
    intro:
      "Reggae, ska, and dub listings from Berlin's musician community — bands seeking members and musicians looking for reggae-oriented projects.",
  },
  {
    slug: "latin",
    genreTag: "Latin",
    title: "Latin musicians in Berlin",
    metaDescription:
      "Latin music listings in Berlin — salsa, cumbia, samba, and Latin jazz musicians and bands.",
    intro:
      "Latin music listings in Berlin, covering salsa, cumbia, samba, Latin jazz, and other Latin-oriented bands and musicians.",
  },
  {
    slug: "world",
    genreTag: "World",
    title: "World music musicians in Berlin",
    metaDescription:
      "World music listings in Berlin — Balkan, klezmer, Afrobeat, and international musicians seeking collaborators.",
    intro:
      "World and international music listings in Berlin, including Balkan, klezmer, Afrobeat, and other global styles represented in the local musician community.",
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
