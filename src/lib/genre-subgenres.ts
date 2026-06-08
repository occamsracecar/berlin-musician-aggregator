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
};

type SubgenreSeed = {
  slug: string;
  name: string;
  keywords: string[];
  intro: string;
  metaDescription?: string;
};

/**
 * Builds SEO fields for a subgenre page from its display name.
 */
function buildSubgenreSeo(name: string, intro: string, metaDescription?: string) {
  return {
    title: `${name} musicians & bands in Berlin`,
    metaDescription:
      metaDescription ??
      `Browse ${name.toLowerCase()} musician and band listings in Berlin. Bands seeking members and musicians looking for projects.`,
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
  };
}

const ROCK_SUBGENRES: SubgenreSeed[] = [
  {
    slug: "alternative",
    name: "Alternative rock",
    keywords: ["alternative", "alternative rock"],
    intro:
      "Alternative and alt-rock listings in Berlin — indie-leaning bands and musicians seeking collaborators outside the mainstream.",
  },
  {
    slug: "classic-rock",
    name: "Classic rock",
    keywords: ["classic rock"],
    intro:
      "Classic rock bands and musicians in Berlin looking for guitarists, vocalists, drummers, and other players for rock-oriented projects.",
  },
  {
    slug: "psychedelic",
    name: "Psychedelic rock",
    keywords: ["psychedelic", "psychedelic rock"],
    intro:
      "Psychedelic rock projects in Berlin — bands and musicians drawn to expansive, experimental, or retro-psych sounds.",
  },
  {
    slug: "shoegaze",
    name: "Shoegaze",
    keywords: ["shoegaze"],
    intro:
      "Shoegaze and dream-pop leaning listings in Berlin. Find guitarists, vocalists, and bands chasing layered, atmospheric rock.",
  },
  {
    slug: "indie-rock",
    name: "Indie rock",
    keywords: ["indie rock"],
    intro:
      "Indie rock musicians and bands in Berlin — smaller-room projects, DIY bands, and collaborators building independent rock lineups.",
  },
  {
    slug: "hard-rock",
    name: "Hard rock",
    keywords: ["hard rock"],
    intro:
      "Hard rock bands and players in Berlin seeking powerful vocals, heavy guitars, and driving rhythm sections.",
  },
  {
    slug: "garage-rock",
    name: "Garage rock",
    keywords: ["garage rock", "garage"],
    intro:
      "Garage rock listings in Berlin — raw, energetic bands and musicians looking for fast, loud, and straightforward collaborations.",
  },
  {
    slug: "post-rock",
    name: "Post-rock",
    keywords: ["post-rock", "post rock"],
    intro:
      "Post-rock and instrumental rock projects in Berlin seeking patient, cinematic, or experimental band setups.",
  },
  {
    slug: "rockabilly",
    name: "Rockabilly",
    keywords: ["rockabilly"],
    intro:
      "Rockabilly musicians and bands in Berlin — upright bass, twangy guitar, and vintage rock 'n' roll lineups.",
  },
  {
    slug: "progressive-rock",
    name: "Progressive rock",
    keywords: ["progressive rock", "prog rock"],
    intro:
      "Progressive rock listings in Berlin — musicians interested in complex arrangements, odd meters, and ambitious rock projects.",
  },
];

