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
    "Mock prototype built around Ferdinand Omanyala's speed, discipline and global ambition.",
  upcomingRace: "FBK Games · Hengelo · 21 Jul 2026",
};

export const aboutStats: StatItem[] = [
  { value: 9.77, suffix: "s", label: "100m PB", decimals: 2 },
  { value: 1, suffix: "x", label: "Commonwealth gold" },
  { value: 10, suffix: "x", label: "sub-10 races", decimals: 0 },
  { value: 11, suffix: "", label: "current world ranking", prefix: "#" },
];

// MOCK DATA: illustrative placeholder content for the prototype only.
export const raceEntries: RaceEntry[] = [
  {
    name: "Addis Ababa Grand Prix",
    url:"/hero.jfif",
    location: "Addis Ababa",
    date: "18 Apr 2026",
    time: "9.98s",
    place: "1st",
    imageLabel: "Track start line",
  },
  {
    name: "Kip Keino Classic",
    url: "/kip-keino-classic.jfif",
    location: "Nairobi",
    date: "24 Apr 2026",
    time: "9.96s",
    place: "1st",
    imageLabel: "Nairobi stadium finish",
  },
  {
    name: "Botswana Grand Prix",
    url: "/botswana-grand-prix.jfif",
    location: "Gaborone",
    date: "26 Apr 2026",
    time: "9.95s",
    place: "1st",
    imageLabel: "Running lane in motion",
  },
  {
    name: "Diamond League, Xiamen",
    url: "/diamond-league-xiamen.jfif",
    location: "Xiamen",
    date: "23 May 2026",
    time: "9.94s",
    place: "1st",
    imageLabel: "Athlete on the curve",
  },
  {
    name: "Kenya National Championships",
    url: "/kenya-national-championships.jfif",
    location: "Nairobi",
    date: "20 Jun 2026",
    time: "10.00s",
    place: "1st",
    imageLabel: "National championship podium",
  },
  {
    name: "Commonwealth Games Trials",
    url: "/commonwealth-games-trials.jfif",
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
    price: "KES 18,500",
    imageLabel: "Lightning-fast track spike",
    description: "Carbon plate speed for explosive starts.",
  },
  {
    name: "Velocity Tee",
    price: "KES 3,200",
    imageLabel: "Performance training tee",
    description: "Breathable compression for hard reps.",
  },
  {
    name: "Pulse Recovery Kit",
    price: "KES 7,900",
    imageLabel: "Recovery foam roller and band",
    description: "Recovery essentials between sessions.",
  },
  {
    name: "Track Pack",
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
  
];

export const socials = [
  { platform: "Instagram", handle: "@ferdinandomanyala", followers: "86K", accent: "#E4272A" },
  { platform: "X", handle: "@F_Omanyala", followers: "41K", accent: "#F5F5F0" },
  { platform: "TikTok", handle: "@fastafrican", followers: "22K", accent: "#D4FF3F" },
  { platform: "YouTube", handle: "Ferdinand Omanyala", followers: "10K", accent: "#F5F5F0" },
];
