/**
 * data/about.ts — Content data for the /about page.
 *
 * TODO: replace with verified facts before production launch.
 * All times, dates, records, and awards marked below are illustrative placeholders
 * structured for easy replacement.
 */

export interface HeroSlide {
  src: string;
  alt: string;
  caption?: string;
}

export interface StoryChapter {
  year: string;
  title: string;
  body: string;
  image: string;
  alt: string;
}

export interface RaceVideo {
  id: string;
  title: string;
  venue: string;
  date: string;
  result: string;
  thumbnail: string;
  videoUrl: string;
  type: "youtube" | "mp4";
}

export type AwardCategory = "Records" | "Medals" | "Honours";

export interface AwardItem {
  id: string;
  year: string;
  title: string;
  organisation: string;
  category: AwardCategory;
  icon: "trophy" | "medal" | "award" | "zap";
}

export interface AboutStat {
  label: string;
  value: number;
  suffix: string;
  prefix?: string;
  decimals?: number;
}

export const heroEyebrow = "Ferdinand Omanyala · Biography";

export const heroHeading = "The Story Behind the Speed";

export const heroSlides: HeroSlide[] = [
  {
    src: "/hero.jpeg",
    alt: "Ferdinand Omanyala exploding out of the starting blocks on the track",
    caption: "Starting Blocks · Nairobi",
  },
  {
    src: "/about.jpeg",
    alt: "Portrait of Ferdinand Omanyala in sprint training gear",
    caption: "Preparation & Focus",
  },
  {
    src: "/images/kipkeino.jpeg",
    alt: "Ferdinand Omanyala crossing the finish line at Kasarani Stadium",
    caption: "Kasarani · Home Crowd",
  },
  {
    src: "/abt.jpeg",
    alt: "Ferdinand Omanyala celebrating after a 100m race",
    caption: "Championship Mentality",
  },
];

// TODO: replace with verified facts
export const storyChapters: StoryChapter[] = [
  {
    year: "1996",
    title: "Early Life in Western Kenya",
    body: "Born in Hamisi, Vihiga County, Ferdinand grew up with relentless energy and a natural affinity for team sports. Long before the stopwatch entered his life, he spent his afternoons competing on dusty school fields.",
    image: "/about.jpeg",
    alt: "Portrait representing Ferdinand Omanyala's early roots in Kenya",
  },
  {
    year: "2015",
    title: "The Rugby Pitch",
    body: "Before track and field, rugby was his first arena. Playing wing at the University of Nairobi sharpened his top-end acceleration and physical power—traits that coaches immediately noticed whenever he broke down the touchline.",
    image: "/craw.jpeg",
    alt: "Explosive athletic stance reflecting early rugby conditioning",
  },
  {
    year: "2016",
    title: "First Spikes on the Track",
    body: "A friend's challenge led him to enter a university 100m race, where he clocked a raw, untrained time that turned heads. Trading rugby boots for sprint spikes, he committed to learning block starts, drive phase mechanics, and sprint rhythm.",
    image: "/abt.jpeg",
    alt: "Ferdinand Omanyala in sprint training",
  },
  {
    year: "2020",
    title: "The Breakthrough Season",
    body: "Through disciplined strength work and technical refinement, he began dipping consistently toward the 10-second barrier. Each meet proved that East African sprinting could rival the world's traditional sprint powerhouses.",
    image: "/images/knc.jpeg",
    alt: "Competing at the Kenyan national track championships",
  },
  {
    year: "2021",
    title: "National & African Records",
    body: "In a landmark season, he broke the Kenyan national record multiple times before making history on home soil at Kasarani. Clocking 9.77s in Nairobi, he shattered the African 100m record and announced a new era for Kenyan sprinting.", // TODO: replace with verified facts
    image: "/images/kipkeino.jpeg",
    alt: "Historic 100m sprint finish at Kasarani Stadium in Nairobi",
  },
  {
    year: "2022",
    title: "Continental Dominance",
    body: "Carrying the expectations of a continent, he captured major championship gold on both the African and Commonwealth stages. His commanding victories cemented his reputation as a big-occasion performer.", // TODO: replace with verified facts
    image: "/images/coomon.jpeg",
    alt: "Celebrating championship gold on the podium",
  },
  {
    year: "NOW",
    title: "Fastest Man in Africa",
    body: "Today, Ferdinand competes at the highest level of global athletics while mentoring the next generation of Kenyan sprinters. Every start is a statement: speed has no borders.",
    image: "/hero.jpeg",
    alt: "Ferdinand Omanyala in full sprint stride",
  },
];