const METAL_SUBGENRES: SubgenreSeed[] = [
  {
    slug: "heavy-metal",
    name: "Heavy metal",
    keywords: ["heavy metal"],
    intro:
      "Heavy metal bands and musicians in Berlin looking for members across the classic and modern metal spectrum.",
  },
  {
    slug: "hardcore",
    name: "Hardcore",
    keywords: ["hardcore"],
    intro:
      "Hardcore listings in Berlin — fast, aggressive bands and musicians with crossover appeal to metal and punk.",
  },
  {
    slug: "metalcore",
    name: "Metalcore",
    keywords: ["metalcore"],
    intro:
      "Metalcore projects in Berlin combining heavy riffing with hardcore energy. Vocalists, guitarists, and drummers wanted.",
  },
  {
    slug: "death-metal",
    name: "Death metal",
    keywords: ["death metal"],
    intro:
      "Death metal bands and musicians in Berlin seeking technical players, growling vocalists, and extreme metal collaborators.",
  },
  {
    slug: "black-metal",
    name: "Black metal",
    keywords: ["black metal"],
    intro:
      "Black metal listings in Berlin — raw, atmospheric, or symphonic projects looking for dedicated underground musicians.",
  },
  {
    slug: "thrash-metal",
    name: "Thrash metal",
    keywords: ["thrash metal", "thrash", "crossover thrash"],
    intro:
      "Thrash and crossover thrash listings in Berlin — speed, aggression, and classic Bay Area-inspired metal projects.",
  },
  {
    slug: "doom-metal",
    name: "Doom metal",
    keywords: ["doom metal", "doom"],
    intro:
      "Doom metal musicians in Berlin — slow, heavy bands looking for riff-focused guitarists, vocalists, and rhythm sections.",
  },
  {
    slug: "groove-metal",
    name: "Groove metal",
    keywords: ["groove metal", "groove"],
    intro:
      "Groove metal listings in Berlin — mid-tempo heavy bands seeking tight, punchy players and strong vocalists.",
  },
  {
    slug: "crossover",
    name: "Crossover thrash",
    keywords: ["crossover"],
    intro:
      "Crossover thrash projects in Berlin blending metal and punk attitudes into high-energy live bands.",
  },
  {
    slug: "symphonic-metal",
    name: "Symphonic metal",
    keywords: ["symphonic metal", "symphonic"],
    intro:
      "Symphonic metal listings in Berlin — dramatic vocals, layered arrangements, and heavy orchestrated rock-metal projects.",
  },
  {
    slug: "sludge",
    name: "Sludge metal",
    keywords: ["sludge"],
    intro:
      "Sludge metal bands and musicians in Berlin pursuing thick riffs, slow grooves, and abrasive underground sounds.",
  },
  {
    slug: "industrial-metal",
    name: "Industrial metal",
    keywords: ["industrial metal", "industrial"],
    intro:
      "Industrial metal listings in Berlin — mechanical, electronic-leaning heavy projects seeking committed collaborators.",
  },
  {
    slug: "power-metal",
    name: "Power metal",
    keywords: ["power metal"],
    intro:
      "Power metal musicians in Berlin — melodic vocals, fast picking, and anthemic heavy metal band projects.",
  },
];

const PUNK_SUBGENRES: SubgenreSeed[] = [
  {
    slug: "punk-rock",
    name: "Punk rock",
    keywords: ["punk rock", "punkrock"],
    intro:
      "Punk rock bands and musicians in Berlin — loud, direct, and fast projects looking for committed players.",
  },
  {
    slug: "punk",
    name: "Punk",
    keywords: ["punk"],
    intro:
      "General punk listings in Berlin spanning DIY bands, basement projects, and musicians looking for punk-oriented collaborators.",
  },
  {
    slug: "grunge",
    name: "Grunge",
    keywords: ["grunge"],
    intro:
      "Grunge-influenced listings in Berlin — 90s-inspired rock bands and musicians chasing heavy, melodic, and raw sounds.",
  },
  {
    slug: "post-punk",
    name: "Post-punk",
    keywords: ["post-punk", "post punk"],
    intro:
      "Post-punk projects in Berlin — angular guitars, driving bass, and art-school energy in live band setups.",
  },
  {
    slug: "emo",
    name: "Emo",
    keywords: ["emo"],
    intro:
      "Emo and emotionally driven punk-rock listings in Berlin seeking vocalists, guitarists, and tight rhythm sections.",
  },
  {
    slug: "hardcore-punk",
    name: "Hardcore punk",
    keywords: ["hardcore punk"],
    intro:
      "Hardcore punk bands in Berlin — short, fast, and intense projects looking for reliable live musicians.",
  },
  {
    slug: "screamo",
    name: "Screamo",
    keywords: ["screamo"],
    intro:
      "Screamo and chaotic punk listings in Berlin for musicians drawn to intense vocals and dynamic song structures.",
  },
];

