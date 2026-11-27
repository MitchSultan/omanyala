/**
 * data/foundation.ts — Content data for the /foundation page.
 *
 * TODO: replace with verified foundation content before production launch.
 * All statistics, dates, partner lists, and program details below are
 * clearly marked placeholders.
 */

export interface FoundationHeroData {
  eyebrow: string;
  headline: string;
  subtext: string;
  image: string;
  imageAlt: string;
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta: {
    label: string;
    href: string;
  };
}

export interface FoundationAboutData {
  eyebrow: string;
  heading: string;
  paragraphs: string[];
  image: string;
  imageAlt: string;
}

export interface FoundationStat {
  label: string;
  value: number;
  suffix: string;
  prefix?: string;
  decimals?: number;
}

export interface StatementBlock {
  numeral: string;
  title: string;
  statement: string;
}

export type PassionIconKey =
  | "users"
  | "flame"
  | "graduationCap"
  | "heartHandshake"
  | "target"
  | "sparkles";

export interface PassionItem {
  id: string;
  icon: PassionIconKey;
  title: string;
  description: string;
}

export interface FoundationProject {
  slug: string;
  name: string;
  tag: "Flagship" | "Community" | "Partnership";
  description: string;
  image: string;
  imageAlt: string;
  details: {
    location: string;
    frequency: string;
    partners: string[];
  };
  // TODO: add verified detail route when project detail pages exist
  href?: string;
}

// TODO: replace with verified foundation content
export const foundationHero: FoundationHeroData = {
  eyebrow: "The Omanyala Foundation",
  headline: "Building Pathways From Every Starting Line.",
  subtext:
    "Empowering young athletes across Kenya with access to sprint coaching, safe facilities, education, and community support.",
  image: "/found.jpeg",
  imageAlt:
    "Ferdinand Omanyala mentoring and inspiring young Kenyan athletes on the track",
  primaryCta: {
    label: "Our Projects",
    href: "#projects",
  },
  secondaryCta: {
    label: "Get Involved",
    href: "mailto:hello@ferdinandomanyala.co.ke?subject=Omanyala%20Foundation%20%E2%80%94%20Get%20Involved",
  },
};

// TODO: replace with verified foundation content
export const foundationAbout: FoundationAboutData = {
  eyebrow: "About the Foundation",
  heading: "Speed is only the beginning.",
  paragraphs: [
    "The Omanyala Foundation Trust is a community-driven initiative dedicated to unlocking athletic and personal potential for young people across underserved regions in Kenya.",
    "By pairing structured sprint development with school partnerships, mentorship, and equipment access, we help promising talent transition from dusty school fields to structured training environments.",
    "Every clinic, festival, and scholarship is designed around one belief: geography or background should never decide who gets a fair lane.",
  ],
  image: "/about.jpeg",
  imageAlt: "Ferdinand Omanyala on the track during a foundation training session",
};

// TODO: replace with verified foundation content
export const foundationStats: FoundationStat[] = [
  { label: "Young Athletes Reached", value: 1200, suffix: "+" },
  { label: "Partner Schools", value: 18, suffix: "" },
  { label: "Community Clinics Held", value: 24, suffix: "+" },
  { label: "Counties Engaged", value: 8, suffix: "" },
];

// TODO: replace with verified foundation content
export const vision: StatementBlock = {
  numeral: "01",
  title: "Vision",
  statement:
    "A future where every young sprinter in Africa has the coaching, safe space, and belief to chase world-class excellence without leaving their community behind.",
};

// TODO: replace with verified foundation content
export const mission: StatementBlock = {
  numeral: "02",
  title: "Mission",
  statement:
    "To discover, nurture, and sustain grassroots athletics talent through accessible sprint festivals, structured club pathways, educational support, and accountable partnerships.",
};