// TODO: replace with verified facts
export const races: RaceVideo[] = [
  {
    id: "kip-keino-classic",
    title: "Kip Keino Classic 100m",
    venue: "Kasarani Stadium, Nairobi",
    date: "2021 · Placeholder Date",
    result: "9.77s · 1st",
    thumbnail: "/images/kipkeino.jpeg",
    videoUrl: "/he.mp4",
    type: "mp4",
  },
  {
    id: "asa-grand-prix",
    title: "ASA Grand Prix Final",
    venue: "Johannesburg, South Africa",
    date: "2023 · Placeholder Date",
    result: "10.12s · 1st",
    thumbnail: "/images/botswana.jpeg",
    videoUrl:
      "/Ferdinand_Omanyala_is_just_world-class._n_nHe_puts_on_a_dominant_performance_to_win_the_Men_E2_80_99s_100m_final_with_a_quick_time_of_10.12_at_the__23ASAGrandPr.mp4",
    type: "mp4",
  },
  {
    id: "commonwealth-final",
    title: "Commonwealth Games 100m Final",
    venue: "Alexander Stadium, Birmingham",
    date: "2022 · Placeholder Date",
    result: "10.02s · Gold",
    thumbnail: "/images/coomon.jpeg",
    videoUrl: "/heroo.mp4",
    type: "mp4",
  },
  {
    id: "xiamen-diamond-league",
    title: "Diamond League 100m",
    venue: "Egret Stadium, Xiamen",
    date: "2024 · Placeholder Date",
    result: "9.94s · Placeholder",
    thumbnail: "/images/xiamen.jpeg",
    // TODO: replace with verified YouTube race highlight ID
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    type: "youtube",
  },
  {
    id: "kenya-nationals",
    title: "Kenya National Championships",
    venue: "Nyayo Stadium, Nairobi",
    date: "2024 · Placeholder Date",
    result: "9.98s · 1st",
    thumbnail: "/images/knc.jpeg",
    videoUrl: "/he.mp4",
    type: "mp4",
  },
];

// TODO: replace with verified facts
export const stats: AboutStat[] = [
  { label: "100m Personal Best", value: 9.77, suffix: "s", decimals: 2 },
  { label: "Sub-10s Performances", value: 12, suffix: "+", decimals: 0 },
  { label: "Major Championship Medals", value: 6, suffix: "", decimals: 0 },
  { label: "National Records Set", value: 4, suffix: "+", decimals: 0 },
];

// TODO: replace with verified facts
export const awards: AwardItem[] = [
  {
    id: "rec-african-100m",
    year: "2021",
    title: "African 100m Record (9.77s)",
    organisation: "World Athletics · Kip Keino Classic",
    category: "Records",
    icon: "zap",
  },
  {
    id: "rec-kenya-100m",
    year: "2021",
    title: "Kenyan National 100m Record",
    organisation: "Athletics Kenya",
    category: "Records",
    icon: "zap",
  },
  {
    id: "rec-indoor-60m",
    year: "2023",
    title: "National 60m Indoor Record (6.54s)",
    organisation: "World Athletics Indoor Tour",
    category: "Records",
    icon: "zap",
  },
  {
    id: "med-commonwealth-gold",
    year: "2022",
    title: "Commonwealth Games 100m Gold Medal",
    organisation: "Commonwealth Games Federation · Birmingham",
    category: "Medals",
    icon: "medal",
  },
  {
    id: "med-african-champ-100m",
    year: "2022",
    title: "African Championships 100m Gold Medal",
    organisation: "Confederation of African Athletics",
    category: "Medals",
    icon: "medal",
  },
  {
    id: "med-african-relay",
    year: "2022",
    title: "African Championships 4×100m Relay Gold",
    organisation: "Confederation of African Athletics",
    category: "Medals",
    icon: "trophy",
  },
  {
    id: "hon-soya-sportsman",
    year: "2022",
    title: "SOYA Sportsman of the Year",
    organisation: "Sports Personality of the Year Awards · Kenya",
    category: "Honours",
    icon: "award",
  },
  {
    id: "hon-state-commendation",
    year: "2022",
    title: "Order of the Grand Warrior (OGW) — Placeholder",
    organisation: "Republic of Kenya",
    category: "Honours",
    icon: "trophy",
  },
];