const ELECTRONIC_SUBGENRES: SubgenreSeed[] = [
  {
    slug: "synth",
    name: "Synth",
    keywords: ["synth", "synthesizer"],
    intro:
      "Synth-focused musicians and live electronic acts in Berlin seeking collaborators for hardware and hybrid setups.",
  },
  {
    slug: "house",
    name: "House",
    keywords: ["house", "deep house"],
    intro:
      "House music listings in Berlin — DJs, producers, and live acts looking for club-oriented collaborations.",
  },
  {
    slug: "electro",
    name: "Electro",
    keywords: ["electro", "electronica"],
    intro:
      "Electro and electronica musicians in Berlin building dancefloor-oriented or experimental electronic projects.",
  },
  {
    slug: "ambient",
    name: "Ambient",
    keywords: ["ambient"],
    intro:
      "Ambient and atmospheric electronic listings in Berlin — sound designers, producers, and live acts seeking collaborators.",
  },
  {
    slug: "techno",
    name: "Techno",
    keywords: ["techno", "industrial techno"],
    intro:
      "Techno producers and live acts in Berlin — the city's club culture makes this one of the strongest electronic scenes here.",
  },
  {
    slug: "edm",
    name: "EDM",
    keywords: ["edm"],
    intro:
      "EDM-oriented musicians and producers in Berlin looking for festival-ready or high-energy electronic collaborations.",
  },
];

const JAZZ_SUBGENRES: SubgenreSeed[] = [
  {
    slug: "jazz",
    name: "Jazz",
    keywords: ["jazz"],
    intro:
      "Jazz-focused listings in Berlin — trios, quartets, singers, and instrumentalists looking for standards, originals, and gigs.",
  },
  {
    slug: "fusion",
    name: "Jazz fusion",
    keywords: ["fusion", "jazz fusion"],
    intro:
      "Jazz fusion projects in Berlin blending improvisation with funk, rock, and contemporary harmony.",
  },
  {
    slug: "swing",
    name: "Swing",
    keywords: ["swing", "big band"],
    intro:
      "Swing and big-band leaning jazz listings in Berlin — horns, rhythm sections, and vocalists for danceable jazz projects.",
  },
];

const POP_SUBGENRES: SubgenreSeed[] = [
  {
    slug: "pop",
    name: "Pop",
    keywords: ["pop"],
    intro:
      "Pop-oriented musicians and bands in Berlin — chart-leaning, melodic, and mainstream-accessible projects seeking members.",
  },
  {
    slug: "cover-band",
    name: "Cover band",
    keywords: ["cover band", "cover-duo", "cover duo"],
    intro:
      "Cover bands and function musicians in Berlin looking for reliable players for gigs, weddings, and club dates.",
  },
  {
    slug: "schlager",
    name: "Schlager",
    keywords: ["schlager"],
    intro:
      "Schlager and German-language pop listings in Berlin — live bands and entertainers seeking gig-ready lineups.",
  },
  {
    slug: "indie-pop",
    name: "Indie pop",
    keywords: ["indie pop"],
    intro:
      "Indie pop musicians in Berlin building melodic, accessible songs with a DIY or small-label spirit.",
  },
  {
    slug: "synth-pop",
    name: "Synth pop",
    keywords: ["synth pop"],
    intro:
      "Synth pop projects in Berlin — electronic pop bands and producers looking for vocalists and live players.",
  },
];

const FUNK_SOUL_SUBGENRES: SubgenreSeed[] = [
  {
    slug: "funk",
    name: "Funk",
    keywords: ["funk"],
    intro:
      "Funk musicians in Berlin — horn sections, rhythm players, and groove-focused bands looking for tight lineups.",
  },
  {
    slug: "soul",
    name: "Soul",
    keywords: ["soul"],
    intro:
      "Soul singers and bands in Berlin seeking committed players for powerful vocals and groove-based arrangements.",
  },
  {
    slug: "rnb",
    name: "R&B",
    keywords: ["rnb", "r&b", "neo soul", "neosoul"],
    intro:
      "R&B and neo-soul listings in Berlin — vocal-led projects looking for keys, bass, drums, and backing musicians.",
  },
  {
    slug: "disco",
    name: "Disco",
    keywords: ["disco"],
    intro:
      "Disco and dance-oriented funk-soul listings in Berlin for live bands and party-focused collaborations.",
  },
];