// TODO: replace with verified foundation content
export const passions: PassionItem[] = [
  {
    id: "youth-development",
    icon: "users",
    title: "Youth Development",
    description:
      "Mentoring teenagers on discipline, nutrition, confidence, and life skills beyond the finish line.",
  },
  {
    id: "grassroots-athletics",
    icon: "flame",
    title: "Grassroots Athletics",
    description:
      "Bringing timing gates, sprint spikes, and certified coaching directly to local communities.",
  },
  {
    id: "education",
    icon: "graduationCap",
    title: "Education & Scholarships",
    description:
      "Pairing athletic ambition with classroom continuity so student-athletes thrive academically.",
  },
  {
    id: "community",
    icon: "heartHandshake",
    title: "Community Cohesion",
    description:
      "Turning local streets and school grounds into inclusive spaces for healthy movement.",
  },
  {
    id: "talent-id",
    icon: "target",
    title: "Talent Identification",
    description:
      "Creating open, measurable sprint trials that spot raw speed regardless of background.",
  },
  {
    id: "women-in-sport",
    icon: "sparkles",
    title: "Women in Sport",
    description:
      "Championing equal lane access, female coaching mentorship, and safe participation for girls.",
  },
];

// TODO: replace with verified foundation content
export const projects: FoundationProject[] = [
  {
    slug: "street-sprint-festival",
    name: "Street Sprint Festival",
    tag: "Flagship",
    description:
      "A high-energy urban and community sprint showcase that brings electronic timing, music, and open 60m–100m heats directly to neighborhood streets and public grounds.",
    image: "/images/kipkeino.jpeg",
    imageAlt: "Athletes competing in the Street Sprint Festival",
    details: {
      location: "Nairobi & Regional Hubs (Placeholder)",
      frequency: "Annual Series",
      partners: ["Local Athletics Clubs", "Community Youth Boards"],
    },
  },
  {
    slug: "omanyala-sprint-club",
    name: "Omanyala Sprint Club",
    tag: "Community",
    description:
      "A structured grassroots training academy offering weekly speed mechanics, strength foundations, and mentorship for emerging junior sprinters.",
    image: "/abt.jpeg",
    imageAlt: "Junior sprinters training at Omanyala Sprint Club",
    details: {
      location: "Nairobi, Kenya (Placeholder)",
      frequency: "Year-Round Weekly Sessions",
      partners: ["Partner Schools", "Volunteer Coaches"],
    },
  },
  {
    slug: "collaborative-initiatives",
    name: "Collaborative Initiatives",
    tag: "Partnership",
    description:
      "Joint impact programs with brand sponsors, schools, and civic organisations—delivering kit drives, track clinics, and student-athlete bursaries.",
    image: "/images/knc.jpeg",
    imageAlt: "Collaborative school athletics outreach and kit distribution",
    details: {
      location: "Nationwide · Kenya (Placeholder)",
      frequency: "Quarterly Outreach",
      partners: ["Corporate Partners (TBD)", "County Sports Offices"],
    },
  },
  {
    slug: "school-track-clinics",
    name: "School Track Clinics",
    tag: "Partnership",
    description:
      "On-campus sprint workshops equipping physical education teachers and student-athletes with modern warm-up, block-start, and injury-prevention routines.",
    image: "/images/botswana.jpeg",
    imageAlt: "Students participating in a school track clinic",
    details: {
      location: "Western & Rift Regions (Placeholder)",
      frequency: "Termly Clinics",
      partners: ["Secondary School Networks (Placeholder)"],
    },
  },
];

// TODO: replace with verified foundation content
export const foundationCta = {
  eyebrow: "Partner With Us",
  heading: "Help us build the next lane.",
  body: "Whether you are a brand sponsor, school administrator, coach, or community volunteer, your support puts spikes on feet and opens doors for young Kenyan athletes.",
  primaryLabel: "Get in Touch",
  primaryHref:
    "mailto:hello@ferdinandomanyala.co.ke?subject=Omanyala%20Foundation%20Partnership",
};
