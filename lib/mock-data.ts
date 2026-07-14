export type RaceEntry = {
  name: string;
  url: string;
  location: string;
  date: string;
  time: string;
  place: string;
  imageLabel: string;
};
export type Partner ={
  name:string;
  
   logo:string;
};

export type ProductItem = {
  name: string;
  price: string;
  url:string;
  imageLabel: string;
  description: string;
};

export type StatItem = {
  value: number;
  suffix: string;
  prefix?: string;
  label: string;
  decimals?: number;
};

export const heroData = {
  eyebrow: "LAST RACE",
  event: "Kip Keino Classic",
  location: "Nairobi",
  date: "24 Apr 2026",
  time: "9.96s",
  place: "1st place",
  headline: "AFRICA'S FASTEST MAN",
  subheadline:
    "Ferdinand is an olympian, African record holder, African commonwealth champion and an Adidas athlete.",
  upcomingRace: "FBK Games · Hengelo · 21 Jul 2026",
};

export const aboutStats: StatItem[] = [
  { value: 9.77, suffix: "s", label: "100m PB", decimals: 2 },
  { value: 1, suffix: "x", label: "Commonwealth gold" },
  { value: 10, suffix: "x", label: "sub-10 races", decimals: 0 },
  { value: 11, suffix: "", label: "current world ranking", prefix: "#" },
];
export const foundStats: StatItem[] = [
  { value: 9.77, suffix: "s", label: "Can change lives", decimals: 2 },
  { value: 2, suffix: "x", label: "school Partners" },
  { value: 30, suffix: "x", label: "Sprint club members", decimals: 0 },
  { value: 1, suffix: " M+", label: "Money donated", prefix: "#" },
];

// MOCK DATA: illustrative placeholder content for the prototype only.
export const raceEntries: RaceEntry[] = [
  {
    name: "Addis Ababa Grand Prix",
    url:"/hero.jpeg",
    location: "Addis Ababa",
    date: "18 Apr 2026",
    time: "9.98s",
    place: "1st",
    imageLabel: "Track start line",
  },
  {
    name: "Kip Keino Classic",
    url: "/images/kipkeino.jpeg",
    location: "Nairobi",
    date: "24 Apr 2026",
    time: "9.96s",
    place: "1st",
    imageLabel: "Nairobi stadium finish",
  },
  {
    name: "Botswana Grand Prix",
    url: "/images/botswana.jpeg",
    location: "Gaborone",
    date: "26 Apr 2026",
    time: "9.95s",
    place: "1st",
    imageLabel: "Running lane in motion",
  },
  {
    name: "Diamond League, Xiamen",
    url: "/images/xiamen.jpeg",
    location: "Xiamen",
    date: "23 May 2026",
    time: "9.94s",
    place: "1st",
    imageLabel: "Athlete on the curve",
  },
  {
    name: "Kenya National Championships",
    url: "/images/knc.jpeg",
    location: "Nairobi",
    date: "20 Jun 2026",
    time: "10.00s",
    place: "1st",
    imageLabel: "National championship podium",
  },
  {
    name: "Commonwealth Games Trials",
    url: "/images/coomon.jpeg",
    location: "Nairobi",
    date: "20 Jun 2026",
    time: "10.00s",
    place: "1st",
    imageLabel: "Warm-up lane",
  },
];

export const products: ProductItem[] = [
  {
    name: "Aero Spike 9",
    url: "/shopping.webp",
    price: "KES 18,500",
    imageLabel: "Lightning-fast track spike",
    description: "Carbon plate speed for explosive starts.",
  },
  {
    name: "Velocity Tee",
    url:"/tee.jpeg",
    price: "KES 3,200",
    imageLabel: "Performance training tee",
    description: "Breathable compression for hard reps.",
  },
  {
    name: "Pulse Recovery Kit",
    url: "/kit.jpeg",
    price: "KES 7,900",
    imageLabel: "Recovery foam roller and band",
    description: "Recovery essentials between sessions.",
  },
  {
    name: "Track Pack",
    url:"/pack.jpeg",
    price: "KES 12,400",
    imageLabel: "Athlete duffel with race kit",
    description: "Built for travel and competition weeks.",
  },
];

export const partners: Partner[]= [
  {
    name: "Adidas",
    logo: "/1.png"
  },
  {
    name: "Adidas",
    logo: "/2.png"
  },
  {
    name: "Adidas",
    logo: "/4.png"
  },
  {
    name: "Adidas",
    logo: "/8.png"
  },
  {
    name: "Adidas",
    logo: "/medex.png"
  },
  {
    name: "mer",
    logo: "/mer.jpeg"
  },
  {
    name: "craw",
    logo: "/craw.jpeg"
  },
  
];

export const socials = [
  { platform: "Instagram", handle: "@ferdinandomanyala", followers: "86K", accent: "#E4272A" },
  { platform: "X", handle: "@F_Omanyala", followers: "41K", accent: "#F5F5F0" },
  { platform: "TikTok", handle: "@fastafrican", followers: "22K", accent: "#D4FF3F" },
  { platform: "YouTube", handle: "Ferdinand Omanyala", followers: "10K", accent: "#F5F5F0" },
];