const HIP_HOP_SUBGENRES: SubgenreSeed[] = [
  {
    slug: "rap",
    name: "Rap & hip-hop",
    keywords: ["rap", "hip hop", "hip-hop", "hiphop"],
    intro:
      "Rap and hip-hop listings in Berlin — MCs, producers, beatmakers, and live acts seeking collaborators.",
  },
];

const FOLK_ACOUSTIC_SUBGENRES: SubgenreSeed[] = [
  {
    slug: "folk",
    name: "Folk",
    keywords: ["folk"],
    intro:
      "Folk musicians and bands in Berlin — trad and contemporary folk projects, duos, and acoustic ensembles.",
  },
  {
    slug: "acoustic",
    name: "Acoustic",
    keywords: ["acoustic"],
    intro:
      "Acoustic-focused listings in Berlin for unplugged bands, intimate gigs, and singer-instrumentalist collaborations.",
  },
  {
    slug: "country",
    name: "Country",
    keywords: ["country"],
    intro:
      "Country and Americana-leaning musicians in Berlin looking for pedal steel, fiddle, guitar, and vocal collaborators.",
  },
  {
    slug: "singer-songwriter",
    name: "Singer-songwriter",
    keywords: ["singer-songwriter", "singer songwriter"],
    intro:
      "Singer-songwriter listings in Berlin — solo artists and small groups looking for harmony singers or light accompaniment.",
  },
  {
    slug: "bluegrass",
    name: "Bluegrass",
    keywords: ["bluegrass"],
    intro:
      "Bluegrass musicians in Berlin seeking banjo, mandolin, fiddle, and tight vocal harmony projects.",
  },
];

const CLASSICAL_SUBGENRES: SubgenreSeed[] = [
  {
    slug: "orchestra",
    name: "Orchestra",
    keywords: ["orchestra", "orchester"],
    intro:
      "Orchestra and orchestral musician listings in Berlin — sectional players and ensembles seeking concert projects.",
  },
  {
    slug: "choir",
    name: "Choir",
    keywords: ["choir", "chor"],
    intro:
      "Choir and choral listings in Berlin — vocal ensembles and singers looking for classical and contemporary choral work.",
  },
  {
    slug: "classical",
    name: "Classical",
    keywords: ["classical", "klassik"],
    intro:
      "Classical and Klassik listings in Berlin — trained musicians seeking chamber groups, pits, concerts, and formal projects.",
  },
];

const REGGAE_SUBGENRES: SubgenreSeed[] = [
  {
    slug: "reggae",
    name: "Reggae",
    keywords: ["reggae"],
    intro:
      "Reggae musicians and bands in Berlin — roots, dancehall-leaning, and live reggae projects seeking players.",
  },
  {
    slug: "ska",
    name: "Ska",
    keywords: ["ska"],
    intro:
      "Ska bands and musicians in Berlin looking for horns, upstroke guitar, and energetic live lineups.",
  },
  {
    slug: "dub",
    name: "Dub",
    keywords: ["dub"],
    intro:
      "Dub and reggae-adjacent listings in Berlin — bass-heavy, studio-leaning, and live dub projects.",
  },
];

const LATIN_SUBGENRES: SubgenreSeed[] = [
  {
    slug: "latin",
    name: "Latin",
    keywords: ["latin"],
    intro:
      "Latin music listings in Berlin — bilingual bands and musicians seeking percussion, piano, brass, and vocal collaborators.",
  },
  {
    slug: "cumbia",
    name: "Cumbia",
    keywords: ["cumbia"],
    intro:
      "Cumbia musicians and bands in Berlin looking for percussion-heavy, danceable Latin lineups.",
  },
];

const BLUES_SUBGENRES: SubgenreSeed[] = [
  {
    slug: "blues",
    name: "Blues",
    keywords: ["blues"],
    intro:
      "Blues-focused listings in Berlin — guitarists, harp players, vocalists, and bands dedicated to blues and blues-rock.",
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
